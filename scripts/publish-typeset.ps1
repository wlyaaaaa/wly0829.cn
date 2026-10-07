param(
    [Parameter(Mandatory)][string]$TypesetRoot,
    [Parameter(Mandatory)][string]$Inventory,
    [Parameter(Mandatory)][string]$Geometry,
    [Parameter(Mandatory)][string]$Baseline,
    [string]$BaselineManifest,
    [Parameter(Mandatory)][string]$Release,
    [Parameter(Mandatory)][string]$BuildReport,
    [Parameter(Mandatory)][string]$Verification,
    [string]$Directive,
    [string]$LayoutAcceptance,
    [string]$LegacySite,
    [string]$AssetCache,
    [switch]$ReuseAssetCache,
    [string]$ReleaseOverlay,
    [string]$CreativePreparation,
    [string]$LiveUiPreparation,
    [string]$RulePublicProjection,
    [string]$RuntimeVerification,
    [string]$ReadingPlan,
    [string]$OssPreparation,
    [string]$OssQaPlan,
    [string]$OssVerification,
    [string]$OssReading,
    [string]$OssCold,
    [string]$OssRetryProof,
    [string]$PreviousReadback,
    [switch]$RuntimeBaseline,
    [string[]]$Pages,
    [string]$RunRoot,
    [string]$LockHolder,
    [string]$ShortLockTool = 'E:\.agents\tools\Invoke-ShortLock.ps1',
    [ValidateRange(1,60)][int]$PagesTimeoutMinutes = 20,
    [ValidateRange(2,6)][int]$ReadbackConfirmationRounds = 3,
    [ValidateRange(0,60)][int]$ReadbackRetrySeconds = 10,
    [switch]$Publish
)
$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$invocationRoot = (Get-Location).Path
function Absolute([string]$Value) { return [IO.Path]::GetFullPath($Value, $invocationRoot) }
foreach ($name in @('TypesetRoot','Inventory','Geometry','Baseline','Release','BuildReport','Verification')) {
    Set-Variable -Name $name -Value (Absolute (Get-Variable -Name $name -ValueOnly))
}
if (-not $BaselineManifest) { $BaselineManifest = Join-Path $Baseline 'release-manifest.json' }
else { $BaselineManifest = Absolute $BaselineManifest }
if ($LegacySite) { $LegacySite = Absolute $LegacySite }
if ($AssetCache) { $AssetCache = Absolute $AssetCache }
else {
    $reviewedBuild = Get-Content -Raw -LiteralPath $BuildReport | ConvertFrom-Json -DateKind String
    if ($reviewedBuild.asset_cache) { $AssetCache = Absolute $reviewedBuild.asset_cache }
}
if ($Directive) { $Directive = Absolute $Directive }
if ($LayoutAcceptance) { $LayoutAcceptance = Absolute $LayoutAcceptance }
if ($ReleaseOverlay) { $ReleaseOverlay = Absolute $ReleaseOverlay }
if ($CreativePreparation) { $CreativePreparation = Absolute $CreativePreparation }
if ($LiveUiPreparation) { $LiveUiPreparation = Absolute $LiveUiPreparation }
if ($RulePublicProjection) { $RulePublicProjection = Absolute $RulePublicProjection }
if ($RuntimeVerification) { $RuntimeVerification = Absolute $RuntimeVerification }
if ($ReadingPlan) { $ReadingPlan = Absolute $ReadingPlan }
foreach ($name in @('OssPreparation','OssQaPlan','OssVerification','OssReading','OssCold','OssRetryProof')) {
    $value=Get-Variable -Name $name -ValueOnly
    if ($value) { Set-Variable -Name $name -Value (Absolute $value) }
}
if ($OssPreparation -and (-not $OssQaPlan -or -not $OssVerification -or -not $OssReading -or -not $OssCold)) {
    throw 'OSS publication requires its exact browser plan, full DOM, reading and cold-browser evidence.'
}
if ($RunRoot) { $RunRoot = Absolute $RunRoot }
else {
    $runId = [DateTimeOffset]::UtcNow.ToOffset([TimeSpan]::FromHours(8)).ToString('yyyyMMdd-HHmmss') + '-' + [guid]::NewGuid().ToString('N').Substring(0,8)
    $RunRoot = Join-Path $repoRoot ".publish/typeset-$runId"
}
if (Test-Path -LiteralPath $RunRoot) { throw 'RunRoot must be a fresh directory.' }
New-Item -ItemType Directory -Path $RunRoot | Out-Null
Set-Location -LiteralPath $repoRoot
function Checked([string]$Program, [string[]]$Arguments) {
    & $Program @Arguments
    if ($LASTEXITCODE -ne 0) { throw "$Program failed: exit $LASTEXITCODE. Inspect this run's reports for the exact publication or recovery state." }
}
function ReadJson([string]$Path) { return Get-Content -Raw -LiteralPath $Path | ConvertFrom-Json -DateKind String }
function SaveJson([string]$Path, $Value) {
    [IO.File]::WriteAllText($Path, ($Value | ConvertTo-Json -Depth 100) + "`n", [Text.UTF8Encoding]::new($false))
}
function Prepare([string]$Candidate, [string]$Receipt, [string]$RebuildReport) {
    $arguments = @('scripts/prepare-typeset-release.py','prepare','--typeset-root',$TypesetRoot,'--inventory',$Inventory,
        '--geometry',$Geometry,
        '--baseline',$Baseline,'--baseline-manifest',$BaselineManifest,'--release',$Candidate,
        '--build-report',$BuildReport,'--verification',$Verification,'--output',$Receipt)
    if ($Directive) { $arguments += @('--directive',$Directive) }
    if ($LayoutAcceptance) { $arguments += @('--layout-acceptance',$LayoutAcceptance) }
    if ($RebuildReport) { $arguments += @('--rebuilt-report',$RebuildReport) }
    if ($RuntimeVerification) { $arguments += @('--runtime-verification',$RuntimeVerification) }
    if ($ReadingPlan) { $arguments += @('--reading-plan',$ReadingPlan) }
    if ($Pages) { $arguments += @('--pages') + $Pages }
    Checked 'python' $arguments
}
function VerifyOss([string]$Receipt, [string]$RebuiltSource, [string]$Staged) {
    $arguments=@('scripts/verify-typeset-oss.py','--preparation',$OssPreparation,'--build-report',$BuildReport,
        '--qa-plan',$OssQaPlan,'--verification',$OssVerification,'--reading',$OssReading,'--cold',$OssCold,'--output',$Receipt)
    if ($RebuiltSource) { $arguments+=@('--rebuilt-source',$RebuiltSource) }
    if ($Staged) { $arguments+=@('--staged',$Staged,'--preparation-receipt',(Join-Path $RunRoot 'rebuilt-preparation.json'),'--rollback-ref',$state.rollback_ref,
        '--require-browser-network','--browser-network',(Join-Path $RunRoot 'oss-browser-candidate.json')) }
    if ($OssRetryProof) { $arguments+=@('--retry-proof',$OssRetryProof) }
    if ($LayoutAcceptance) { $arguments+=@('--layout-acceptance',$LayoutAcceptance) }
    Checked 'python' $arguments
}
function OssBrowserNetwork([string]$Mode, [string]$Staged) {
    $output=Join-Path $RunRoot "oss-browser-$Mode.json"
    $arguments=@('scripts/verify-oss-browser-network.py','--preparation',$OssPreparation,'--release',$Staged,
        '--mode',$Mode,'--output',$output,'--task-cache',(Join-Path $RunRoot 'browser-network-temp'))
    & python @arguments
    $code=$LASTEXITCODE
    $state["oss_browser_$Mode"]=[ordered]@{ exit=$code; report=$output; status=$(if($code -eq 0){'pass'}else{'fail'}) }
    SaveState
    if($code -ne 0){
        if($Mode -eq 'live') {
            $state.status='online_native_network_failed'
            $script:confirmedPublicationFailure='Mandatory final-origin public Chrome network gate failed; restore this publication through the exact existing rollback path.'
            SaveState
        }
        throw "Mandatory OSS $Mode browser network gate failed. Actual events: $output"
    }
}
$prepared = Join-Path $RunRoot 'preparation.json'
Write-Output "Local release evidence: $prepared"
if ($OssPreparation) { VerifyOss (Join-Path $RunRoot 'oss-preparation.json') }
Prepare $Release $prepared
$receipt = ReadJson $prepared
Write-Output "Publication batch: $($receipt.batch); selected $($receipt.selected_pages.Count), deferred $($receipt.deferred_pages.Count)."
if (-not $Publish) {
    Write-Output 'Prepared locally. No fetch, merge, staging, commit, push or online readback was requested.'
    return
}
if (-not $LegacySite) { throw '-Publish requires -LegacySite for the exact reviewed build command.' }
if (-not $LockHolder -or $LockHolder -notmatch '^(Claude|Codex)/.+$') { throw '-Publish requires -LockHolder containing the actual harness and real task id, for example Claude/<real-task-id>.' }
if (-not (Test-Path -LiteralPath $ShortLockTool -PathType Leaf)) { throw 'The registered website-publication short-lock entrypoint is unavailable.' }
$remote = (& git remote get-url origin).Trim()
if ($LASTEXITCODE -ne 0 -or $remote -notin @('https://github.com/wlyaaaaa/wly0829.cn.git','git@github.com:wlyaaaaa/wly0829.cn.git')) { throw 'Unexpected origin.' }
$branch = (& git branch --show-current).Trim()
if ($LASTEXITCODE -ne 0 -or $branch -notlike 'prep/*') { throw 'Publish from the committed, reviewed prep branch.' }
Checked 'git' @('diff','--quiet')
Checked 'git' @('diff','--cached','--quiet')
$untracked = & git ls-files --others --exclude-standard
if ($LASTEXITCODE -ne 0 -or $untracked) { throw 'Commit reviewed source changes before publication; unrelated edits are not staged by this script.' }
$attribute = & git check-attr text -- site-release/index.html
if ($LASTEXITCODE -ne 0 -or $attribute -notmatch ': text: unset$') { throw 'Exact static bytes require .gitattributes: site-release/** -text' }
$statePath = Join-Path $RunRoot 'publication-state.json'
$state = [ordered]@{ schema='wly.typeset-publication.v1'; status='preparing'; release_id=$receipt.release_id;
    started_at_beijing=[DateTimeOffset]::UtcNow.ToOffset([TimeSpan]::FromHours(8)).ToString('o');
    selected_pages=$receipt.selected_pages; batch=$receipt.batch; pushed_commit=$null; rollback_ref=$null;
    directive_sha256=$receipt.directive_sha256; geometry_sha256=$receipt.geometry_sha256;
    automatic_rollback=$false; lock_holder=$LockHolder; timings=[ordered]@{} }
