Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Antigravity\web\UPGS punukkannoor\public\icon-512.png"
$src = [System.Drawing.Image]::FromFile($srcPath)

function Resize-Image($source, $width, $height, $destPath) {
    $bitmap = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bitmap)
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($source, 0, 0, $width, $height)
    $g.Dispose()
    $bitmap.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bitmap.Dispose()
}

$sizes = @(16, 32, 48, 180, 192)
foreach ($size in $sizes) {
    if ($size -eq 180) {
        $out = "c:\Antigravity\web\UPGS punukkannoor\public\apple-touch-icon.png"
    } else {
        $out = "c:\Antigravity\web\UPGS punukkannoor\public\favicon-$size`x$size.png"
    }
    Resize-Image $src $size $size $out
    Write-Output "Generated $out"
}

$src.Dispose()

# Now construct multi-resolution favicon.ico containing 16x16, 32x32, 48x48
$icoSizes = @(16, 32, 48)
$pngBytesList = @()
foreach ($s in $icoSizes) {
    $p = "c:\Antigravity\web\UPGS punukkannoor\public\favicon-$s`x$s.png"
    $pngBytesList += ,([System.IO.File]::ReadAllBytes($p))
}

$ms = New-Object System.IO.MemoryStream
$bw = New-Object System.IO.BinaryWriter($ms)

# ICO Header
$bw.Write([uint16]0) # reserved
$bw.Write([uint16]1) # type 1 = icon
$bw.Write([uint16]$icoSizes.Count) # count

$offset = 6 + ($icoSizes.Count * 16)
for ($i = 0; $i -lt $icoSizes.Count; $i++) {
    $s = $icoSizes[$i]
    $data = $pngBytesList[$i]
    $bw.Write([byte]$s) # width
    $bw.Write([byte]$s) # height
    $bw.Write([byte]0) # colors
    $bw.Write([byte]0) # reserved
    $bw.Write([uint16]1) # planes
    $bw.Write([uint16]32) # bpp
    $bw.Write([uint32]$data.Length) # data size
    $bw.Write([uint32]$offset) # data offset
    $offset += $data.Length
}

for ($i = 0; $i -lt $icoSizes.Count; $i++) {
    $bw.Write($pngBytesList[$i])
}

$bw.Flush()
[System.IO.File]::WriteAllBytes("c:\Antigravity\web\UPGS punukkannoor\public\favicon.ico", $ms.ToArray())
[System.IO.File]::WriteAllBytes("c:\Antigravity\web\UPGS punukkannoor\favicon.ico", $ms.ToArray())
$bw.Dispose()
$ms.Dispose()

Write-Output "favicon.ico successfully generated!"

# Also copy SVG logo to public/favicon.svg
Copy-Item "c:\Antigravity\web\UPGS punukkannoor\images\UPGS LOGO.svg" "c:\Antigravity\web\UPGS punukkannoor\public\favicon.svg" -Force
Copy-Item "c:\Antigravity\web\UPGS punukkannoor\images\UPGS LOGO.svg" "c:\Antigravity\web\UPGS punukkannoor\favicon.svg" -Force
Copy-Item "c:\Antigravity\web\UPGS punukkannoor\public\apple-touch-icon.png" "c:\Antigravity\web\UPGS punukkannoor\apple-touch-icon.png" -Force

Write-Output "All favicon files prepared!"

