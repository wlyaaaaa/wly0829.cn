param([string]$RestoreRef, [string]$Output, [switch]$Publish, [switch]$DeferDeploymentCheck, [string]$LocalAssets)
$ErrorActionPreference='Stop'
$repoRoot=Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $repoRoot
function Checked([string]$Program,[string[]]$Arguments) {
    & $Program @Arguments
    if ($Program -eq 'git' -and $Arguments[0] -eq 'fetch') {
        for($retry=0;$retry -lt 2 -and $LASTEXITCODE -ne 0;$retry++){Start-Sleep -Seconds 3; & $Program @Arguments}
    }
    if ($LASTEXITCODE -ne 0) { throw "$Program failed: exit $LASTEXITCODE" }
}
function Assert-RollbackOss([string]$Restored,[string]$Current,[string]$Report) {
    $restore=Get-Content -Raw -LiteralPath $Restored | ConvertFrom-Json -AsHashtable -DateKind String
    if (-not $restore.oss) { return }
    $currentManifest=Get-Content -Raw -LiteralPath $Current | ConvertFrom-Json -AsHashtable -DateKind String
    $known=[Collections.Generic.HashSet[string]]::new([StringComparer]::Ordinal)
    foreach ($object in $currentManifest.oss.objects.Values) {
        [void]$known.Add("$($currentManifest.oss.asset_base_url)`n$($object.key)")
    }
    $checks=@()
    foreach ($object in $restore.oss.objects.Values) {
        if (-not $known.Add("$($restore.oss.asset_base_url)`n$($object.key)")) { continue }
        $detail=$null
        try {
            $status=[int](Invoke-WebRequest -Method Head -Uri $object.url -TimeoutSec 30 -SkipHttpErrorCheck).StatusCode
        } catch {
            $status=0
            $detail=$_.Exception.Message
        }
        $state=if ($status -ge 200 -and $status -lt 300) {
            'present'
        } elseif ($status -in 404,410) {
            'missing'
        } else {
            'unknown'
        }
        $checks+=@{key=$object.key;url=$object.url;status=$status;state=$state;error=$detail}
    }
    New-Item -ItemType Directory -Path (Split-Path -Parent $Report) -Force | Out-Null
    @{restore_ref=$RestoreRef;asset_base_url=$restore.oss.asset_base_url;checks=$checks} |
        ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $Report -Encoding utf8
    $missing=@($checks | Where-Object state -eq 'missing')
    $unknown=@($checks | Where-Object state -eq 'unknown')
    if ($missing.Count -or $unknown.Count) {
        foreach ($object in $missing) { Write-Warning "OSS object missing; re-upload required: $($object.key) $($object.url)" }
        foreach ($object in $unknown) { Write-Warning "OSS existence unknown (HTTP $($object.status)): $($object.key) $($object.url)" }
        throw "Rollback stopped before publication; OSS checks: $Report"
    }
}
if (-not $RestoreRef) {
    $manifest=Get-Content -Raw -LiteralPath (Join-Path $repoRoot 'site-release/release-manifest.json') | ConvertFrom-Json -DateKind String
    $RestoreRef=$manifest.rollback_ref
}
if (-not $RestoreRef) { throw 'No exact previous static release reference is recorded.' }
$runId=[DateTimeOffset]::UtcNow.ToOffset([TimeSpan]::FromHours(8)).ToString('yyyyMMdd-HHmmss')+'-'+[guid]::NewGuid().ToString('N').Substring(0,8)
$runRoot=Join-Path $repoRoot ".publish/rollback-$runId"
if (-not $Output) { $Output=Join-Path $runRoot 'dist' }
Checked 'python' @('scripts/hybrid-release.py','restore','--ref',$RestoreRef,'--output',$Output)
$gateArguments=@('scripts/verify-public-content.mjs','--dist',$Output)
if ($LocalAssets) { $gateArguments+=@('--local-assets',$LocalAssets) }
Checked 'node' $gateArguments
if (-not $Publish) { Write-Output "Exact rollback prepared and checked: $Output"; return }
Checked 'git' @('diff','--quiet'); Checked 'git' @('diff','--cached','--quiet')
$untracked=& git ls-files --others --exclude-standard
if ($LASTEXITCODE -ne 0 -or $untracked) { throw 'Working tree must be clean before rollback publication.' }
$remote=(& git remote get-url origin).Trim()
if ($remote -notin @('https://github.com/wlyaaaaa/wly0829.cn.git','git@github.com:wlyaaaaa/wly0829.cn.git')) { throw 'Unexpected origin.' }
$oldPrompt=$env:GIT_TERMINAL_PROMPT; $oldInteractive=$env:GCM_INTERACTIVE; $oldBatch=$env:GIT_SSH_COMMAND
try {
    $env:GIT_TERMINAL_PROMPT='0'; $env:GCM_INTERACTIVE='Never'; $env:GIT_SSH_COMMAND='ssh -o BatchMode=yes'
    Checked 'git' @('fetch','origin','main')
    $local=(& git rev-parse HEAD).Trim(); $remoteHead=(& git rev-parse origin/main).Trim()
    if ($local -ne $remoteHead) { throw 'Rollback needs local HEAD equal to origin/main; integrate unrelated commits explicitly.' }
    Assert-RollbackOss (Join-Path $Output 'release-manifest.json') (Join-Path $repoRoot 'site-release/release-manifest.json') (Join-Path $runRoot 'oss-existence.json')
    $target=Join-Path $repoRoot 'site-release'
    $retention=Join-Path $runRoot 'failed-release'
    $resolvedRepo=[IO.Path]::GetFullPath($repoRoot).TrimEnd('\','/')+[IO.Path]::DirectorySeparatorChar
    $resolvedRun=[IO.Path]::GetFullPath($runRoot).TrimEnd('\','/')+[IO.Path]::DirectorySeparatorChar
    $target=[IO.Path]::GetFullPath($target); $retention=[IO.Path]::GetFullPath($retention)
    if (-not $target.StartsWith($resolvedRepo,[StringComparison]::OrdinalIgnoreCase) -or
        -not $retention.StartsWith($resolvedRun,[StringComparison]::OrdinalIgnoreCase) -or
        $target -ne (Join-Path $repoRoot 'site-release')) { throw 'Rollback move escapes its verified workspace.' }
    if (Test-Path -LiteralPath $target) { Move-Item -LiteralPath $target -Destination $retention }
    Copy-Item -LiteralPath $Output -Destination $target -Recurse
    Checked 'git' @('add','--','site-release')
    Checked 'git' @('commit','-m',"Restore exact production static release from $RestoreRef")
    Checked 'git' @('push','origin','HEAD:main')
    $commit=(& git rev-parse HEAD).Trim()
    if ($DeferDeploymentCheck) {
        Write-Output "Exact rollback pushed as $commit; the calling publisher must confirm public identity and bytes."
        return
    }
    $deadline=[DateTimeOffset]::UtcNow.AddMinutes(20)
    $run=$null
    while ([DateTimeOffset]::UtcNow -lt $deadline) {
        $runs=& gh api "repos/wlyaaaaa/wly0829.cn/actions/runs?head_sha=$commit&per_page=20" --jq '.workflow_runs | map({databaseId:.id,status,conclusion,headSha:.head_sha,path})' 2>&1
        if ($LASTEXITCODE -ne 0) {
            if (($runs -join "`n") -match 'EOF|timed out|TLS connect error') { Start-Sleep -Seconds 10; continue }
            throw 'GitHub authentication or run lookup failed; stopped without login.'
        }
        $run=($runs | ConvertFrom-Json) | Where-Object { $_.headSha -eq $commit -and $_.path -eq '.github/workflows/pages.yml' } | Select-Object -First 1
        if ($run.status -eq 'completed') { break }
        Start-Sleep -Seconds 10
    }
    if ($run.status -ne 'completed' -or $run.conclusion -ne 'success') { throw "Rollback Pages did not succeed within deadline; commit $commit remains pushed." }
    Write-Output "Exact previous bytes deployed by Pages run $($run.databaseId); rollback commit $commit. Public read-back is still required."
} finally { $env:GIT_TERMINAL_PROMPT=$oldPrompt; $env:GCM_INTERACTIVE=$oldInteractive; $env:GIT_SSH_COMMAND=$oldBatch }
