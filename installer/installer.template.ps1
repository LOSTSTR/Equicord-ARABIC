#Requires -Version 5.1
<#
.SYNOPSIS
    Equicord-ARABIC Installer
.DESCRIPTION
    Equicord-ARABIC — glassmorphism installer with Arabic UI
    Repository: https://github.com/LOSTSTR/Equicord-ARABIC
    Copyright (c) 2026 LOSTSTR — GPL-3.0
#>

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
[System.Windows.Forms.Application]::EnableVisualStyles()
[System.Windows.Forms.Application]::SetCompatibleTextRenderingDefault($false)

# GlowButton: custom button with rounded corners and hover glow effect
Add-Type -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

public class GlowButton : Button {
    private bool _h = false;
    public Color HoverColor   { get; set; }
    public Color GlowColor    { get; set; }
    public int   CornerRadius { get; set; }

    public GlowButton() {
        CornerRadius = 12;
        HoverColor   = Color.Empty;
        GlowColor    = Color.FromArgb(140, 88, 101, 242);
        SetStyle(ControlStyles.UserPaint | ControlStyles.AllPaintingInWmPaint |
                 ControlStyles.OptimizedDoubleBuffer, true);
        FlatStyle = FlatStyle.Flat;
        FlatAppearance.BorderSize = 0;
        Cursor = Cursors.Hand;
    }

    protected override void OnMouseEnter(EventArgs e) { _h = true;  Invalidate(); base.OnMouseEnter(e); }
    protected override void OnMouseLeave(EventArgs e) { _h = false; Invalidate(); base.OnMouseLeave(e); }
    protected override void OnResize(EventArgs e)     { base.OnResize(e); RefreshRegion(); }

    private void RefreshRegion() {
        if (Width < 1 || Height < 1) return;
        using (var gp = RoundPath(new Rectangle(0, 0, Width, Height)))
            Region = new Region(gp);
    }

    private GraphicsPath RoundPath(Rectangle r) {
        int d = Math.Min(CornerRadius * 2, Math.Min(r.Width, r.Height));
        var gp = new GraphicsPath();
        gp.AddArc(r.Left,      r.Top,      d, d, 180, 90);
        gp.AddArc(r.Right - d, r.Top,      d, d, 270, 90);
        gp.AddArc(r.Right - d, r.Bottom-d, d, d,   0, 90);
        gp.AddArc(r.Left,      r.Bottom-d, d, d,  90, 90);
        gp.CloseFigure();
        return gp;
    }

    protected override void OnPaint(PaintEventArgs pe) {
        var g = pe.Graphics;
        g.SmoothingMode = SmoothingMode.AntiAlias;
        var rect = new Rectangle(0, 0, Width - 1, Height - 1);
        Color bg = (_h && HoverColor != Color.Empty) ? HoverColor : BackColor;
        using (var path = RoundPath(rect)) {
            using (var br = new SolidBrush(bg))
                g.FillPath(br, path);
            if (_h) {
                using (var pen = new Pen(GlowColor, 1.5f))
                    g.DrawPath(pen, path);
            }
        }
        TextRenderer.DrawText(g, Text, Font,
            new Rectangle(0, 0, Width, Height), ForeColor,
            TextFormatFlags.HorizontalCenter | TextFormatFlags.VerticalCenter |
            TextFormatFlags.WordBreak);
    }
}
"@ -ReferencedAssemblies @('System.Windows.Forms', 'System.Drawing')

# ═══════════════════════════════════════════════════════════════════
#  Constants
# ═══════════════════════════════════════════════════════════════════
$REPO_OWNER    = "LOSTSTR"
$REPO_NAME     = "Equicord-ARABIC"
$INSTALLER_VER = "{{INSTALLER_VERSION}}"
$ASAR_NAME     = "desktop.asar"
$RELEASE_API   = "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/releases/latest"
$USER_AGENT    = "EquicordArabic-Installer/$INSTALLER_VER (+https://github.com/$REPO_OWNER/$REPO_NAME)"
$SUPPORT_URL   = "https://discord.gg/A7MycP5xWX"

$DataDir = if ($env:EQUICORD_USER_DATA_DIR) {
    $env:EQUICORD_USER_DATA_DIR
} else {
    $appData = if ($env:APPDATA) { $env:APPDATA } else { [System.Environment]::GetFolderPath("ApplicationData") }
    Join-Path $appData "Equicord-ARABIC"
}
$AsarTarget = Join-Path $DataDir "equicord.asar"

