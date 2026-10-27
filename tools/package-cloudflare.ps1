$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$dist = Join-Path $root 'dist'
$zip = Join-Path $root 'dist.zip'
$stage = Join-Path $root '.cache/cloudflare-package-stage'
$backup = Join-Path $root '.cache/cloudflare-package-backup'
$temporaryZip = Join-Path $root '.cache/cloudflare-package.zip'

function Assert-WorkspacePath([string]$target) {
    $resolved = [IO.Path]::GetFullPath($target)
    if (-not $resolved.StartsWith($root + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw "Unsafe path: $resolved" }
}
function Remove-WorkspaceDirectory([string]$target) {
    Assert-WorkspacePath $target
    if (Test-Path -LiteralPath $target) { Remove-Item -LiteralPath $target -Recurse -Force }
}
function Run-Node([string[]]$arguments) {
    & node @arguments
    if ($LASTEXITCODE -ne 0) { throw "Node failed ($LASTEXITCODE): $arguments" }
}
function File-Sha256([string]$file) {
    $stream = [IO.File]::OpenRead($file)
    $sha = [Security.Cryptography.SHA256]::Create()
    try { return [BitConverter]::ToString($sha.ComputeHash($stream)).Replace('-', '') }
    finally { $stream.Dispose(); $sha.Dispose() }
}

Push-Location $root
$promoted = $false
$hadDist = Test-Path -LiteralPath $dist
try {
    New-Item -ItemType Directory -Force (Join-Path $root '.cache') | Out-Null
    if (Test-Path -LiteralPath $backup) { throw "Previous backup exists: $backup. Inspect it before retrying." }
    Run-Node @('tools/build.js', $stage)
    if ($hadDist) { Assert-WorkspacePath $dist; Assert-WorkspacePath $backup; Move-Item -LiteralPath $dist -Destination $backup }
    try { Assert-WorkspacePath $stage; Assert-WorkspacePath $dist; Move-Item -LiteralPath $stage -Destination $dist; $promoted = $true }
    catch { if ($hadDist) { Move-Item -LiteralPath $backup -Destination $dist }; throw }
    Run-Node @('tests/loading.js')
    Run-Node @('tests/admin-events.js')
    Add-Type -AssemblyName System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    if (Test-Path -LiteralPath $temporaryZip) { Remove-Item -LiteralPath $temporaryZip -Force }
    # Older Windows .NET writes backslashes with CreateFromDirectory. Use explicit
    # forward-slash entry names so Cloudflare and other ZIP readers agree on paths.
    $writer = [IO.Compression.ZipFile]::Open($temporaryZip, [IO.Compression.ZipArchiveMode]::Create)
    try {
        foreach ($file in Get-ChildItem -LiteralPath $dist -File -Recurse -Force) {
            $name = $file.FullName.Substring($dist.Length + 1).Replace('\', '/')
            [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($writer, $file.FullName, $name, [IO.Compression.CompressionLevel]::Optimal) | Out-Null
        }
    } finally { $writer.Dispose() }
    $archive = [IO.Compression.ZipFile]::OpenRead($temporaryZip)
    try {
        $expected = @{}
        foreach ($file in Get-ChildItem -LiteralPath $dist -File -Recurse -Force) {
            $name = $file.FullName.Substring($dist.Length + 1).Replace('\', '/')
            $expected[$name] = $file.FullName
        }
        $seen = @{}
        foreach ($entry in $archive.Entries) {
            $name = $entry.FullName
            if (-not $expected.ContainsKey($name) -or $seen.ContainsKey($name)) { throw "Unexpected/duplicate ZIP entry: $name" }
            $stream = $entry.Open()
            $sha = [Security.Cryptography.SHA256]::Create()
            try { $actual = [BitConverter]::ToString($sha.ComputeHash($stream)) }
            finally { $stream.Dispose(); $sha.Dispose() }
            $wanted = File-Sha256 $expected[$name]
            if ($actual.Replace('-', '') -ne $wanted) { throw "ZIP content differs: $name" }
            $seen[$name] = $true
        }
        if ($seen.Count -ne $expected.Count -or -not $seen.ContainsKey('index.html') -or -not $seen.ContainsKey('_worker.js') -or -not $seen.ContainsKey('.well-known/ai-catalog.json')) { throw 'ZIP manifest incomplete' }
    } finally { $archive.Dispose() }
    # Replace the old ZIP only after every build, runtime and byte-integrity check passes.
    Move-Item -LiteralPath $temporaryZip -Destination $zip -Force
    # Both new artifacts are now installed. A backup-cleanup error must not roll
    # back only dist while leaving the newly verified ZIP in place.
    $promoted = $false
    try { Remove-WorkspaceDirectory $backup }
    catch { Write-Warning "Artifacts installed; old backup needs manual inspection: $backup" }
    Write-Output ("PASS: {0} files; ZIP {1} bytes; SHA256 {2}" -f $expected.Count, (Get-Item -LiteralPath $zip).Length, (File-Sha256 $zip))
    Write-Output "dist: $dist"
    Write-Output "zip: $zip"
    Write-Output 'Local build verified. Production readiness also requires phase acceptance and Pages REVIEWS_DB binding verification.'
} catch {
    if ($promoted) {
        Remove-WorkspaceDirectory $dist
        if ($hadDist -and (Test-Path -LiteralPath $backup)) { Assert-WorkspacePath $backup; Assert-WorkspacePath $dist; Move-Item -LiteralPath $backup -Destination $dist }
    }
    throw
} finally { Pop-Location }
