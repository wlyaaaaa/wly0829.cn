param([string]$RestoreRef, [string]$Output, [switch]$Publish)
$ErrorActionPreference='Stop'
$repoRoot=Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $repoRoot
function Checked([string]$Program,[string[]]$Arguments) {
    & $Program @Arguments
    if ($LASTEXITCODE -ne 0) { throw "$Program failed: exit $LASTEXITCODE" }
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
Checked 'node' @('scripts/verify-public-content.mjs','--dist',$Output)
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
    $deadline=[DateTimeOffset]::UtcNow.AddMinutes(20)
    $run=$null
    while ([DateTimeOffset]::UtcNow -lt $deadline) {
        $runs=& gh run list --workflow pages.yml --commit $commit --limit 10 --json databaseId,status,conclusion,headSha
        if ($LASTEXITCODE -ne 0) { throw 'GitHub authentication or run lookup failed; stopped without login.' }
        $run=($runs | ConvertFrom-Json) | Where-Object headSha -eq $commit | Select-Object -First 1
        if ($run.status -eq 'completed') { break }
        Start-Sleep -Seconds 10
    }
    if ($run.status -ne 'completed' -or $run.conclusion -ne 'success') { throw "Rollback Pages did not succeed within deadline; commit $commit remains pushed." }
    Write-Output "Exact previous bytes deployed by Pages run $($run.databaseId); rollback commit $commit. Public read-back is still required."
} finally { $env:GIT_TERMINAL_PROMPT=$oldPrompt; $env:GCM_INTERACTIVE=$oldInteractive; $env:GIT_SSH_COMMAND=$oldBatch }
