# make_icon.ps1
# يحوّل logo.png (شعار المشروع) إلى icon.ico بجميع أحجام Windows المطلوبة
# الاستخدام:  .\make_icon.ps1 [-Logo logo.png]
# إذا لم يوجد logo.png يُنشئ أيقونة ذهبية افتراضية تحمل حرفَي "EA"

param(
    [string]$Logo = "logo.png"
)

Add-Type -AssemblyName System.Drawing

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$LogoPath  = Join-Path $ScriptDir $Logo
$IcoPath   = Join-Path $ScriptDir "icon.ico"

# ICO sizes required for a professional Windows application
$Sizes = @(256, 128, 64, 48, 32, 16)

function Save-MultiResIco {
    param([System.Drawing.Image[]]$Frames, [string]$OutPath)

    # ICO format: 6-byte header + N*16-byte directory + N*PNG blobs
    $stream = New-Object System.IO.MemoryStream
    $writer = New-Object System.IO.BinaryWriter($stream)

    # ── ICONDIR header ──
    $writer.Write([uint16]0)                # reserved
    $writer.Write([uint16]1)                # type: ICO
    $writer.Write([uint16]$Frames.Length)   # image count

    # We'll write PNGs first and come back to fill directory offsets
    $dirStart  = $stream.Position           # = 6
    $dirSize   = 16 * $Frames.Length
    $stream.Seek($dirStart + $dirSize, [System.IO.SeekOrigin]::Begin) | Out-Null

    $offsets = @()
    $lengths = @()

    foreach ($img in $Frames) {
        $pngMs = New-Object System.IO.MemoryStream
        $img.Save($pngMs, [System.Drawing.Imaging.ImageFormat]::Png)
        $pngBytes = $pngMs.ToArray()
        $pngMs.Dispose()

        $offsets += [int]$stream.Position
        $lengths += $pngBytes.Length
        $writer.Write($pngBytes)
    }

    # ── Fill ICONDIRENTRY directory ──
    $stream.Seek($dirStart, [System.IO.SeekOrigin]::Begin) | Out-Null
    for ($i = 0; $i -lt $Frames.Length; $i++) {
        $sz = $Frames[$i].Width
        $writer.Write([byte]$(if ($sz -ge 256) { 0 } else { $sz }))  # width (0 = 256)
        $writer.Write([byte]$(if ($sz -ge 256) { 0 } else { $sz }))  # height
        $writer.Write([byte]0)                                         # color count
        $writer.Write([byte]0)                                         # reserved
        $writer.Write([uint16]1)                                       # planes
        $writer.Write([uint16]32)                                      # bit count
        $writer.Write([uint32]$lengths[$i])                            # byte size
        $writer.Write([uint32]$offsets[$i])                            # offset
    }

    $writer.Flush()
    [System.IO.File]::WriteAllBytes($OutPath, $stream.ToArray())
    $stream.Dispose()
}

# ── Load or generate source image ─────────────────────────────────────────────
if (Test-Path $LogoPath) {
    Write-Host "تحميل الشعار من: $LogoPath" -ForegroundColor Cyan
    $src = [System.Drawing.Image]::FromFile($LogoPath)
    # Square crop
    $side = [Math]::Min($src.Width, $src.Height)
    $crop = New-Object System.Drawing.Rectangle(($src.Width-$side)/2, ($src.Height-$side)/2, $side, $side)
    $tmp  = New-Object System.Drawing.Bitmap($side, $side, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g    = [System.Drawing.Graphics]::FromImage($tmp)
    $g.DrawImage($src, [System.Drawing.Rectangle]::new(0,0,$side,$side), $crop, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose(); $src.Dispose()
    $source = $tmp
} else {
    Write-Warning "لم يُعثر على $Logo — سيتم إنشاء أيقونة ذهبية افتراضية"
    Write-Host    "ضع الشعار باسم logo.png في مجلد installer/ ثم أعد التشغيل" -ForegroundColor Yellow

    $source = New-Object System.Drawing.Bitmap(256, 256, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($source)
    $g.SmoothingMode   = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Dark background
    $g.Clear([System.Drawing.Color]::FromArgb(15, 15, 15))

    # Gold border circle
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(212,175,55), 10)
    $g.DrawEllipse($pen, 12, 12, 232, 232)
    $pen.Dispose()

    # Gold "EA" text
    $font  = New-Object System.Drawing.Font("Segoe UI", 90, [System.Drawing.FontStyle]::Bold)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(212,175,55))
    $fmt   = New-Object System.Drawing.StringFormat
    $fmt.Alignment = [System.Drawing.StringAlignment]::Center
    $fmt.LineAlignment = [System.Drawing.StringAlignment]::Center
    $g.DrawString("EA", $font, $brush, (New-Object System.Drawing.RectangleF(0,0,256,256)), $fmt)

    $font.Dispose(); $brush.Dispose(); $g.Dispose()
}

# ── Build frames at each size ─────────────────────────────────────────────────
$frames = @()
foreach ($sz in $Sizes) {
    $bmp = New-Object System.Drawing.Bitmap($sz, $sz, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g   = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.DrawImage($source, 0, 0, $sz, $sz)
    $g.Dispose()
    $frames += $bmp
    Write-Host "  → $sz x $sz px" -ForegroundColor DarkGray
}

$source.Dispose()

# ── Write ICO ──────────────────────────────────────────────────────────────────
Save-MultiResIco $frames $IcoPath
foreach ($f in $frames) { $f.Dispose() }

$sizeKB = [math]::Round((Get-Item $IcoPath).Length / 1KB, 1)
Write-Host ""
Write-Host "تم إنشاء الأيقونة: $IcoPath  ($sizeKB KB)" -ForegroundColor Green
Write-Host "الأحجام: $($Sizes -join ', ') px"          -ForegroundColor Green
