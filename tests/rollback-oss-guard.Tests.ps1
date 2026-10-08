$ErrorActionPreference='Stop'
$repoRoot=Split-Path -Parent $PSScriptRoot
$source=Join-Path $repoRoot 'scripts/rollback-hybrid.ps1'
$ast=[Management.Automation.Language.Parser]::ParseFile($source,[ref]$null,[ref]$null)
$definition=$ast.Find({param($node) $node -is [Management.Automation.Language.FunctionDefinitionAst] -and $node.Name -eq 'Assert-RollbackOss'},$false)
Invoke-Expression $definition.Extent.Text
$fixture=Join-Path $repoRoot ('.publish/rollback-oss-test-'+[guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $fixture -Force | Out-Null
$shared=@{key='shared.css';url='https://fixture.invalid/shared.css'}
$unique=@{key='old.css';url='https://fixture.invalid/old.css'}
$target=@{oss=@{asset_base_url='https://fixture.invalid';objects=@{shared=$shared;old=$unique;duplicate=$unique}}}
$current=@{oss=@{asset_base_url='https://fixture.invalid';objects=@{shared=$shared}}}
$target | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath "$fixture/target.json"
function Invoke-WebRequest([string]$Uri) {
    $script:requests+=$Uri
    if ($script:response -eq -1) { throw 'Fixture network failure' }
    @{StatusCode=$script:response}
}
foreach ($response in 200,404,410,403,-1) {
    $current | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath "$fixture/current.json"
    $script:requests=@()
    $stopped=$false
    try { Assert-RollbackOss "$fixture/target.json" "$fixture/current.json" "$fixture/check-$response.json" } catch { $stopped=$true }
    $result=Get-Content -Raw -LiteralPath "$fixture/check-$response.json" | ConvertFrom-Json
    $expected=if ($response -eq 200) { 'present' } elseif ($response -in 404,410) { 'missing' } else { 'unknown' }
    if ($stopped -ne ($response -ne 200) -or $result.checks.state -ne $expected) { throw "Wrong rollback decision for $response" }
    if ($requests.Count -ne 1 -or $requests[0] -ne $unique.url) { throw 'Shared or duplicate object was requested' }
}
$current.oss.asset_base_url='https://other-fixture.invalid'
$current | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath "$fixture/current.json"
$script:response=200
$script:requests=@()
Assert-RollbackOss "$fixture/target.json" "$fixture/current.json" "$fixture/different-base.json"
if ($requests.Count -ne 2 -or $shared.url -notin $requests) { throw 'Same key on another base was incorrectly skipped' }
'{}' | Set-Content -LiteralPath "$fixture/static.json"
Assert-RollbackOss "$fixture/static.json" "$fixture/no-current.json" "$fixture/static-check.json"
if (Test-Path -LiteralPath "$fixture/static-check.json") { throw 'Static rollback unexpectedly checked OSS' }
Write-Output "PASS: missing, unknown, deduplication, different base and static rollback; evidence $fixture"