# Glassmorphism color palette
$BG_DARK       = [System.Drawing.Color]::FromArgb( 10,  11,  20)
$BG_PANEL      = [System.Drawing.Color]::FromArgb( 18,  19,  42)
$FG_WHITE      = [System.Drawing.Color]::FromArgb(227, 229, 232)
$FG_MUTED      = [System.Drawing.Color]::FromArgb(142, 146, 151)
$WARN_BG       = [System.Drawing.Color]::FromArgb(254, 231,  92)
$WARN_FG       = [System.Drawing.Color]::FromArgb( 46,  42,   0)
$BTN_INSTALL   = [System.Drawing.Color]::FromArgb( 87, 242, 135)
$BTN_INSTALL_H = [System.Drawing.Color]::FromArgb( 59, 165,  93)
$BTN_REPAIR    = [System.Drawing.Color]::FromArgb( 88, 101, 242)
$BTN_REPAIR_H  = [System.Drawing.Color]::FromArgb( 71,  82, 196)
$BTN_REMOVE    = [System.Drawing.Color]::FromArgb(237,  66,  69)
$BTN_REMOVE_H  = [System.Drawing.Color]::FromArgb(192,  53,  55)
$BTN_OPENSAR   = [System.Drawing.Color]::FromArgb( 87, 242, 135)
$BTN_OPENSAR_H = [System.Drawing.Color]::FromArgb( 59, 165,  93)
$BTN_SUPPORT   = [System.Drawing.Color]::FromArgb( 88, 101, 242)
$BTN_SUPPORT_H = [System.Drawing.Color]::FromArgb( 71,  82, 196)
$LINK_COLOR    = [System.Drawing.Color]::FromArgb(  0, 176, 244)

# ═══════════════════════════════════════════════════════════════════
#  Discord install detection
# ═══════════════════════════════════════════════════════════════════
function Get-DiscordInstalls {
    $variants = @(
        @{ Name = "Stable";      Dir = "Discord" }
        @{ Name = "PTB";         Dir = "DiscordPTB" }
        @{ Name = "Canary";      Dir = "DiscordCanary" }
        @{ Name = "Development"; Dir = "DiscordDevelopment" }
    )
    $found = [System.Collections.Generic.List[hashtable]]::new()
    foreach ($v in $variants) {
        $localApp = if ($env:LOCALAPPDATA) { $env:LOCALAPPDATA } else { [System.Environment]::GetFolderPath("LocalApplicationData") }
        $base = Join-Path $localApp $v.Dir
        if (-not (Test-Path $base)) { continue }
        $appDir = Get-ChildItem $base -Directory -Filter "app-*" -EA SilentlyContinue |
                  Sort-Object Name -Descending | Select-Object -First 1
        if (-not $appDir) { continue }
        $res = Join-Path $appDir.FullName "resources"
        if (-not (Test-Path $res)) { continue }
        $patched = Test-Path (Join-Path $res "_app.asar")
        $found.Add(@{
            Label     = "$($v.Name) — $base$(if ($patched) { ' [مُثبَّت]' })"
            Name      = $v.Name
            Resources = $res
            Patched   = $patched
        })
    }
    return $found
}

# ═══════════════════════════════════════════════════════════════════
#  GitHub Release
# ═══════════════════════════════════════════════════════════════════
function Get-LatestTag {
    try {
        $r = Invoke-RestMethod $RELEASE_API -Headers @{"User-Agent"=$USER_AGENT} -EA Stop
        return $r.tag_name
    } catch { return "غير متاح" }
}

function Get-LocalVersion([string]$ResourcesPath) {
    if (-not (Test-Path (Join-Path $ResourcesPath "_app.asar"))) { return "لا يوجد" }
    try {
        return (Get-Item (Join-Path $ResourcesPath "app.asar")).LastWriteTime.ToString("yyyy-MM-dd")
    } catch { return "مثبَّت" }
}

# ═══════════════════════════════════════════════════════════════════
#  Discord process management
# ═══════════════════════════════════════════════════════════════════
function Stop-DiscordProcesses {
    param([string]$ResourcesPath)
    $appDir     = Split-Path $ResourcesPath -Parent
    $discordDir = Split-Path $appDir -Parent
    $procName   = Split-Path $discordDir -Leaf
    Get-Process -Name $procName -EA SilentlyContinue | Stop-Process -Force -EA SilentlyContinue
    Start-Sleep -Milliseconds 800
}

function Start-DiscordProcess {
    param([string]$ResourcesPath)
    $appDir  = Split-Path $ResourcesPath -Parent
    $varName = Split-Path (Split-Path $appDir -Parent) -Leaf
    $exe     = Join-Path $appDir "$varName.exe"
    if (Test-Path $exe) { Start-Process $exe -EA SilentlyContinue }
}

