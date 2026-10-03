param(
    [Parameter(Mandatory)][string]$Preparation,
    [string]$CliPath,
    [Alias('Profile')][string]$CliProfile,
    [string]$Python = 'python',
    [ValidateRange(1,16)][int]$VerifyWorkers = 4,
    [switch]$Upload,
    [switch]$VerifyRemote
)
$ErrorActionPreference = 'Stop'
$preparationRoot = [IO.Path]::GetFullPath($Preparation)
$planPath = Join-Path $preparationRoot 'oss-plan.json'
$plan = Get-Content -LiteralPath $planPath -Raw -Encoding utf8 | ConvertFrom-Json -DateKind String
if ($plan.schema -cne 'wly.oss-release-plan.v1') { throw 'Unsupported OSS release plan.' }
$prepareScript = Join-Path $PSScriptRoot 'prepare-oss-release.py'
function Checked([string]$Executable, [string[]]$Arguments) {
    & $Executable @Arguments
    if ($LASTEXITCODE -ne 0) { throw "Command failed with exit code $LASTEXITCODE : $Executable" }
}
Checked $Python @($prepareScript, 'verify-local', '--output', $preparationRoot)
if (-not ($Upload -or $VerifyRemote)) {
    [pscustomobject]@{
        status = 'local_prepared'; release_id = $plan.release_id; summary = $plan.summary
        github_root = Join-Path $preparationRoot 'github'; oss_root = Join-Path $preparationRoot 'oss'
        html_ready = $false; message = 'No objects uploaded or HTML published.'
    } | ConvertTo-Json -Depth 8
    return
}
if ($plan.test_only) { throw 'A loopback rehearsal cannot be uploaded or treated as production verification.' }
$targetUri = [uri]$plan.asset_base_url
if ($targetUri.Scheme -cne 'https' -or $targetUri.Host -cnotmatch '^([a-z0-9][a-z0-9-]+)\.oss-(cn-beijing|cn-shanghai)\.aliyuncs\.com$') {
    throw 'Expected the selected handed-over default bucket HTTPS origin.'
}
$bucket = $Matches[1]
$region = $Matches[2]
$prefix = [string]$plan.prefix
if ($prefix -cnotmatch '^[A-Za-z0-9][A-Za-z0-9._/-]*$' -or @($prefix.Split('/') | Where-Object { $_ -in @('', '.', '..') }).Count) {
    throw 'Invalid immutable release prefix.'
}
if ($Upload) {
    if (-not $CliPath -or -not $CliProfile) { throw 'Upload requires the exact CLI path and OAuth profile from the OSS handoff.' }
    $cliExecutable = (Get-Command -Name $CliPath -ErrorAction Stop).Source
    # Group copies retain the original relative paths. One recursive upload per
    # MIME type avoids one CLI process per object and sets correct module/font
    # headers regardless of the uploader host OS MIME registry.
    $groupRoot = Join-Path $preparationRoot ('upload-groups-' + [guid]::NewGuid().ToString('N').Substring(0,8))
    New-Item -ItemType Directory -Path $groupRoot | Out-Null
    $objects = @($plan.objects.PSObject.Properties)
    $previousReceiptPath = Join-Path $preparationRoot 'remote-verification.json'
    if (Test-Path -LiteralPath $previousReceiptPath) {
        $previousReceipt = Get-Content -LiteralPath $previousReceiptPath -Raw -Encoding utf8 | ConvertFrom-Json -DateKind String
        $planHash = (Get-FileHash -LiteralPath $planPath -Algorithm SHA256).Hash.ToLowerInvariant()
        if ($previousReceipt.plan_sha256 -ceq $planHash) {
            # Only exact same-plan GET proofs may avoid re-uploading successful
            # objects. The final GET pass still downloads every object again.
            $objects = @($objects | Where-Object { $previousReceipt.objects.($_.Name).status -cne 'pass' })
        }
    }
    $groups = @($objects | Group-Object { $_.Value.content_type })
    $groupIndex = 0
    try { foreach ($group in $groups) {
        $groupIndex++
        $mime = [string]$group.Name
        if ($mime -cnotmatch '^[a-z0-9.+-]+/[a-z0-9.+-]+$') { throw 'Invalid prepared Content-Type.' }
        $mimeRoot = Join-Path $groupRoot ([string]$groupIndex)
        New-Item -ItemType Directory -Path $mimeRoot | Out-Null
        foreach ($object in $group.Group) {
            $rel = [string]$object.Name
            if ($rel.StartsWith('/') -or $rel.Contains('\') -or @($rel.Split('/') | Where-Object { $_ -in @('', '.', '..') }).Count) {
                throw 'Object path escapes preparation.'
            }
            $from = Join-Path (Join-Path $preparationRoot 'oss') $rel
            $to = Join-Path $mimeRoot $rel
            New-Item -ItemType Directory -Path (Split-Path -Parent $to) -Force | Out-Null
            [IO.File]::Copy($from, $to, $false)
            if ((Get-FileHash -LiteralPath $to -Algorithm SHA256).Hash.ToLowerInvariant() -cne $object.Value.sha256) {
                throw "Upload group bytes differ: $rel"
            }
        }
        $cliOutput = Join-Path $groupRoot ('cli-output-' + $groupIndex)
        $checkpoint = Join-Path $groupRoot ('checkpoint-' + $groupIndex)
        New-Item -ItemType Directory -Path $cliOutput | Out-Null
        New-Item -ItemType Directory -Path $checkpoint | Out-Null
        Write-Output "Uploading MIME group $groupIndex / $($groups.Count), $($group.Count) objects."
        # The handed-over modern ossutil uses --force for noninteractive
        # operation; --ignore-existing prevents overwriting destination bytes.
        # No credential flags, config reads or debug output. A failed
        # upload retains its exact local groups/CLI receipt for recovery and
        # never releases HTML. Old prefixes are never removed.
        Checked $cliExecutable @('ossutil', 'cp', ($mimeRoot + [IO.Path]::DirectorySeparatorChar),
            "oss://$bucket/$prefix/", '--recursive', '--profile', $CliProfile,
            '--region', $region, '--endpoint', ("oss-$region.aliyuncs.com"),
            '--ignore-existing', '--force', '--no-progress', '--loglevel', 'off', '--acl', 'default',
            '--output-dir', $cliOutput, '--checkpoint-dir', $checkpoint,
            '--content-type', $mime, '--cache-control', 'public,max-age=31536000,immutable')
    } } catch {
        $uploadFailure = $_
        # Preserve real body evidence for partial transfer recovery. The next
        # run skips only proven bytes and refuses overwrites of different ones.
        & $Python $prepareScript 'verify-remote' '--output' $preparationRoot '--workers' ([string]$VerifyWorkers)
        throw $uploadFailure
    }
    # A zero CLI exit is transport evidence only. The full anonymous GET proof
    # below is always required after upload, including video byte ranges.
}
Checked $Python @($prepareScript, 'verify-remote', '--output', $preparationRoot, '--workers', [string]$VerifyWorkers)
$receipt = Get-Content -LiteralPath (Join-Path $preparationRoot 'remote-verification.json') -Raw -Encoding utf8 | ConvertFrom-Json -DateKind String
if (-not $receipt.complete -or -not $receipt.html_ready -or $receipt.release_id -cne $plan.release_id) {
    throw 'Remote body verification is incomplete; HTML is not ready.'
}
Checked $Python @($prepareScript, 'seal-remote', '--output', $preparationRoot)
[pscustomobject]@{
    status = 'assets_verified'; release_id = $plan.release_id
    github_root = Join-Path $preparationRoot 'github'; html_ready = $true
    remote_receipt = Join-Path $preparationRoot 'remote-verification.json'
    message = 'Every prepared object passed full GET SHA256. Integrate and publish the referenced HTML through the existing Pages owner.'
} | ConvertTo-Json -Depth 8
