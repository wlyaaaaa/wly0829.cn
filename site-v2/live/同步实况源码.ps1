[CmdletBinding()]
param(
    [string]$Source = 'E:\Cache\wly-site-build\refresh-runs\site-plan-20261111\live\front\site\live'
)

# 主持合并前手工运行；镜像 site-v2/live，排除测试数据并保留此脚本和网页摘要表。
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$repo = & git -C $PSScriptRoot rev-parse --show-toplevel 2>$null
if ($LASTEXITCODE -ne 0) { throw '脚本必须放在网站仓库的 site-v2/live 中。' }
$target = [IO.Path]::GetFullPath((Join-Path $repo 'site-v2/live'))
if ($target -ne [IO.Path]::GetFullPath($PSScriptRoot)) {
    throw '目标必须是本仓库的 site-v2/live。'
}
$sourcePath = (Get-Item -LiteralPath $Source).FullName.TrimEnd('\', '/')
foreach ($required in @('index.html', '_lib/live-client.js')) {
    if (-not (Test-Path -LiteralPath (Join-Path $sourcePath $required) -PathType Leaf)) {
        throw "来源缺少 $required，未进行同步：$sourcePath"
    }
}
if ($sourcePath -eq $target -or $sourcePath.StartsWith($target + '\', [StringComparison]::OrdinalIgnoreCase)) {
    throw '来源不能是目标目录或它的子目录。'
}
& robocopy $sourcePath $target /MIR /XJ /R:1 /W:1 /XD _fixtures /XF (Split-Path $PSCommandPath -Leaf) pages.json /NJH /NJS /NP
$result = $LASTEXITCODE
if ($result -ge 8) { throw "实况源码同步失败，robocopy 返回 $result。" }
$global:LASTEXITCODE = 0
Write-Host "实况源码已同步到 $target（不含 _fixtures；保留同步脚本和网页摘要表）。"