# ═══════════════════════════════════════════════════════════════════
#  ASAR shim writer (Equilotl-style)
# ═══════════════════════════════════════════════════════════════════
function Write-AppAsarShim {
    param([string]$Path, [string]$EquicordAsarPath)
    $reqPath  = $EquicordAsarPath -replace '\\', '/'
    $indexJs  = [System.Text.Encoding]::UTF8.GetBytes("require(`"$reqPath`")")
    $pkgJson  = [System.Text.Encoding]::UTF8.GetBytes('{"name":"discord","main":"index.js"}')
    $off1     = $indexJs.Length
    $hdr      = "{`"files`":{`"index.js`":{`"size`":$off1,`"offset`":`"0`"},`"package.json`":{`"size`":$($pkgJson.Length),`"offset`":`"$off1`"}}}"
    $hdrBytes = [System.Text.Encoding]::UTF8.GetBytes($hdr)
    $hdrLen   = $hdrBytes.Length
    $alignLen = [int]([Math]::Ceiling($hdrLen / 4.0) * 4)
    $padded   = New-Object byte[] $alignLen
    [Array]::Copy($hdrBytes, $padded, $hdrLen)
    $ms = New-Object System.IO.MemoryStream
    $bw = New-Object System.IO.BinaryWriter($ms)
    $bw.Write([uint32]4)
    $bw.Write([uint32]($alignLen + 8))
    $bw.Write([uint32]($alignLen + 4))
    $bw.Write([uint32]$hdrLen)
    $bw.Write($padded)
    $bw.Write($indexJs)
    $bw.Write($pkgJson)
    $bw.Flush()
    [System.IO.File]::WriteAllBytes($Path, $ms.ToArray())
    $bw.Dispose(); $ms.Dispose()
}

# ═══════════════════════════════════════════════════════════════════
#  Download with progress
# ═══════════════════════════════════════════════════════════════════
function Invoke-Download {
    param([string]$Url, [string]$Dest, [scriptblock]$OnProgress)
    $req = [System.Net.HttpWebRequest]::Create($Url)
    $req.UserAgent = $USER_AGENT
    $req.AllowAutoRedirect = $true
    $resp  = $req.GetResponse()
    $total = $resp.ContentLength
    $sr    = $resp.GetResponseStream()
    $fs    = [System.IO.File]::Create($Dest)
    $buf   = New-Object byte[] 65536
    $done  = 0L
    try {
        while ($true) {
            $n = $sr.Read($buf, 0, $buf.Length)
            if ($n -le 0) { break }
            $fs.Write($buf, 0, $n)
            $done += $n
            if ($total -gt 0 -and $OnProgress) {
                & $OnProgress ([int](($done / $total) * 100)) $done $total
            }
        }
    } finally { $fs.Close(); $sr.Close(); $resp.Close() }
}

# ═══════════════════════════════════════════════════════════════════
#  Install / Uninstall / OpenAsar
# ═══════════════════════════════════════════════════════════════════
function Install-Mod {
    param([string]$ResourcesPath, [scriptblock]$Status, [scriptblock]$Progress)

    & $Status "إيقاف Discord..."
    & $Progress 3
    Stop-DiscordProcesses $ResourcesPath

    & $Status "جارٍ جلب معلومات آخر إصدار..."
    & $Progress 5

    $release = Invoke-RestMethod $RELEASE_API -Headers @{"User-Agent"=$USER_AGENT} -EA Stop
    $asset   = $release.assets | Where-Object { $_.name -eq $ASAR_NAME } | Select-Object -First 1
    if (-not $asset) { throw "لم يُعثر على ملف $ASAR_NAME في الإصدار $($release.tag_name)" }

    $mb = [math]::Round($asset.size / 1MB, 1)
    & $Status "تحميل $ASAR_NAME — $($release.tag_name) ($mb MB)"
    & $Progress 10

    New-Item -ItemType Directory -Path $DataDir -Force | Out-Null
    $tmp = Join-Path ([System.IO.Path]::GetTempPath()) ("eq_ar_" + [guid]::NewGuid().ToString("N") + ".asar")

    Invoke-Download -Url $asset.browser_download_url -Dest $tmp -OnProgress {
        param($p,$dl,$tot)
        $mn=[math]::Round($dl/1MB,1); $mt=[math]::Round($tot/1MB,1)
        & $Status "تحميل: $mn/$mt MB  ($p%)"
        & $Progress ([int](10 + $p * 0.55))
    }

    $appAsar  = Join-Path $ResourcesPath "app.asar"
    $origAsar = Join-Path $ResourcesPath "_app.asar"

    & $Status "نسخ equicord.asar إلى مجلد البيانات..."
    & $Progress 68

    Copy-Item $tmp $AsarTarget -Force
    Remove-Item $tmp -EA SilentlyContinue

    & $Status "حفظ نسخة احتياطية من Discord الأصلي..."
    & $Progress 75

    if (-not (Test-Path $origAsar)) {
        if (Test-Path $appAsar) {
            Copy-Item $appAsar $origAsar -Force
        } else {
            throw "لم يُعثر على app.asar في مجلد موارد Discord"
        }
    }

    & $Status "كتابة شيم Equicord في Discord..."
    & $Progress 85

    Write-AppAsarShim -Path $appAsar -EquicordAsarPath $AsarTarget

    & $Progress 93
    & $Status "إعادة تشغيل Discord..."
    Start-DiscordProcess $ResourcesPath
    Start-Sleep -Milliseconds 300

    & $Progress 100
    & $Status "تم التثبيت — Discord يُعاد تشغيله الآن"
}

function Uninstall-Mod {
    param([string]$ResourcesPath, [scriptblock]$Status, [scriptblock]$Progress)

    & $Status "إيقاف Discord..."
    & $Progress 10
    Stop-DiscordProcesses $ResourcesPath

    $appAsar  = Join-Path $ResourcesPath "app.asar"
    $origAsar = Join-Path $ResourcesPath "_app.asar"

    & $Status "جارٍ استعادة Discord الأصلي..."
    & $Progress 40

    if (Test-Path $origAsar) {
        Copy-Item $origAsar $appAsar -Force
        Remove-Item $origAsar -Force
        & $Status "تمت استعادة app.asar الأصلي"
    } else {
        & $Status "لم يُعثر على _app.asar — ربما لم يُثبَّت Equicord في هذا المسار"
    }

    & $Progress 80
    if (Test-Path $AsarTarget) { Remove-Item $AsarTarget -EA SilentlyContinue }
    & $Progress 90

    & $Status "إعادة تشغيل Discord..."
    Start-DiscordProcess $ResourcesPath
    Start-Sleep -Milliseconds 300

    & $Progress 100
    & $Status "تمت الإزالة — Discord يُعاد تشغيله الآن"
}

function Install-OpenAsar {
    param([string]$ResourcesPath, [scriptblock]$Status, [scriptblock]$Progress)
    & $Status "جارٍ تنزيل OpenAsar..."
    & $Progress 10
    $tmp = Join-Path ([System.IO.Path]::GetTempPath()) ("openasar_" + [guid]::NewGuid().ToString("N") + ".asar")
    Invoke-Download "https://github.com/GooseMod/OpenAsar/releases/download/nightly/app.asar" $tmp {
        param($p) & $Progress ([int](10 + $p * 0.85))
    }
    & $Status "نسخ OpenAsar..."
    & $Progress 97
    Copy-Item $tmp (Join-Path $ResourcesPath "app.asar") -Force
    Remove-Item $tmp -EA SilentlyContinue
    & $Progress 100
    & $Status "تم تثبيت OpenAsar — أعد تشغيل Discord"
}

# ═══════════════════════════════════════════════════════════════════
#  GUI
# ═══════════════════════════════════════════════════════════════════
function Show-Installer {

    $form = New-Object System.Windows.Forms.Form
    $form.Text            = "Equicord-ARABIC"
    $form.ClientSize      = New-Object System.Drawing.Size(1200, 786)
    $form.StartPosition   = [System.Windows.Forms.FormStartPosition]::CenterScreen
    $form.BackColor       = $BG_DARK
    $form.FormBorderStyle = [System.Windows.Forms.FormBorderStyle]::FixedSingle
    $form.MaximizeBox     = $false
    $form.Font            = New-Object System.Drawing.Font("Segoe UI", 11)
    $form.MinimumSize     = $form.Size
    $form.MaximumSize     = $form.Size

    try {
        $form.Icon = [System.Drawing.Icon]::ExtractAssociatedIcon(
            [System.Diagnostics.Process]::GetCurrentProcess().MainModule.FileName)
    } catch {}

    function Lbl {
        param([string]$T, [int]$X, [int]$Y, [System.Drawing.Color]$C,
              [float]$FS = 11,
              [System.Drawing.FontStyle]$FS2 = [System.Drawing.FontStyle]::Regular,
              [int]$W = 0, [int]$H = 0)
        if (-not $C) { $C = $FG_WHITE }
        $l = New-Object System.Windows.Forms.Label
        $l.Text      = $T
        $l.Location  = New-Object System.Drawing.Point($X, $Y)
        $l.ForeColor = $C
        $l.BackColor = [System.Drawing.Color]::Transparent
        $l.Font      = New-Object System.Drawing.Font("Segoe UI", $FS, $FS2)
        if ($W -gt 0) {
            $l.AutoSize = $false
            $l.Size     = New-Object System.Drawing.Size($W, $H)
        } else {
            $l.AutoSize = $true
        }
        return $l
    }

    # ── Title ─────────────────────────────────────────────────────────
    $title = Lbl "Equicord-ARABIC" 0 14 $FG_WHITE 28 Bold -W 1200 -H 48
    $title.TextAlign = [System.Drawing.ContentAlignment]::MiddleCenter
    $form.Controls.Add($title)

    # ── Subtitle ──────────────────────────────────────────────────────
    $subtitle = Lbl "النسخة العربية المطورة من Equicord  *  LOSTSTR Digital Branding" 0 64 $FG_MUTED 10 Regular -W 1200 -H 22
    $subtitle.TextAlign = [System.Drawing.ContentAlignment]::MiddleCenter
    $form.Controls.Add($subtitle)

    # ── Info section ──────────────────────────────────────────────────
    $infoY = 92

    $pathLbl = Lbl "سيتم تنزيل Equicord-ARABIC إلى: $AsarTarget" 48 $infoY $FG_WHITE 11
    $form.Controls.Add($pathLbl)

    $btnOpenDir = New-Object System.Windows.Forms.Button
    $btnOpenDir.Text      = "فتح المجلد"
    $btnOpenDir.Location  = New-Object System.Drawing.Point(($pathLbl.Right + 12), ($infoY - 2))
    $btnOpenDir.AutoSize  = $true
    $btnOpenDir.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
    $btnOpenDir.BackColor = $LINK_COLOR
    $btnOpenDir.ForeColor = [System.Drawing.Color]::White
    $btnOpenDir.FlatAppearance.BorderSize = 0
    $btnOpenDir.Font      = New-Object System.Drawing.Font("Segoe UI", 9)
    $btnOpenDir.Cursor    = [System.Windows.Forms.Cursors]::Hand
    $btnOpenDir.Add_Click({
        New-Item -ItemType Directory -Path $DataDir -Force | Out-Null
        Start-Process explorer.exe $DataDir
    })
    $form.Controls.Add($btnOpenDir)

    $form.Controls.Add((Lbl "لتخصيص هذا المسار، قم بتعيين متغير البيئة 'EQUICORD_USER_DATA_DIR' ثم أعد تشغيل المثبت" 48 ($infoY + 28) $FG_MUTED 10))

    $lblInstallerVer = Lbl "اصدار المثبت: v$INSTALLER_VER" 48 ($infoY + 54) $FG_WHITE 10
    $form.Controls.Add($lblInstallerVer)

    $lblLocalVer = Lbl "الاصدار المثبت محلياً: جارٍ الفحص..." 48 ($infoY + 78) $FG_WHITE 10
    $form.Controls.Add($lblLocalVer)

    $lblLatestVer = Lbl "اخر اصدار متاح: جارٍ الجلب..." 48 ($infoY + 102) $FG_WHITE 10
    $form.Controls.Add($lblLatestVer)

    # ── Warning panel (rounded corners) ───────────────────────────────
    $warnY    = 222
    $warnW    = 1104
    $warnH    = 80
    $warnCorD = 24

    $warnPanel = New-Object System.Windows.Forms.Panel
    $warnPanel.Location  = New-Object System.Drawing.Point(48, $warnY)
    $warnPanel.Size      = New-Object System.Drawing.Size($warnW, $warnH)
    $warnPanel.BackColor = $WARN_BG

    $warpGp = New-Object System.Drawing.Drawing2D.GraphicsPath
    $warpGp.AddArc(0,                   0,                    $warnCorD, $warnCorD, 180, 90)
    $warpGp.AddArc($warnW - $warnCorD,  0,                    $warnCorD, $warnCorD, 270, 90)
    $warpGp.AddArc($warnW - $warnCorD,  $warnH - $warnCorD,  $warnCorD, $warnCorD,   0, 90)
    $warpGp.AddArc(0,                   $warnH - $warnCorD,  $warnCorD, $warnCorD,  90, 90)
    $warpGp.CloseFigure()
    $warnPanel.Region = New-Object System.Drawing.Region($warpGp)
    $form.Controls.Add($warnPanel)

    $warnText = New-Object System.Windows.Forms.Label
    $warnText.Text      = "GitHub ومستودع LOSTSTR/Equicord-ARABIC هما المصدران الرسميان الوحيدان للحصول على Equicord-ARABIC.`nاي مصدر اخر يدّعي توزيعه يُعتبر ضاراً. إذا قمت بتنزيله من مكان اخر، احذف كل شيء وأجرِ فحصاً للبرامج الضارة وغيّر كلمة مرور Discord."
    $warnText.Location  = New-Object System.Drawing.Point(14, 8)
    $warnText.Size      = New-Object System.Drawing.Size(1076, 64)
    $warnText.ForeColor = $WARN_FG
    $warnText.BackColor = [System.Drawing.Color]::Transparent
    $warnText.Font      = New-Object System.Drawing.Font("Segoe UI", 10)
    $warnPanel.Controls.Add($warnText)

    # ── Selection section ─────────────────────────────────────────────
    $selectY = 318
    $form.Controls.Add((Lbl "الرجاء اختيار نسخة Discord للتعديل عليها" 48 $selectY $FG_WHITE 13 Bold))

    $radios   = [System.Collections.Generic.List[System.Windows.Forms.RadioButton]]::new()
    $installs = @(Get-DiscordInstalls)
    $radioY   = $selectY + 36

    foreach ($inst in $installs) {
        $rb = New-Object System.Windows.Forms.RadioButton
        $rb.Text      = $inst.Label
        $rb.Tag       = $inst
        $rb.Location  = New-Object System.Drawing.Point(52, $radioY)
        $rb.AutoSize  = $true
        $rb.ForeColor = $FG_WHITE
        $rb.BackColor = [System.Drawing.Color]::Transparent
        $rb.Font      = New-Object System.Drawing.Font("Segoe UI", 11)
        $rb.Cursor    = [System.Windows.Forms.Cursors]::Hand
        $form.Controls.Add($rb)
        $radios.Add($rb)
        $radioY += 30
    }

    if ($radios.Count -gt 0) {
        $radios[0].Checked = $true
    } else {
        $form.Controls.Add((Lbl "لم يُعثر على اي نسخة من Discord مثبتة على هذا الجهاز" 52 $radioY $FG_MUTED 10))
        $radioY += 28
    }

    $rbCustom = New-Object System.Windows.Forms.RadioButton
    $rbCustom.Text      = "مسار تثبيت مخصص"
    $rbCustom.Location  = New-Object System.Drawing.Point(52, ($radioY + 8))
    $rbCustom.AutoSize  = $true
    $rbCustom.ForeColor = $FG_WHITE
    $rbCustom.BackColor = [System.Drawing.Color]::Transparent
    $rbCustom.Font      = New-Object System.Drawing.Font("Segoe UI", 11)
    $rbCustom.Cursor    = [System.Windows.Forms.Cursors]::Hand
    $form.Controls.Add($rbCustom)

    $txtCustom = New-Object System.Windows.Forms.TextBox
    $txtCustom.Location    = New-Object System.Drawing.Point(48, ($radioY + 44))
    $txtCustom.Size        = New-Object System.Drawing.Size(1104, 36)
    $txtCustom.BackColor   = $BG_PANEL
    $txtCustom.ForeColor   = $FG_MUTED
    $txtCustom.BorderStyle = [System.Windows.Forms.BorderStyle]::FixedSingle
    $txtCustom.Font        = New-Object System.Drawing.Font("Segoe UI", 11)
    $txtCustom.Text        = "المسار المخصص (مجلد resources الخاص بـ Discord)"
    $txtCustom.Enabled     = $false
    $form.Controls.Add($txtCustom)

    $rbCustom.Add_CheckedChanged({
        $txtCustom.Enabled   = $rbCustom.Checked
        $txtCustom.ForeColor = if ($rbCustom.Checked) { $FG_WHITE } else { $FG_MUTED }
    })

    # ── Status + progress bar ─────────────────────────────────────────
    $statusY = 572

    $lblStatus = New-Object System.Windows.Forms.Label
    $lblStatus.Text      = "اختر نسخة Discord ثم اضغط على احد الازرار"
    $lblStatus.Location  = New-Object System.Drawing.Point(48, $statusY)
    $lblStatus.Size      = New-Object System.Drawing.Size(1104, 26)
    $lblStatus.ForeColor = $FG_MUTED
    $lblStatus.BackColor = [System.Drawing.Color]::Transparent
    $lblStatus.Font      = New-Object System.Drawing.Font("Segoe UI", 10)
    $form.Controls.Add($lblStatus)

    $progBar = New-Object System.Windows.Forms.ProgressBar
    $progBar.Location = New-Object System.Drawing.Point(48, ($statusY + 28))
    $progBar.Size     = New-Object System.Drawing.Size(1104, 8)
    $progBar.Minimum  = 0
    $progBar.Maximum  = 100
    $progBar.Value    = 0
    $progBar.Style    = [System.Windows.Forms.ProgressBarStyle]::Continuous
    $form.Controls.Add($progBar)

    # ── Action buttons (GlowButton) ───────────────────────────────────
    $btnY   = 616
    $btnW   = 264
    $btnH   = 52
    $gap    = 8
    $startX = 48

    function New-GlowBtn {
        param(
            [string]$T,
            [System.Drawing.Color]$Bg,
            [System.Drawing.Color]$Hover,
            [System.Drawing.Color]$Glow,
            [int]$PosX,
            [int]$PosY  = -1,
            [int]$SzW   = -1,
            [int]$SzH   = -1
        )
        $b = New-Object GlowButton
        $b.Text         = $T
        $resolvedY      = if ($PosY -ge 0) { $PosY } else { $btnY }
        $resolvedW      = if ($SzW  -ge 0) { $SzW  } else { $btnW }
        $resolvedH      = if ($SzH  -ge 0) { $SzH  } else { $btnH }
        $b.Location     = New-Object System.Drawing.Point($PosX, $resolvedY)
        $b.Size         = New-Object System.Drawing.Size($resolvedW, $resolvedH)
        $b.BackColor    = $Bg
        $b.HoverColor   = $Hover
        $b.GlowColor    = $Glow
        $b.ForeColor    = [System.Drawing.Color]::White
        $b.Font         = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
        $b.CornerRadius = 12
        $form.Controls.Add($b)
        return $b
    }

    $gGreen = [System.Drawing.Color]::FromArgb(140,  59, 165,  93)
    $gBlue  = [System.Drawing.Color]::FromArgb(140,  71,  82, 196)
    $gRed   = [System.Drawing.Color]::FromArgb(140, 192,  53,  55)

    $btnInstall = New-GlowBtn "تثبيت"                    $BTN_INSTALL  $BTN_INSTALL_H  $gGreen ($startX)
    $btnRepair  = New-GlowBtn "إعادة التثبيت / الإصلاح" $BTN_REPAIR   $BTN_REPAIR_H   $gBlue  ($startX + $btnW + $gap)
    $btnRemove  = New-GlowBtn "إزالة التثبيت"            $BTN_REMOVE   $BTN_REMOVE_H   $gRed   ($startX + ($btnW + $gap) * 2)
    $btnOpenSar = New-GlowBtn "تثبيت OpenAsar"           $BTN_OPENSAR  $BTN_OPENSAR_H  $gGreen ($startX + ($btnW + $gap) * 3)

    # ── Support Discord button ────────────────────────────────────────
    $btnSupport = New-GlowBtn "انضم الى سيرفر الدعم العربي على Discord" $BTN_SUPPORT $BTN_SUPPORT_H $gBlue 360 672 480 48
    $btnSupport.Add_Click({ Start-Process $SUPPORT_URL })

    # ── Footer ────────────────────────────────────────────────────────
    $footerLegal = Lbl "This project is a fork of Equicord. All credits for the core engine go to the original creators. This version focuses on Arabic localization and custom enhancements by LOSTSTR." 0 728 $FG_MUTED 8.5 Regular -W 1200 -H 30
    $footerLegal.TextAlign = [System.Drawing.ContentAlignment]::MiddleCenter
    $form.Controls.Add($footerLegal)

    $footerBrand = Lbl "LOSTSTR  -  Equicord-ARABIC  2026  *  GPL-3.0 License" 0 760 $FG_MUTED 9 Regular -W 1200 -H 20
    $footerBrand.TextAlign = [System.Drawing.ContentAlignment]::MiddleCenter
    $form.Controls.Add($footerBrand)

    # ── Helper functions ──────────────────────────────────────────────
    function Get-Target {
        if ($rbCustom.Checked) {
            $p = $txtCustom.Text.Trim()
            if (-not $p -or -not (Test-Path $p)) { throw "المسار المخصص غير صحيح او غير موجود" }
            return $p
        }
        foreach ($rb in $radios) {
            if ($rb.Checked) { return $rb.Tag.Resources }
        }
        throw "لم تختر اي نسخة من Discord"
    }

    function Set-Status([string]$Msg, [System.Drawing.Color]$Col) {
        if (-not $Col) { $Col = $FG_WHITE }
        $lblStatus.ForeColor = $Col
        $lblStatus.Text      = $Msg
        $form.Refresh()
        [System.Windows.Forms.Application]::DoEvents()
    }

    function Set-Progress([int]$Val) {
        $progBar.Value = [Math]::Max(0, [Math]::Min(100, $Val))
        [System.Windows.Forms.Application]::DoEvents()
    }

    function Set-Busy([bool]$On) {
        $btnInstall.Enabled = -not $On
        $btnRepair.Enabled  = -not $On
        $btnRemove.Enabled  = -not $On
        $btnOpenSar.Enabled = -not $On
        $btnSupport.Enabled = -not $On
        $form.UseWaitCursor = $On
    }

    function Update-RadioLabels {
        $installs = @(Get-DiscordInstalls)
        $i = 0
        foreach ($rb in $radios) {
            if ($i -lt $installs.Count) {
                $rb.Text = $installs[$i].Label
                $rb.Tag  = $installs[$i]
            }
            $i++
        }
    }

    $form.Add_Shown({
        $sel = $null
        foreach ($rb in $radios) { if ($rb.Checked) { $sel = $rb.Tag; break } }
        if ($sel) {
            $lblLocalVer.Text = "الاصدار المثبت محلياً: $(Get-LocalVersion $sel.Resources)"
        } else {
            $lblLocalVer.Text = "الاصدار المثبت محلياً: لا يوجد"
        }

        $lblLatestVer.Text = "اخر اصدار متاح: جارٍ الجلب..."
        [System.Windows.Forms.Application]::DoEvents()

        $latest = Get-LatestTag
        $lblLatestVer.Text = "اخر اصدار متاح: $latest"
    })

    # ── Button event handlers ─────────────────────────────────────────
    $btnInstall.Add_Click({
        try {
            $target = Get-Target
            Set-Busy $true
            Set-Progress 0
            Set-Status "جارٍ التثبيت..." $FG_WHITE
            Install-Mod $target { param($m) Set-Status $m $FG_WHITE } { param($p) Set-Progress $p }
            Set-Status "تم التثبيت — Discord يُعاد تشغيله تلقائياً" ([System.Drawing.Color]::FromArgb(87, 242, 135))
            Update-RadioLabels
        } catch {
            Set-Status "خطا: $_" ([System.Drawing.Color]::FromArgb(237, 66, 69))
            Set-Progress 0
        } finally { Set-Busy $false }
    })

    $btnRepair.Add_Click({
        try {
            $target = Get-Target
            Set-Busy $true
            Set-Progress 0
            Set-Status "جارٍ إعادة التثبيت..." $FG_WHITE
            Install-Mod $target { param($m) Set-Status $m $FG_WHITE } { param($p) Set-Progress $p }
            Set-Status "تمت إعادة التثبيت — Discord يُعاد تشغيله تلقائياً" ([System.Drawing.Color]::FromArgb(87, 242, 135))
            Update-RadioLabels
        } catch {
            Set-Status "خطا: $_" ([System.Drawing.Color]::FromArgb(237, 66, 69))
            Set-Progress 0
        } finally { Set-Busy $false }
    })

    $btnRemove.Add_Click({
        try {
            $target = Get-Target
            $ans = [System.Windows.Forms.MessageBox]::Show(
                "هل تريد إزالة Equicord-ARABIC بالكامل؟",
                "تاكيد الإزالة",
                [System.Windows.Forms.MessageBoxButtons]::YesNo,
                [System.Windows.Forms.MessageBoxIcon]::Question)
            if ($ans -ne [System.Windows.Forms.DialogResult]::Yes) { return }
            Set-Busy $true
            Set-Progress 0
            Set-Status "جارٍ الإزالة..." $FG_WHITE
            Uninstall-Mod $target { param($m) Set-Status $m $FG_WHITE } { param($p) Set-Progress $p }
            Set-Status "تمت الإزالة — Discord يُعاد تشغيله تلقائياً" ([System.Drawing.Color]::FromArgb(87, 242, 135))
            Update-RadioLabels
        } catch {
            Set-Status "خطا: $_" ([System.Drawing.Color]::FromArgb(237, 66, 69))
            Set-Progress 0
        } finally { Set-Busy $false }
    })

    $btnOpenSar.Add_Click({
        try {
            $target = Get-Target
            Set-Busy $true
            Set-Progress 0
            Set-Status "جارٍ تثبيت OpenAsar..." $FG_WHITE
            Install-OpenAsar $target { param($m) Set-Status $m $FG_WHITE } { param($p) Set-Progress $p }
            Set-Status "تم تثبيت OpenAsar — أعد تشغيل Discord" ([System.Drawing.Color]::FromArgb(87, 242, 135))
        } catch {
            Set-Status "خطا: $_" ([System.Drawing.Color]::FromArgb(237, 66, 69))
            Set-Progress 0
        } finally { Set-Busy $false }
    })

    [void]$form.ShowDialog()
}

Show-Installer
