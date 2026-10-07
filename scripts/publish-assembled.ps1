param(
    [Parameter(Mandatory)][string]$Source,
    [string]$PrivateIndex = 'E:\GitHub总索引\config\repository-paths.json',
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
$releaseFolder = Join-Path $repoRoot '.publish'
$nowBeijing = [DateTimeOffset]::UtcNow.ToOffset([TimeSpan]::FromHours(8))
$runFolder = Join-Path $releaseFolder ($nowBeijing.ToString('yyyyMMdd-HHmmss') + '-' + [guid]::NewGuid().ToString('N').Substring(0,8))
$outputFolder = Join-Path $runFolder 'dist'
if ($Publish) {
    $branch = (& git branch --show-current).Trim()
    if ($LASTEXITCODE -ne 0 -or $branch -notlike 'prep/*') { throw 'Publish from the reviewed prep branch.' }
    $remote = (& git remote get-url origin).Trim()
    if ($remote -notin @('https://github.com/wlyaaaaa/wly0829.cn.git','git@github.com:wlyaaaaa/wly0829.cn.git')) { throw 'Unexpected origin.' }
    Checked 'git' @('diff','--cached','--quiet')
    Checked 'git' @('diff','--quiet','--','.',':!site-release')
    $untrackedSource = & git ls-files --others --exclude-standard -- . ':!site-release'
    if ($LASTEXITCODE -ne 0 -or $untrackedSource) { throw 'Commit the reviewed workflow and scripts before publishing.' }
}
New-Item -ItemType Directory -Path $runFolder -Force | Out-Null
if (-not (Test-Path -LiteralPath $PrivateIndex -PathType Leaf)) { throw 'The registered repository inventory is required to prepare a public release.' }
Checked 'python' @('scripts/build-assembled-site.py','--source',$Source,'--output',$outputFolder,'--report',(Join-Path $runFolder 'size-report.json'),'--private-index',$PrivateIndex)
# Existing credential checks scan source and the final output on every run.
Checked 'node' @('scripts/verify-public-content.mjs','--dist',$outputFolder)
$uiArguments = @('scripts/check-site-ui.py','--root',$outputFolder,'--output',(Join-Path $runFolder 'ui-check.json'),'--full')
Checked 'python' $uiArguments
if ($Stage -or $Publish) {
    $releaseTarget = Join-Path $repoRoot 'site-release'
    if (Test-Path -LiteralPath $releaseTarget) {
        # Retain the last prepared release until the replacement is deployed.
        $previousTarget = Join-Path $runFolder 'previous-release'
        if (-not [IO.Path]::GetFullPath($releaseTarget).StartsWith($repoRoot + [IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)) { throw 'Release path escaped repository.' }
        Move-Item -LiteralPath $releaseTarget -Destination $previousTarget
    }
    Copy-Item -LiteralPath $outputFolder -Destination $releaseTarget -Recurse
    Checked 'python' @('scripts/build-assembled-site.py','--verify-only','--output',$releaseTarget,'--report',(Join-Path $runFolder 'staged-size-report.json'),'--private-index',$PrivateIndex)
    Checked 'node' @('scripts/verify-public-content.mjs','--dist',$releaseTarget)
}
if ($Publish) {
    Checked 'git' @('fetch','origin','main')
    Checked 'git' @('merge-base','--is-ancestor','origin/main','HEAD')
    Checked 'git' @('add','--','site-release')
    & git diff --cached --quiet
    if ($LASTEXITCODE -eq 1) { Checked 'git' @('commit','-m','Publish assembled static site') }
    elseif ($LASTEXITCODE -ne 0) { throw 'Could not inspect staged release.' }
    Checked 'git' @('push','origin','HEAD:main')
    Write-Output 'Pushed. Watch Pages and verify the deployed commit before reporting publication complete.'
}
Write-Output "Prepared output: $outputFolder"
