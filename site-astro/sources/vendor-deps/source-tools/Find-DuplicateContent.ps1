#requires -Version 7.2
<#
.SYNOPSIS
查找跨文件相同句子和相似段落；只读诊断，不自动删改。
.DESCRIPTION
默认扫描三个基座的 Markdown / TXT；-IncludeJson 加扫说明字段。
Git 仓库默认只扫描已跟踪文件；-IncludeUntracked 加扫未被忽略的新文件。
非 Git 目录照常扫描；不会进入 Git 忽略的生成或恢复载体目录。
第三方包和许可证默认跳过，-IncludeThirdParty 取消该过滤（仍遵守 Git 文件范围）。
退出码：0 无待处理重复，1 有重复，2 扫描不完整或参数/读取出错。
冻结名单默认从核验通过的活动 context_sources_contract 读取。
-ContextSourcesPath 仅供合成测试或明确指定的名单来源，不复制名单。
-ExcludePath 为相对每个扫描根的通配路径，可排除项目自己的生成区。
例外逐组匹配 config/duplicate-content-exceptions.json；-IncludeExcepted 可查看。
每个扫描根的 .duplicate-content-exceptions.json 使用相同 schema，paths 相对本仓库，
只处理该根内部的重复。中央文件用于基座和跨仓库例外；摘要给出每项来源。
相似度为字符三元片段集合的 Dice 系数，归属只是启发式建议。
.EXAMPLE
& ./tools/Find-DuplicateContent.ps1 -Root @('E:\.agents','E:\GitHub总索引') -Json
#>
[CmdletBinding()]
param(
    [Alias('Roots')][string[]] $Root = @('E:\.agents', 'E:\GitHub总索引', 'E:\PCConfig'),
    [switch] $IncludeJson,
    [switch] $IncludeUntracked,
    [switch] $IncludeThirdParty,
    [string[]] $JsonField = @('notes','description','reason','purpose','summary','explanation','exit_condition'),
    [int] $MinSentenceLength = 20,
    [int] $MinParagraphLength = 40,
    [double] $SimilarityThreshold = 0.8,
    [string[]] $ExcludePath = @(),
    [string] $ContextSourcesPath,
    [string] $ExceptionsPath = (Join-Path $PSScriptRoot '../config/duplicate-content-exceptions.json'),
    [switch] $IncludeExcepted,
    [switch] $Json
)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$watch = [Diagnostics.Stopwatch]::StartNew()
$errors = [Collections.Generic.List[string]]::new()
$skipped = [Collections.Generic.List[object]]::new()
$files = [Collections.Generic.List[object]]::new()
$exceptionRules = [Collections.Generic.List[object]]::new()
$seen = [Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
$skipNames = [Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
@('.git','releases','dist','build','out','output','outputs','generated','_generated',
  '.venv','venv','__pycache__','.cache','cache','.tmp','tmp','temp','artifacts','coverage',
  'bin','obj','.next','.nuxt','.pytest_cache','state','generations','_preimage','99_private') | ForEach-Object { [void]$skipNames.Add($_) }
function Get-RepositoryName([string]$Directory) {
    # Also resolve identity when a caller selects a subdirectory of a checkout.
    $remote = & git -C $Directory config --get remote.origin.url 2>$null
    if ($LASTEXITCODE -eq 0 -and $remote -match '[:/]([^/:]+/[^/]+?)(?:\.git)?/?$') { return $Matches[1] }
    return [IO.Path]::GetFileName($Directory)
}
function Test-Frozen([string]$Directory, [string]$Repository) {
    return @($Directory -split '[/\\]' | Where-Object { $frozen.Contains($_) }).Count -gt 0 -or $frozen.Contains(($Repository -split '/')[-1])
}
function Get-GitVisiblePaths([string]$Directory) {
    $arguments = @('-C',$Directory,'ls-files','--cached','-z')
    if ($IncludeUntracked) { $arguments += @('--others','--exclude-standard') }
    $raw = & git @arguments 2>$null
    if ($LASTEXITCODE -ne 0) { throw "Cannot enumerate Git-visible files: $Directory" }
    $visibleFiles=[Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
    $visibleDirectories=[Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
    foreach($relative in (($raw -join "`n") -split "`0" | Where-Object { $_ })) {
        $relative=$relative.Replace('\','/')
        [void]$visibleFiles.Add($relative)
        $parent=$relative.TrimEnd('/')
        if($relative.EndsWith('/')){[void]$visibleDirectories.Add($parent)}
        while($parent.Contains('/')) { $parent=$parent.Substring(0,$parent.LastIndexOf('/')); [void]$visibleDirectories.Add($parent) }
    }
    return @{files=$visibleFiles;directories=$visibleDirectories}
}
function Read-ExceptionRules([string]$Path, [string]$ScopeRoot) {
    $config=Get-Content -LiteralPath $Path -Raw -Encoding utf8 | ConvertFrom-Json -Depth 30
    if ($config.schema -ne 'agents.duplicate-content-exceptions.v1') { throw "Unsupported exception schema: $Path" }
    foreach ($entry in $config.exceptions) {
        foreach ($key in @('id','owner','reason','exit_condition','paths')) {
            if (-not $entry.PSObject.Properties[$key] -or -not $entry.$key) { throw "Incomplete exception ($key): $Path" }
        }
        if ($ScopeRoot) {
            foreach($pattern in $entry.paths) {
                if ([IO.Path]::IsPathRooted($pattern) -or $pattern -match '(^|[/\\])\.\.([/\\]|$)') { throw "Local exception paths must stay relative to this repository: $Path" }
            }
        }
        $exceptionRules.Add([pscustomobject]@{rule=$entry;source=[IO.Path]::GetFullPath($Path);scope_root=$ScopeRoot;matched_groups=0})
    }
}
function Get-HomeSuggestion($Group) {
    $places = @($Group.occurrences)
    $text = $Group.excerpt
    $owner = '具体项目'; $reason = '业务内容默认由所在项目维护，需人工确认。'
    if (@($places | Where-Object path -eq 'docs/owner-decisions.md').Count) {
        $owner = 'E:\.agents\docs\owner-decisions.md'; $reason = '命中决定原话文档；原话留在此处，现行规则引用编号。'
    } elseif ($text -match '计划任务|机器|端口|备份|运行环境|安装路径|Task Scheduler') {
        $owner = 'E:\PCConfig'; $reason = '涉及机器、路径、任务或备份；行为规则仍可能归 .agents。'
    } elseif ($text -match '仓库|分支|远端|worktree|visibility|transport|repo identity|GitHub') {
        $owner = 'E:\GitHub总索引'; $reason = '涉及仓库身份或同步；授权和公开分级仍归 .agents。'
    } elseif ($text -match '本人|授权|规则|技能|冻结|子代理|skill|permission|agent' -or @($places | Where-Object path -like 'docs/contracts/agents.*').Count) {
        $owner = 'E:\.agents'; $reason = '涉及行为、技能或跨项目协作。'
    }
    $candidate = $places | Where-Object { $_.path -eq 'docs/owner-decisions.md' -and $owner.EndsWith('owner-decisions.md') } | Select-Object -First 1
    if (-not $candidate) { $candidate = $places | Where-Object { $_.path -like 'docs/contracts/*' } | Select-Object -First 1 }
    return [ordered]@{ owner=$owner; candidate=$(if($candidate){$candidate.full_path}else{$null}); reason=$reason; confidence='heuristic' }
}
try {
    if ($Root.Count -eq 0 -or $MinSentenceLength -lt 1 -or $MinParagraphLength -lt 3 -or
        [double]::IsNaN($SimilarityThreshold) -or $SimilarityThreshold -le 0 -or $SimilarityThreshold -gt 1) { throw 'Invalid roots, lengths or similarity threshold.' }
    if (-not $ContextSourcesPath) {
        $release = & (Join-Path $PSScriptRoot 'Invoke-EAgentRulesRelease.ps1') -Mode Inspect -Json | ConvertFrom-Json -Depth 60
        if ($release.status -ne 'pass' -or $release.reason -ne 'e_rules_active_verified') { throw 'Active frozen-project source could not be verified.' }
        $ContextSourcesPath = $release.verified_current.required_rule_paths.context_sources_contract
    }
    $source = Get-Content -LiteralPath $ContextSourcesPath -Raw -Encoding utf8
    $section = [regex]::Match($source, '(?ms)^## 冻结的项目\s*\r?\n(.*?)(?=^## |\z)')
    if (-not $section.Success) { throw 'Frozen-project section missing.' }
    $frozen = [Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
    foreach ($match in [regex]::Matches($section.Groups[1].Value, '(?m)^\|[^\r\n|]+\|\s*`(?:[^`/]+/)?([^`]+)`\s*\|')) { [void]$frozen.Add($match.Groups[1].Value) }
    if ($frozen.Count -eq 0) { throw 'Frozen-project table missing or empty.' }
    Read-ExceptionRules $ExceptionsPath ''
    foreach ($requested in $Root) {
        $full = [IO.Path]::GetFullPath($requested)
        if (-not (Test-Path -LiteralPath $full -PathType Container)) { $errors.Add("Root missing: $full"); continue }
        $full = (Get-Item -LiteralPath $full).FullName
        $repo = Get-RepositoryName $full
        $pending = [Collections.Generic.Stack[object]]::new()
        $pending.Push(@{ directory=$full; repository=$repo; root=$full; visible=$null })
        while ($pending.Count) {
            $item = $pending.Pop(); $directory = $item.directory
            if (-not $seen.Add($directory)) { continue }
            if ((Get-Item -LiteralPath $directory -Force).Attributes -band [IO.FileAttributes]::ReparsePoint) { $skipped.Add(@{path=$directory;reason='link'}); continue }
            if (Test-Frozen $directory $item.repository) { $skipped.Add(@{path=$directory;reason='frozen'}); continue }
            if($directory -eq $item.root) {
                $localExceptions=Join-Path $directory '.duplicate-content-exceptions.json'
                if(Test-Path -LiteralPath $localExceptions -PathType Leaf) {
                    try { Read-ExceptionRules $localExceptions $directory }
                    catch { $errors.Add($_.Exception.Message) }
                }
            }
            $visible=$item.visible
            if(Test-Path -LiteralPath (Join-Path $directory '.git')) {
                try { $visible=Get-GitVisiblePaths $directory }
                catch { $errors.Add($_.Exception.Message); continue }
            }
            try { $children = @(Get-ChildItem -LiteralPath $directory -Force -ErrorAction Stop) }
            catch { $errors.Add("Cannot enumerate ${directory}: $($_.Exception.Message)"); continue }
            foreach ($child in $children) {
                $relative = [IO.Path]::GetRelativePath($item.root,$child.FullName).Replace('\','/')
                $excluded = @($ExcludePath | Where-Object { $relative -like $_ }).Count -gt 0
                if ($excluded -or ($child.Attributes -band [IO.FileAttributes]::ReparsePoint)) { $skipped.Add(@{path=$child.FullName;reason='excluded_or_link'}); continue }
                if ($child.PSIsContainer) {
                    $thirdParty = $child.Name -match '(?i)^(?:node_modules|vendor|third[-_]?party|driver-exports|exported-drivers)$|_vendor$|\.dist-info$' -or $relative -match '(?i)(^|/)recovery-assets/drivers(?:/|$)'
                    if($thirdParty -and -not $IncludeThirdParty) { $skipped.Add(@{path=$child.FullName;reason='third_party'}); continue }
                    if ($skipNames.Contains($child.Name)) { $skipped.Add(@{path=$child.FullName;reason='generated_or_runtime_directory'}); continue }
                    if($visible -and -not $visible.directories.Contains($relative)) { $skipped.Add(@{path=$child.FullName;reason='git_ignored_or_empty'}); continue }
                    $childRepo=$item.repository; $childRoot=$item.root
                    if (Test-Path -LiteralPath (Join-Path $child.FullName '.git')) { $childRepo=Get-RepositoryName $child.FullName; $childRoot=$child.FullName }
                    $pending.Push(@{directory=$child.FullName;repository=$childRepo;root=$childRoot;visible=$visible}); continue
                }
                if($visible -and -not $visible.files.Contains($relative)) { continue }
                $license = $child.Name -match '(?i)license|^(?:COPYING|NOTICE)(?:[._-].*)?$'
                if($license -and -not $IncludeThirdParty) { $skipped.Add(@{path=$child.FullName;reason='third_party_license'}); continue }
                $licenseText=$license -and $child.Extension -in @('','.txt','.md','.markdown','.rst','.text','.gpl','.lgpl','.mit','.bsd')
                if ($child.Extension -notin @('.md','.markdown','.txt') -and -not ($IncludeJson -and $child.Extension -eq '.json') -and -not ($IncludeThirdParty -and $licenseText)) { continue }
                $files.Add(@{full_path=$child.FullName;repository=$item.repository;root=$item.root;path=$relative})
            }
        }
    }
    if (-not ('DuplicateContent.Scanner' -as [type])) { Add-Type -Path (Join-Path $PSScriptRoot 'FindDuplicateContent.cs') }
    $scanner = [DuplicateContent.Scanner]::new($MinSentenceLength,$MinParagraphLength,$SimilarityThreshold,$JsonField)
    $scanned = 0
    foreach ($file in @($files | Sort-Object full_path -Unique)) {
        try {
            $body = [IO.File]::ReadAllText($file.full_path,[Text.UTF8Encoding]::new($false,$true))
            if ($body.Substring(0,[Math]::Min(1500,$body.Length)) -match '(?i)<!--\s*(?:pcconfig-publication:|source=git_and_github_owner_providers|generated\b)|DO NOT EDIT|此文件由.+自动生成') {
                $skipped.Add(@{path=$file.full_path;reason='generated_header'}); continue
            }
            $scanner.AddFile($body,$file.full_path,$file.repository,$file.root,$file.path)
            $scanned++
        } catch { $errors.Add("Cannot scan $($file.full_path): $($_.Exception.Message)") }
    }
    $groups = [Collections.Generic.List[object]]::new(); $excepted = [Collections.Generic.List[object]]::new()
    foreach ($group in $scanner.Finish()) {
        $entry = [ordered]@{ kind=$group.Kind; excerpt=$group.Excerpt; content_hash=$group.Hash; similarity=$group.Similarity; occurrences=@($group.Occurrences); suggested_home=$null }
        $entry.suggested_home = Get-HomeSuggestion $entry
        $matched = $null
        foreach ($registration in $exceptionRules) {
            $exception=$registration.rule
            if($registration.scope_root -and @($entry.occurrences | Where-Object root -ne $registration.scope_root).Count) { continue }
            if ($exception.PSObject.Properties['content_hash'] -and $exception.content_hash -ne $entry.content_hash) { continue }
            $outside = @($entry.occurrences | Where-Object {
                $location = $_
                $locationPath=if($registration.scope_root){$location.path}else{"$($location.repository)/$($location.path)"}
                @($exception.paths | Where-Object { $locationPath -like $_.Replace('\','/') }).Count -eq 0
            })
            if ($outside.Count -eq 0) { $matched=$registration; break }
        }
        if ($matched) {
            $entry.exception_id=$matched.rule.id; $entry.exception_source=$matched.source; $entry.exception_scope_root=$matched.scope_root
            $matched.matched_groups++; $excepted.Add($entry)
        } else { $groups.Add($entry) }
    }
    $status = if($errors.Count){'error'}elseif($groups.Count){'duplicates'}else{'clean'}
    $exitCode = if($errors.Count){2}elseif($groups.Count){1}else{0}
    $result = [ordered]@{
        schema='agents.duplicate-content.v1'; status=$status; exit_code=$exitCode
        roots=@($Root); frozen_source=$ContextSourcesPath; exceptions_source=$ExceptionsPath
        parameters=@{min_sentence_length=$MinSentenceLength;min_paragraph_length=$MinParagraphLength;similarity_threshold=$SimilarityThreshold;include_json=[bool]$IncludeJson;include_untracked=[bool]$IncludeUntracked;include_third_party=[bool]$IncludeThirdParty}
        summary=@{files_scanned=$scanned;sentences=$scanner.SentenceCount;paragraphs=$scanner.ParagraphCount;duplicate_groups=$groups.Count;excepted_groups=$excepted.Count;elapsed_seconds=[Math]::Round($watch.Elapsed.TotalSeconds,2)
            exceptions=@($exceptionRules | ForEach-Object { [ordered]@{id=$_.rule.id;source=$_.source;scope_root=$_.scope_root;matched_groups=$_.matched_groups} })}
        groups=@($groups.ToArray()); excepted_groups=@(if($IncludeExcepted){$excepted.ToArray()}); skipped=@($skipped.ToArray()); errors=@($errors.ToArray())
    }
} catch {
    $exitCode=2
    $result=[ordered]@{schema='agents.duplicate-content.v1';status='error';exit_code=2;groups=@();errors=@($_.Exception.Message)}
}
if ($Json) { $result | ConvertTo-Json -Depth 25 }
else {
    if ($result.Contains('summary')) {
        $s=$result.summary
        Write-Output "扫描 $($s.files_scanned) 个文件，发现 $($s.duplicate_groups) 组待判断重复，例外 $($s.excepted_groups) 组，耗时 $($s.elapsed_seconds) 秒。"
        foreach($exception in $s.exceptions) { Write-Output "例外 $($exception.id)：$($exception.matched_groups) 组；来源 $($exception.source)" }
        foreach ($g in $result.groups) {
            Write-Output "[$($g.kind) / $($g.similarity)] $($g.excerpt)"
            foreach ($p in $g.occurrences) { Write-Output "  $($p.repository)  $($p.path):$($p.line)" }
            Write-Output "  推测归属：$($g.suggested_home.owner)（需人工判断）"
        }
    }
    foreach($message in $result.errors) { Write-Output "错误：$message" }
}
exit $exitCode
