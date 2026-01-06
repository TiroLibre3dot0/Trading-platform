$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

function New-LogoIcon(
  [int]$size,
  [string]$outPath,
  [string]$logoPath,
  [string]$backgroundHex,
  [double]$paddingRatio = 0.16
) {
  if (!(Test-Path $logoPath)) {
    throw "Logo not found: $logoPath"
  }

  $logo = [System.Drawing.Image]::FromFile((Join-Path (Get-Location) $logoPath))
  try {
    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)

    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    if ([string]::IsNullOrWhiteSpace($backgroundHex)) {
      $g.Clear([System.Drawing.Color]::Transparent)
    } else {
      $bg = [System.Drawing.ColorTranslator]::FromHtml($backgroundHex)
      $g.Clear($bg)
    }

    $pad = [Math]::Max(0, [Math]::Round($size * $paddingRatio))
    $availW = [Math]::Max(1, $size - (2 * $pad))
    $availH = [Math]::Max(1, $size - (2 * $pad))

    $scale = [Math]::Min($availW / $logo.Width, $availH / $logo.Height)
    $targetW = [Math]::Max(1, [Math]::Round($logo.Width * $scale))
    $targetH = [Math]::Max(1, [Math]::Round($logo.Height * $scale))

    $x = [Math]::Round(($size - $targetW) / 2)
    $y = [Math]::Round(($size - $targetH) / 2)

    $g.DrawImage($logo, $x, $y, $targetW, $targetH)

    $outFull = Join-Path (Get-Location) $outPath
    $dir = Split-Path $outFull -Parent
    if (!(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    $bmp.Save($outFull, [System.Drawing.Imaging.ImageFormat]::Png)

    $g.Dispose()
    $bmp.Dispose()

    Write-Output "Wrote $outPath ($size x $size)"
  } finally {
    $logo.Dispose()
  }
}

$logoPath = 'public\\Logo.png'

# Favicons: transparent background
New-LogoIcon 16  'public\\favicon-16x16.png' $logoPath '' 0.10
New-LogoIcon 32  'public\\favicon-32x32.png' $logoPath '' 0.12

# App icons: use the same background as the manifest
$appBg = '#0f172a'
New-LogoIcon 180 'public\\apple-touch-icon.png' $logoPath $appBg 0.18
New-LogoIcon 192 'public\\android-chrome-192x192.png' $logoPath $appBg 0.18
New-LogoIcon 512 'public\\android-chrome-512x512.png' $logoPath $appBg 0.22
