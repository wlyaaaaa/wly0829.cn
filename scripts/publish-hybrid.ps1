param(
    [Parameter(Mandatory)][string]$Baseline,
    [Parameter(Mandatory)][string]$BaselineManifest,
    [Parameter(Mandatory)][string]$Candidate,
    [Parameter(Mandatory)][string]$CandidateReport,
    [Parameter(Mandatory)][string]$Approvals,
    [Parameter(Mandatory)][string]$Status,
    [Parameter(Mandatory)][string]$RawSite,
    [Parameter(Mandatory)][string]$VerificationRoot,
    [Parameter(Mandatory)][string[]]$Pages,
    [string]$Output,
    [switch]$Stage,
    [switch]$Publish
)
$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $repoRoot
function Checked([string]$Program, [string[]]$Arguments) {
    & $Program @Arguments
    if ($LASTEXITCODE -ne 0) { throw "$Program failed: exit $LASTEXITCODE" }
}
$runId = [DateTimeOffset]::UtcNow.ToOffset([TimeSpan]::FromHours(8)).ToString('yyyyMMdd-HHmmss') + '-' + [guid]::NewGuid().ToString('N').Substring(0,8)
$runRoot = Join-Path $repoRoot ".publish/hybrid-$runId"
if (-not $Output) { $Output = Join-Path $runRoot 'dist' }
New-Item -ItemType Directory -Path $runRoot -Force | Out-Null
$rollbackOutput = Join-Path $runRoot 'previous-production'
# Wrap the HTTP snapshot as an exact release before any staging or publication.
Checked 'python' @('-c', 'import importlib.util,json,pathlib,sys;s=importlib.util.spec_from_file_location("h","scripts/hybrid-release.py");h=importlib.util.module_from_spec(s);s.loader.exec_module(h);h.assemble(pathlib.Path(sys.argv[1]),pathlib.Path(sys.argv[1]),pathlib.Path(sys.argv[3]),h.read(sys.argv[2]),{})', $Baseline,$BaselineManifest,$rollbackOutput)
$prepareArgs = @('scripts/hybrid-release.py','prepare','--baseline',$Baseline,'--baseline-manifest',$BaselineManifest,'--candidate',$Candidate,'--candidate-report',$CandidateReport,'--approvals',$Approvals,'--status',$Status,'--raw-site',$RawSite,'--verification-root',$VerificationRoot,'--output',$Output,'--pages') + $Pages
Checked 'python' $prepareArgs
Checked 'python' @('scripts/hybrid-release.py','verify','--output',$Output,'--content-report',(Join-Path $runRoot 'content-report.json'),'--public-repos-from-github')
Checked 'node' @('scripts/verify-public-content.mjs','--dist',$Output)
Checked 'node' @('scripts/verify-public-content.mjs','--dist',$rollbackOutput)
Write-Output "Prepared release: $Output"
Write-Output "Exact previous production: $rollbackOutput"
if (-not ($Stage -or $Publish)) { return }
$attribute = & git check-attr text -- site-release/index.html
if ($LASTEXITCODE -ne 0 -or $attribute -notmatch ': text: unset$') { throw 'Exact static bytes require .gitattributes: site-release/** -text' }
# Stage owns only site-release; unrelated edits must first be reviewed and committed.
Checked 'git' @('diff','--quiet')
Checked 'git' @('diff','--cached','--quiet')
$untracked = & git ls-files --others --exclude-standard
if ($LASTEXITCODE -ne 0 -or $untracked) { throw 'Commit reviewed source changes before staging a release.' }
$remote = (& git remote get-url origin).Trim()
if ($remote -notin @('https://github.com/wlyaaaaa/wly0829.cn.git','git@github.com:wlyaaaaa/wly0829.cn.git')) { throw 'Unexpected origin.' }
function ReplaceRelease([string]$From, [string]$RetentionName) {
    $target = Join-Path $repoRoot 'site-release'
    $retention = Join-Path $runRoot $RetentionName
    $resolvedRepo = [IO.Path]::GetFullPath($repoRoot).TrimEnd('\','/') + [IO.Path]::DirectorySeparatorChar
    $resolvedRun = [IO.Path]::GetFullPath($runRoot).TrimEnd('\','/') + [IO.Path]::DirectorySeparatorChar
    $target = [IO.Path]::GetFullPath($target)
    $retention = [IO.Path]::GetFullPath($retention)
    if (-not $target.StartsWith($resolvedRepo, [StringComparison]::OrdinalIgnoreCase) -or
        -not $retention.StartsWith($resolvedRun, [StringComparison]::OrdinalIgnoreCase) -or
        $target -ne (Join-Path $repoRoot 'site-release')) { throw 'Release move escapes its verified workspace.' }
    if (Test-Path -LiteralPath $target) { Move-Item -LiteralPath $target -Destination $retention }
    Copy-Item -LiteralPath $From -Destination $target -Recurse
}
ReplaceRelease $rollbackOutput 'previous-working-release'
Checked 'git' @('add','--','site-release')
& git diff --cached --quiet
if ($LASTEXITCODE -eq 1) { Checked 'git' @('commit','-m','Preserve exact previous production for hybrid rollback') }
elseif ($LASTEXITCODE -ne 0) { throw 'Cannot inspect baseline staging.' }
$rollbackRef = (& git rev-parse HEAD).Trim()
$stagedManifestPath = Join-Path $Output 'release-manifest.json'
$manifest = Get-Content -Raw -LiteralPath $stagedManifestPath | ConvertFrom-Json -DateKind String
$manifest.rollback_ref = $rollbackRef
[IO.File]::WriteAllText($stagedManifestPath, ($manifest | ConvertTo-Json -Depth 100) + "`n", [Text.UTF8Encoding]::new($false))
# Exercise Git extraction and hash verification before the candidate can be staged.
$drill = Join-Path $runRoot 'rollback-drill'
Checked 'python' @('scripts/hybrid-release.py','restore','--ref',$rollbackRef,'--output',$drill)
ReplaceRelease $Output 'staged-previous-production'
Checked 'python' @('scripts/hybrid-release.py','verify','--output','site-release')
Checked 'git' @('add','--','site-release')
Write-Output "Rollback reference: $rollbackRef"
Write-Output "Rollback command: pwsh -NoProfile -File scripts/rollback-hybrid.ps1 -RestoreRef $rollbackRef -Publish"
if (-not $Publish) { Write-Output 'Candidate staged locally; no push or deployment requested.'; return }
Checked 'git' @('commit','-m','Publish reviewed hybrid static release')
$oldPrompt=$env:GIT_TERMINAL_PROMPT; $oldInteractive=$env:GCM_INTERACTIVE; $oldBatch=$env:GIT_SSH_COMMAND
try {
    $env:GIT_TERMINAL_PROMPT='0'; $env:GCM_INTERACTIVE='Never'; $env:GIT_SSH_COMMAND='ssh -o BatchMode=yes'
    Checked 'git' @('fetch','origin','main')
    Checked 'git' @('merge-base','--is-ancestor','origin/main','HEAD')
    Checked 'git' @('push','origin','HEAD:main')
} finally { $env:GIT_TERMINAL_PROMPT=$oldPrompt; $env:GCM_INTERACTIVE=$oldInteractive; $env:GIT_SSH_COMMAND=$oldBatch }
Write-Output 'Pushed. Wait for Pages and verify public bytes and browser links before reporting success.'
