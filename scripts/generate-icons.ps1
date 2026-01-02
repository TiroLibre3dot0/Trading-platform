$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

function New-RoundedRectPath([float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $r * 2
  $path.AddArc($x, $y, $d, $d, 180, 90) | Out-Null
  $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90) | Out-Null
  $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90) | Out-Null
  $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90) | Out-Null
  $path.CloseFigure() | Out-Null
  return $path
}

function New-BullwavesIcon([int]$size, [string]$outPath) {
  $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)

  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

  $bg = [System.Drawing.ColorTranslator]::FromHtml('#1e40af')
  $line = [System.Drawing.ColorTranslator]::FromHtml('#60a5fa')
  $accent = [System.Drawing.ColorTranslator]::FromHtml('#34d399')

  $g.Clear([System.Drawing.Color]::Transparent)

  $radius = [Math]::Max(2, [Math]::Round($size * 0.125))
  $rr = New-RoundedRectPath 0 0 $size $size $radius
  $bgBrush = New-Object System.Drawing.SolidBrush($bg)
  $g.FillPath($bgBrush, $rr)

  $scale = $size / 64.0
  $stroke = [Math]::Max(2, [Math]::Round($size * (3.0 / 64.0)))
  $pen = New-Object System.Drawing.Pen($line, $stroke)
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

  $pts = @(
    [System.Drawing.PointF]::new([single](12 * $scale), [single](44 * $scale))
    [System.Drawing.PointF]::new([single](18 * $scale), [single](38 * $scale))
    [System.Drawing.PointF]::new([single](24 * $scale), [single](42 * $scale))
    [System.Drawing.PointF]::new([single](30 * $scale), [single](35 * $scale))
    [System.Drawing.PointF]::new([single](36 * $scale), [single](40 * $scale))
    [System.Drawing.PointF]::new([single](42 * $scale), [single](32 * $scale))
    [System.Drawing.PointF]::new([single](48 * $scale), [single](36 * $scale))
    [System.Drawing.PointF]::new([single](54 * $scale), [single](28 * $scale))
  )
  $g.DrawLines($pen, $pts)

  $accentBrush = New-Object System.Drawing.SolidBrush($accent)

  $arrow = New-Object System.Drawing.Drawing2D.GraphicsPath
  $arrowPts = @(
    [System.Drawing.PointF]::new([single](44 * $scale), [single](30 * $scale))
    [System.Drawing.PointF]::new([single](50 * $scale), [single](24 * $scale))
    [System.Drawing.PointF]::new([single](56 * $scale), [single](30 * $scale))
    [System.Drawing.PointF]::new([single](53 * $scale), [single](30 * $scale))
    [System.Drawing.PointF]::new([single](53 * $scale), [single](36 * $scale))
    [System.Drawing.PointF]::new([single](47 * $scale), [single](36 * $scale))
    [System.Drawing.PointF]::new([single](47 * $scale), [single](30 * $scale))
  )
  $arrow.AddPolygon($arrowPts) | Out-Null
  $g.FillPath($accentBrush, $arrow)

  $candleW = [Math]::Max(1, [Math]::Round(2 * $scale))
  $candleH = [Math]::Max(1, [Math]::Round(6 * $scale))
  $candleX = [Math]::Round(16 * $scale)
  $candleY = [Math]::Round(38 * $scale)
  $g.FillRectangle($accentBrush, $candleX, $candleY, $candleW, $candleH)

  $thin = [Math]::Max(1, [Math]::Round(1 * $scale))
  $accentPen = New-Object System.Drawing.Pen($accent, $thin)
  $g.DrawLine($accentPen, (17 * $scale), (35 * $scale), (17 * $scale), (44 * $scale))
  $g.DrawLine($accentPen, (15 * $scale), (35 * $scale), (19 * $scale), (35 * $scale))
  $g.DrawLine($accentPen, (15 * $scale), (44 * $scale), (19 * $scale), (44 * $scale))

  $outFull = Join-Path (Get-Location) $outPath
  $dir = Split-Path $outFull -Parent
  if (!(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }

  $bmp.Save($outFull, [System.Drawing.Imaging.ImageFormat]::Png)

  $accentPen.Dispose()
  $arrow.Dispose()
  $accentBrush.Dispose()
  $pen.Dispose()
  $bgBrush.Dispose()
  $rr.Dispose()
  $g.Dispose()
  $bmp.Dispose()

  Write-Output "Wrote $outPath ($size x $size)"
}

New-BullwavesIcon 16  'public\\favicon-16x16.png'
New-BullwavesIcon 32  'public\\favicon-32x32.png'
New-BullwavesIcon 180 'public\\apple-touch-icon.png'
New-BullwavesIcon 192 'public\\android-chrome-192x192.png'
New-BullwavesIcon 512 'public\\android-chrome-512x512.png'