function SaveState { SaveJson $statePath $state }
function TimedChecked([string]$Program, [string[]]$Arguments, [string]$Field) {
    $watch = [Diagnostics.Stopwatch]::StartNew()
    try { Checked $Program $Arguments }
    finally { $state.timings[$Field] = $watch.Elapsed.TotalSeconds; SaveState }
}
$script:publicationLockAcquired = $false
$script:confirmedPublicationFailure = $null
function HoldPublicationLock {
    $view = & pwsh -NoProfile -ExecutionPolicy Bypass -File $ShortLockTool -Mode Inspect -Name website-publication -Json
    if ($LASTEXITCODE -ne 0) { throw 'Cannot inspect the website-publication short lock.' }
    $inspection = $view | ConvertFrom-Json -DateKind String
    $other = @($inspection.locks | Where-Object { $_.active -and $_.holder -cne $LockHolder })
    if ($other.Count) { throw "website-publication is held by $($other[0].holder); no lock was stolen or publication attempted." }
    $claim = & pwsh -NoProfile -ExecutionPolicy Bypass -File $ShortLockTool -Mode Acquire -Name website-publication -Holder $LockHolder -Minutes 30 -Reason 'Publish or exactly restore the reviewed typeset website batch' -Json
    if ($LASTEXITCODE -ne 0) { throw 'Cannot acquire or renew the website-publication short lock.' }
    $claimed = $claim | ConvertFrom-Json -DateKind String
    if ($claimed.status -notin @('acquired','renewed')) { throw 'The website-publication lock was not acquired.' }
    $script:publicationLockAcquired = $true
}
function RemoteMain {
    $remoteLine = & git ls-remote --heads origin main
    if ($LASTEXITCODE -ne 0 -or -not $remoteLine) { throw 'Remote main could not be read; its state is unknown.' }
    return ($remoteLine -split '\s+')[0]
}
function WaitPages([string]$Commit) {
    $deadline = [DateTimeOffset]::UtcNow.AddMinutes($PagesTimeoutMinutes)
    $lastLookupError = $null
    $consecutiveLookupErrors = 0
    while ([DateTimeOffset]::UtcNow -lt $deadline) {
        HoldPublicationLock
        $runs = & gh api "repos/wlyaaaaa/wly0829.cn/actions/runs?head_sha=$Commit&per_page=50" --jq '.workflow_runs | map({id,status,conclusion,head_sha,path})' 2>&1
        if ($LASTEXITCODE -eq 0) {
            try {
                $run = ($runs | ConvertFrom-Json) | Where-Object { $_.head_sha -eq $Commit -and $_.path -eq '.github/workflows/pages.yml' } | Sort-Object id -Descending | Select-Object -First 1
                $consecutiveLookupErrors = 0
                if ($run -and $run.status -eq 'completed') {
                    if ($run.conclusion -notin @('success','failure','timed_out','cancelled','startup_failure','action_required','stale','skipped','neutral')) {
                        return [pscustomobject]@{ status='unknown'; run=$run.id; conclusion=$run.conclusion; message='Pages completed without a reliable workflow conclusion.' }
                    }
                    return [pscustomobject]@{ status=$(if ($run.conclusion -eq 'success') { 'success' } else { 'failed' }); run=$run.id; conclusion=$run.conclusion; message=$null }
                }
            } catch { $lastLookupError = $_.Exception.Message; $consecutiveLookupErrors++ }
        } else { $lastLookupError = ($runs -join "`n"); $consecutiveLookupErrors++ }
        if ($consecutiveLookupErrors -ge 3) {
            return [pscustomobject]@{ status='unknown'; run=$null; conclusion=$null; message=$lastLookupError }
        }
        Start-Sleep -Seconds 3
    }
    return [pscustomobject]@{ status='unknown'; run=$null; conclusion=$null; message=$lastLookupError }
}
function WaitPublicIdentity([string]$Candidate, [int]$TimeoutSeconds = 1200) {
    $expected = ReadJson (Join-Path $Candidate 'release-manifest.json')
    $expectedHash = (Get-FileHash -LiteralPath (Join-Path $Candidate 'release-manifest.json') -Algorithm SHA256).Hash.ToLowerInvariant()
    $deadline = [DateTimeOffset]::UtcNow.AddSeconds($TimeoutSeconds)
    $lastError = $null
    $observedRelease = $null
    $attempts = 0
    $stableMismatch = 0
    $previousMismatch = $null
    while ([DateTimeOffset]::UtcNow -lt $deadline) {
        HoldPublicationLock
        $attempts++
        try {
            if ($env:WLY_RELEASE_FULL -ne '1') {
                try {
                    $identity = Invoke-RestMethod -Uri ('https://wly0829.cn/release-identity.json?wait=' + [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()) -ConnectionTimeoutSeconds 20 -OperationTimeoutSeconds 20
                    if ($identity.release_id -ceq $expected.release_id -and $identity.manifest_sha256 -ceq $expectedHash) {
                        return [pscustomobject]@{ status='pass'; attempts=$attempts; release_id=$expected.release_id; message=$null }
                    }
                } catch { }
            }
            $uri = 'https://wly0829.cn/release-manifest.json?typeset_wait=' + [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
            $remaining = [Math]::Max(1,[Math]::Min(20,[int]($deadline-[DateTimeOffset]::UtcNow).TotalSeconds))
            $response = Invoke-WebRequest -Uri $uri -ConnectionTimeoutSeconds $remaining -OperationTimeoutSeconds $remaining -Headers @{ 'Cache-Control'='no-cache'; 'Accept-Encoding'='identity' }
            $online = $response.Content | ConvertFrom-Json -DateKind String
            $observedRelease = $online.release_id
            if ($online.schema -eq 'wly.hybrid-release.v1' -and $observedRelease -ceq $expected.release_id) {
                return [pscustomobject]@{ status='pass'; attempts=$attempts; release_id=$observedRelease; message=$null }
            }
            if ($online.schema -eq 'wly.hybrid-release.v1' -and $observedRelease) {
                if ($observedRelease -ceq $previousMismatch) { $stableMismatch++ } else { $stableMismatch=1; $previousMismatch=$observedRelease }
            } else { $stableMismatch=0 }
        } catch { $lastError = $_.Exception.Message; $stableMismatch=0 }
        Start-Sleep -Seconds 3
    }
    return [pscustomobject]@{ status=$(if ($stableMismatch -ge 3) { 'mismatch' } else { 'unknown' }); attempts=$attempts; release_id=$observedRelease; message=$lastError }
}
function ConfirmOnlineDom([string]$Prefix, [switch]$Legacy, [string]$Release) {
    $signature = $null
    $stableFailures = 0
    $lastReport = $null
    for ($attempt=1; $attempt -le 3; $attempt++) {
        HoldPublicationLock
        $lastReport = Join-Path $RunRoot "$Prefix-$attempt.json"
        $domInput = if ($OssQaPlan -and -not $Legacy) { $OssQaPlan } elseif ($RuntimeVerification -and -not $Legacy) { $RuntimeVerification } else { $BuildReport }
        $arguments = @('scripts/check-typeset-online.py','--build-report',$domInput,
            '--output',$lastReport,'--task-cache',(Join-Path $RunRoot "$Prefix-browser-cache"))
        if ($RuntimeVerification -and -not $Legacy) {
            $runtimePages = (ReadJson $RuntimeVerification).pages.PSObject.Properties.Name
            $samples = @(@('404','cockpit','localocr','proxyclean','rescue') | Where-Object { $_ -in $runtimePages })
            $samples += @($receipt.selected_pages | Where-Object { $_ -notin $samples } | Select-Object -First 1)
            if ($samples.Count) { $arguments += @('--pages') + $samples }
        }
        if ($Legacy) { $arguments += @('--legacy','--release',$Release) }
        & python @arguments | Out-Host
        $code = $LASTEXITCODE
        $proof = if (Test-Path -LiteralPath $lastReport -PathType Leaf) { ReadJson $lastReport } else { $null }
        if ($code -eq 0 -and $proof.status -eq 'pass') { return [pscustomobject]@{ status='pass'; report=$lastReport } }
        if ($code -eq 2 -and $proof.status -eq 'fail') {
            $current = @($proof.checks | Where-Object status -eq 'fail' | Sort-Object page,width | Select-Object page,width,issues) | ConvertTo-Json -Depth 10 -Compress
            if ($current -ceq $signature) { $stableFailures++ } else { $stableFailures=1; $signature=$current }
        } else { $stableFailures=0; $signature=$null }
        if ($attempt -lt 3) { Start-Sleep -Seconds 3 }
    }
    return [pscustomobject]@{ status=$(if ($stableFailures -eq 3) { 'confirmed_failure' } else { 'unknown' }); report=$lastReport }
}
function ConfirmReadback([string]$Candidate, [string]$Prefix) {
    $previous = $null
    $lastSignature = $null
    $stableMismatchRounds = 0
    for ($round = 1; $round -le $ReadbackConfirmationRounds; $round++) {
        HoldPublicationLock
        $report = Join-Path $RunRoot "$Prefix-$round.json"
        $arguments = @('scripts/prepare-typeset-release.py','readback','--release',$Candidate,'--output',$report)
        if ($PreviousReadback -and $Prefix -eq 'online-readback') { $arguments += @('--previous-report',$PreviousReadback) }
        if ($previous) { $arguments += @('--retry-report',$previous) }
        & python @arguments | Out-Host
        $code = $LASTEXITCODE
        if ($code -notin @(0,2,3) -or -not (Test-Path -LiteralPath $report -PathType Leaf)) {
            return [pscustomobject]@{ status='unknown'; report=$report; reason='Readback command did not produce valid evidence.' }
        }
        $proof = ReadJson $report
        if ($proof.status -eq 'pass') { return [pscustomobject]@{ status='pass'; report=$report; reason=$null } }
        if ($proof.status -eq 'mismatch' -and $proof.issues.Count) {
            $signature = @($proof.issues | Sort-Object path | ForEach-Object {
                [ordered]@{ path=$_.path; actual=$_.actual; actual_release_id=$_.actual_release_id; actual_files_sha256=$_.actual_files_sha256 }
            }) | ConvertTo-Json -Depth 20 -Compress
            if ($signature -ceq $lastSignature) { $stableMismatchRounds++ }
            else { $lastSignature = $signature; $stableMismatchRounds = 1 }
        } else { $lastSignature = $null; $stableMismatchRounds = 0 }
        $previous = $report
        if ($round -lt $ReadbackConfirmationRounds) { Start-Sleep -Seconds $ReadbackRetrySeconds }
    }
    if ($stableMismatchRounds -eq $ReadbackConfirmationRounds) {
        return [pscustomobject]@{ status='confirmed_mismatch'; report=$previous; reason='The same incorrect public bytes persisted across every bounded confirmation round.' }
    }
    return [pscustomobject]@{ status='unknown'; report=$previous; reason='Transport failed or public observations were not stable enough to establish a real deployment failure.' }
}
function RecoverConfirmedFailure {
    HoldPublicationLock
    $localHead = (& git rev-parse HEAD).Trim()
    if ($LASTEXITCODE -ne 0) { throw 'Cannot identify local HEAD before exact recovery.' }
    $remoteHead = RemoteMain
    if ($localHead -ne $state.pushed_commit -or $remoteHead -ne $state.pushed_commit) {
        $state.status = 'rollback_blocked_concurrent_progress'
        $state.rollback = [ordered]@{ status='not_attempted'; local_head=$localHead; remote_main=$remoteHead;
            reason='Local HEAD or remote main advanced beyond this publisher; do not restore over another commit.' }
        SaveState
        return
    }
    $state.automatic_rollback = $true
    $state.status = 'rollback_requested'
    $state.rollback = [ordered]@{ status='requested'; reason=$script:confirmedPublicationFailure; restore_ref=$state.rollback_ref }
    SaveState
    $recoveryDist = Join-Path $RunRoot 'recovery-dist'
    # The original tool fetches again, requires HEAD == origin/main, restores exact
    # Git bytes, and normal-pushes. A concurrent push cannot be overwritten.
    & pwsh -NoProfile -File 'scripts/rollback-hybrid.ps1' -RestoreRef $state.rollback_ref -Output $recoveryDist -Publish -DeferDeploymentCheck
    $recoveryExit = $LASTEXITCODE
    $recoveryCommit = (& git rev-parse HEAD).Trim()
    $state.rollback.command_exit = $recoveryExit
    $state.rollback.local_commit = $recoveryCommit
    if ($recoveryExit -ne 0) {
        $state.status = 'rollback_unconfirmed'
        $state.rollback.status = 'command_failed_or_unconfirmed'
        $state.rollback.reason = 'The original recovery command did not confirm completion; its push or Pages result may need follow-up.'
        SaveState
        return
    }
    if ((RemoteMain) -ne $recoveryCommit) { throw 'Remote main changed during exact recovery; no additional restore was attempted.' }
    $recoveryDeployment = WaitPages $recoveryCommit
    $state.rollback.pages = $recoveryDeployment
    $recoveryIdentity = WaitPublicIdentity $recoveryDist $(if ($recoveryDeployment.status -eq 'failed') { 20 } else { $PagesTimeoutMinutes * 60 })
    $state.rollback.public_identity = $recoveryIdentity
    if ($recoveryIdentity.status -ne 'pass') {
        $state.status = 'rollback_unconfirmed'
        $state.rollback.status = "pages_$($recoveryDeployment.status)"
        SaveState
        return
    }
    $proof = ConfirmReadback $recoveryDist 'rollback-online-readback'
    $state.rollback.readback = $proof
    if ($proof.status -ne 'pass') {
        $state.status = 'rollback_unconfirmed'
        $state.rollback.status = "readback_$($proof.status)"
        SaveState
        return
    }
    $rollbackDom = ConfirmOnlineDom 'rollback-online-dom' -Legacy -Release $recoveryDist
    $state.rollback.dom = $rollbackDom
    if ($rollbackDom.status -ne 'pass') {
        $state.status='rollback_unconfirmed'; $state.rollback.status="dom_$($rollbackDom.status)"; SaveState; return
    }
    if ((RemoteMain) -ne $recoveryCommit) { throw 'A later remote commit superseded recovery during readback; do not roll it back.' }
    $state.status = 'rolled_back'
    $state.rollback.status = 'verified'
    $state.rollback.completed_at_beijing = [DateTimeOffset]::UtcNow.ToOffset([TimeSpan]::FromHours(8)).ToString('o')
    SaveState
}
function ReplaceRelease([string]$From, [string]$RetentionName) {
    $target = [IO.Path]::GetFullPath((Join-Path $repoRoot 'site-release'))
    $retention = [IO.Path]::GetFullPath((Join-Path $RunRoot $RetentionName))
    $resolvedRepo = [IO.Path]::GetFullPath($repoRoot).TrimEnd('\','/') + [IO.Path]::DirectorySeparatorChar
    $resolvedRun = [IO.Path]::GetFullPath($RunRoot).TrimEnd('\','/') + [IO.Path]::DirectorySeparatorChar
    $resolvedFrom = [IO.Path]::GetFullPath($From)
    if (-not $target.StartsWith($resolvedRepo,[StringComparison]::OrdinalIgnoreCase) -or
        -not $retention.StartsWith($resolvedRun,[StringComparison]::OrdinalIgnoreCase) -or
        -not $resolvedFrom.StartsWith($resolvedRun,[StringComparison]::OrdinalIgnoreCase) -or
        $target -ne (Join-Path $repoRoot 'site-release')) { throw 'Release move escapes its verified workspace.' }
    if (Test-Path -LiteralPath $target) { Move-Item -LiteralPath $target -Destination $retention }
    Copy-Item -LiteralPath $resolvedFrom -Destination $target -Recurse
}
function CommitRelease([string]$Message) {
    Checked 'git' @('add','--','site-release')
    & git diff --cached --quiet
    if ($LASTEXITCODE -eq 1) { Checked 'git' @('commit','-m',$Message) }
    elseif ($LASTEXITCODE -ne 0) { throw 'Cannot inspect the exact release staging.' }
}
SaveState
$oldPrompt = $env:GIT_TERMINAL_PROMPT
$oldInteractive = $env:GCM_INTERACTIVE
try {
    # Reuse existing authentication without starting a login or modifying accounts.
    $env:GIT_TERMINAL_PROMPT = '0'
    $env:GCM_INTERACTIVE = 'Never'
    HoldPublicationLock
    Checked 'git' @('fetch','origin','main')
    Checked 'git' @('merge','--no-edit','origin/main')
    Checked 'git' @('merge-base','--is-ancestor','origin/main','HEAD')
    $productionCheck = Join-Path $RunRoot 'production-check.json'
    $productionArguments=@('scripts/prepare-typeset-release.py','production-check','--baseline',$Baseline,
        '--baseline-manifest',$BaselineManifest,'--production-ref','origin/main','--build-report',$BuildReport,'--output',$productionCheck)
    if ($RuntimeBaseline) { $productionArguments+='--runtime-baseline' }
    Checked 'python' $productionArguments
    $state.production_commit = (ReadJson $productionCheck).production_commit
    SaveState
    $rebuilt = Join-Path $RunRoot 'rebuilt-dist'
    $rebuiltReport = Join-Path $RunRoot 'rebuilt-build-report.json'
    $buildArguments = @('scripts/build-typeset-site.py','--typeset-root',$TypesetRoot,'--inventory',$Inventory,
        '--geometry',$Geometry,
        '--baseline',$Baseline,'--legacy-site',$LegacySite,'--output',$rebuilt,'--report',$rebuiltReport)
    if ($Pages) { $buildArguments += @('--pages') + $Pages }
    if ($AssetCache) { $buildArguments += @('--asset-cache',$AssetCache) }
    if ($ReuseAssetCache) { $buildArguments += '--reuse-asset-cache' }
    if ($ReleaseOverlay) { $buildArguments += @('--release-overlay',$ReleaseOverlay) }
    if ($CreativePreparation) { $buildArguments += @('--creative-preparation',$CreativePreparation) }
    if ($LiveUiPreparation) { $buildArguments += @('--live-ui-preparation',$LiveUiPreparation) }
    if ($RulePublicProjection) { $buildArguments += @('--rule-public-projection',$RulePublicProjection) }
    if ($RuntimeBaseline) { $buildArguments+=@('--runtime-baseline','--baseline-ref',$state.production_commit) }
    TimedChecked 'python' $buildArguments 'build_seconds'
    $rebuiltProof = ReadJson $rebuiltReport
    if ($rebuiltProof.geometry_path -ne $Geometry -or $rebuiltProof.geometry_sha256 -cne $receipt.geometry_sha256) {
        $state.status = 'requires_new_verification'
        throw 'Rebuild changed its geometry input. Repeat program verification, Claude review, and the explicit publication instruction for the new build.'
    }
    $rebuiltIdentity = ReadJson (Join-Path $rebuilt 'release-manifest.json')
    if ($rebuiltIdentity.release_id -ne $receipt.release_id) {
        $state.status = 'requires_new_verification'
        throw 'Rebuild changed release_id. Repeat the full program verification, Claude review, and explicit publication instruction for the new build.'
    }
    # built_at may change. The Claude-reviewed report remains immutable; its input and
    # output hashes must still match every byte of the rebuilt release.
    Prepare $rebuilt (Join-Path $RunRoot 'rebuilt-preparation.json') $rebuiltReport
    HoldPublicationLock
    $contentArguments=@('scripts/hybrid-release.py','verify','--output',$rebuilt,
        '--content-report',(Join-Path $RunRoot 'content-report.json'),'--public-repos-from-github')
    if ($OssPreparation) { $contentArguments+=@('--oss-preparation',$OssPreparation) }
    Checked 'python' $contentArguments
    Checked 'node' @('scripts/verify-public-content.mjs','--dist',$rebuilt)
    if ($OssPreparation) {
        VerifyOss (Join-Path $RunRoot 'rebuilt-oss-preparation.json') $rebuilt
        $rollbackRef=$state.production_commit
    } else {
        $rollbackOutput = Join-Path $RunRoot 'previous-production'
        Checked 'python' @('scripts/prepare-typeset-release.py','wrap-baseline','--baseline',$Baseline,
            '--baseline-manifest',$BaselineManifest,'--output',$rollbackOutput)
        Checked 'node' @('scripts/verify-public-content.mjs','--dist',$rollbackOutput)
        ReplaceRelease $rollbackOutput 'previous-working-release'
        CommitRelease 'Preserve exact production bytes before typeset publication'
        $rollbackRef = (& git rev-parse HEAD).Trim()
        if ($LASTEXITCODE -ne 0) { throw 'Cannot resolve exact rollback commit.' }
    }
    $state.rollback_ref = $rollbackRef
    SaveState
    $drill = Join-Path $RunRoot 'rollback-drill'
    Checked 'python' @('scripts/hybrid-release.py','restore','--ref',$rollbackRef,'--output',$drill)
    if ($OssPreparation) {
        $ossDist=Join-Path $RunRoot 'oss-dist'
        Copy-Item -LiteralPath (Join-Path $OssPreparation 'github') -Destination $ossDist -Recurse
        $rebuilt=$ossDist
        $rebuiltIdentity=ReadJson (Join-Path $rebuilt 'release-manifest.json')
        $state.release_id=$rebuiltIdentity.release_id
    }
    $rebuiltIdentity.rollback_ref = $rollbackRef
    $acceptedEvidence = [ordered]@{}
    foreach ($pageName in $receipt.selected_pages) {
        $pageProof = $receipt.pages.$pageName
        $acceptedEvidence[$pageProof.url] = $pageProof.evidence
    }
    $rebuiltIdentity.accepted_pages = $acceptedEvidence
    SaveJson (Join-Path $rebuilt 'release-manifest.json') $rebuiltIdentity
    ReplaceRelease $rebuilt 'staged-previous-production'
    # The baseline may itself be site-release. Its old bytes have now been
    # deliberately replaced; producer checks are bound to rebuilt-preparation.
    if ($OssPreparation) {
        # Remote object bodies have already passed VerifyOss. Test the exact
        # staged document generation at its final origin before any HTML push.
        OssBrowserNetwork 'candidate' (Join-Path $repoRoot 'site-release')
        VerifyOss (Join-Path $RunRoot 'staged-preparation.json') '' (Join-Path $repoRoot 'site-release')
    } else {
        $stageArguments = @('scripts/prepare-typeset-release.py','stage-check',
            '--release',(Join-Path $repoRoot 'site-release'),'--build-report',$BuildReport,
            '--preparation',(Join-Path $RunRoot 'rebuilt-preparation.json'),'--rollback-ref',$rollbackRef,
            '--expected-manifest',(Join-Path $rebuilt 'release-manifest.json'),
            '--output',(Join-Path $RunRoot 'staged-preparation.json'))
        if ($LayoutAcceptance) { $stageArguments += @('--layout-acceptance',$LayoutAcceptance) }
        Checked 'python' $stageArguments
    }
    CommitRelease 'Publish Claude-reviewed typeset static release'
    Checked 'git' @('merge-base','--is-ancestor','origin/main','HEAD')
    $state.status = 'push_requested'
    SaveState
    HoldPublicationLock
    TimedChecked 'git' @('push','origin','HEAD:main') 'push_seconds'
    $commit = (& git rev-parse HEAD).Trim()
    $state.pushed_commit = $commit
    $state.status = 'pushed'
    SaveState
    if ((RemoteMain) -ne $commit) {
        $state.status = 'remote_readback_unknown'
        throw 'Push returned, but remote main identity is not confirmed. Keep the release and retry readback without automatic rollback.'
    }
    $deploymentResult = WaitPages $commit
    $state.lookup_error = $deploymentResult.message
    $state.pages_run = $deploymentResult.run
    $state.pages_conclusion = $deploymentResult.conclusion
    $state.pages_status = $deploymentResult.status
    $state.status = 'public_identity_pending'
    SaveState
    $publicIdentity = WaitPublicIdentity (Join-Path $repoRoot 'site-release') $(if ($deploymentResult.status -eq 'failed') { 20 } else { $PagesTimeoutMinutes * 60 })
    $state.public_identity = $publicIdentity
    if ($publicIdentity.status -eq 'mismatch') {
        $state.status = 'pages_failed'
        $script:confirmedPublicationFailure = "The public release identity remained different after the bounded wait for commit $commit; Pages status $($deploymentResult.status)."
        throw $script:confirmedPublicationFailure
    }
    if ($publicIdentity.status -ne 'pass') {
        $state.status = 'public_identity_unconfirmed'
        throw "Public deployment identity is not confirmed for commit $commit. Keep the state for bounded readback without login or proxy changes."
    }
    $state.status = 'public_identity_confirmed_readback_pending'
    SaveState
    $readback = ConfirmReadback (Join-Path $repoRoot 'site-release') 'online-readback'
    $state.readback = $readback
    if ($readback.status -eq 'confirmed_mismatch') {
        $state.status = 'confirmed_public_byte_mismatch'
        $script:confirmedPublicationFailure = $readback.reason
        throw $script:confirmedPublicationFailure
    }
    if ($readback.status -ne 'pass') {
        $state.status = 'readback_unconfirmed'
        throw "The public result is unknown: $($readback.reason) See $($readback.report). Keep this state for Claude's follow-up; no blind rollback was performed."
    }
    if ($OssPreparation) { OssBrowserNetwork 'live' (Join-Path $repoRoot 'site-release') }
    $onlineDom = ConfirmOnlineDom 'online-dom'
    $state.online_dom = $onlineDom
    if ($onlineDom.status -eq 'confirmed_failure') {
        $state.status = 'online_dom_failed'
        $script:confirmedPublicationFailure = 'Public desktop/mobile DOM checks failed; inspect the actual online report.'
        throw $script:confirmedPublicationFailure
    }
    if ($onlineDom.status -ne 'pass') {
        $state.status = 'online_dom_unconfirmed'
        throw 'Public browser verification is unavailable or unstable; keep the actual reports without blind rollback.'
    }
    $finalHead = (& git rev-parse HEAD).Trim()
    if ($LASTEXITCODE -ne 0 -or $finalHead -ne $commit -or (RemoteMain) -ne $commit) {
        $state.status = 'final_identity_unconfirmed'
        throw 'Local HEAD or remote main changed during readback; verify the current deployment before reporting completion.'
    }
    $state.status = 'published'
    Checked 'python' @('scripts/run-typeset-checks.py','--mode','baseline','--verification',$Verification,
        '--baseline-output',(Join-Path $repoRoot '.publish/quality-baseline.json'),'--production-commit',$commit,'--task-cache',$RunRoot)
    $state.completed_at_beijing = [DateTimeOffset]::UtcNow.ToOffset([TimeSpan]::FromHours(8)).ToString('o')
    SaveState
    Write-Output "Published commit $commit; Pages run $($deploymentResult.run); all public HTML and asset hashes passed."
    Write-Output "Exact rollback reference: $rollbackRef"
} catch {
    $state.error = $_.Exception.Message
    if ($state.status -eq 'preparing') { $state.status = 'stopped_before_push' }
    elseif ($state.status -eq 'push_requested') { $state.status = 'push_result_unknown' }
    if ($script:confirmedPublicationFailure -and $state.pushed_commit -and $state.rollback_ref) {
        try { RecoverConfirmedFailure }
        catch {
            $state.status = 'rollback_unconfirmed'
            $state.rollback_error = $_.Exception.Message
        }
        Write-Output "Publication failed: $($state.error) Recovery state: $($state.status). Exact details: $statePath"
    }
    SaveState
    throw
} finally {
    $env:GIT_TERMINAL_PROMPT = $oldPrompt
    $env:GCM_INTERACTIVE = $oldInteractive
    if ($script:publicationLockAcquired) {
        $releaseLock = & pwsh -NoProfile -ExecutionPolicy Bypass -File $ShortLockTool -Mode Release -Name website-publication -Holder $LockHolder -Json
        if ($LASTEXITCODE -ne 0) { $state.lock_release_error = 'The publication short lock was not confirmed released.' }
        else { $state.lock_release_result = $releaseLock | ConvertFrom-Json -DateKind String }
        SaveState
    }
}
