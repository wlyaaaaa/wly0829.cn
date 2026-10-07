param(
    [Parameter(Mandatory)][string]$Batch,
    [string]$PageList,
    [string]$Directive,
    [string]$RunRoot,
    [string]$LockHolder,
    [switch]$Publish
)
$ErrorActionPreference='Stop'
$batchPath=[IO.Path]::GetFullPath($Batch)
$batchRoot=Split-Path -Parent $batchPath
$settings=Get-Content -LiteralPath $batchPath -Raw -Encoding utf8 | ConvertFrom-Json -DateKind String
if($settings.schema -cne 'wly.typeset-batch.v1'){throw 'Unsupported batch schema.'}
function BatchPath([string]$Value){return [IO.Path]::GetFullPath($Value,$batchRoot)}
if(-not $PageList){$PageList=BatchPath $settings.page_list}else{$PageList=[IO.Path]::GetFullPath($PageList)}
$pages=@(Get-Content -LiteralPath $PageList -Encoding utf8 | Where-Object { $_.Trim() } | ForEach-Object { $_.Trim() })
if(-not $pages.Count -or @($pages | Select-Object -Unique).Count -ne $pages.Count){throw 'Page list must be nonempty and contain no duplicates.'}
if($pages | Where-Object { $_ -cnotmatch '^[a-zA-Z0-9][a-zA-Z0-9._-]*$' }){throw 'Invalid page identity.'}
$parameters=@{Pages=$pages;Publish=$Publish}
foreach($key in @('TypesetRoot','Inventory','Geometry','Baseline','Release','BuildReport','Verification','LegacySite','AssetCache','ReleaseOverlay','CreativePreparation','RuntimeVerification','ReadingPlan','OssPreparation','OssQaPlan','OssVerification','OssReading','OssCold','OssRetryProof')){
    $value=$settings.paths.$key
    if($value){$parameters[$key]=BatchPath $value}
}
if($settings.runtime_baseline -eq $true){$parameters.RuntimeBaseline=$true}
if($Directive){$parameters.Directive=[IO.Path]::GetFullPath($Directive)}
if($Publish -and -not $Directive){throw 'Publication requires the real Claude instruction bound to the exact reviewed batch.'}
if($Publish -and -not $LockHolder){throw 'Publication requires the actual harness and task id in -LockHolder.'}
if($LockHolder){$parameters.LockHolder=$LockHolder}
if(-not $RunRoot){
    $stamp=[DateTimeOffset]::UtcNow.ToOffset([TimeSpan]::FromHours(8)).ToString('yyyyMMdd-HHmmss')+'-'+[guid]::NewGuid().ToString('N').Substring(0,8)
    $RunRoot=Join-Path $batchRoot "publication-$stamp"
}
$parameters.RunRoot=[IO.Path]::GetFullPath($RunRoot)
& (Join-Path $PSScriptRoot 'publish-typeset.ps1') @parameters
