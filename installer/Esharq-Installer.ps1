#Requires -Version 5.1
<#
.SYNOPSIS
    Esharq Installer — تصميم CrimsonNight
.DESCRIPTION
    مُثبِّت Esharq بواجهة CrimsonNight الداكنة
    المستودع: https://github.com/LOSTSTR/Esharq
    Copyright (c) 2026 LOSTSTR — GPL-3.0
#>

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
[System.Windows.Forms.Application]::EnableVisualStyles()
[System.Windows.Forms.Application]::SetCompatibleTextRenderingDefault($false)

# ── Custom Controls ─────────────────────────────────────────────────
Add-Type @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Text;
using System.Windows.Forms;

public class GradientLabel : Control {
    public Color GradientStart { get; set; }
    public Color GradientEnd   { get; set; }
    public GradientLabel() {
        SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.DoubleBuffer | ControlStyles.SupportsTransparentBackColor, true);
        BackColor = Color.Transparent;
    }
    protected override void OnPaint(PaintEventArgs e) {
        if (string.IsNullOrEmpty(Text)) return;
        var g = e.Graphics;
        g.SmoothingMode     = SmoothingMode.AntiAlias;
        g.TextRenderingHint = TextRenderingHint.AntiAlias;
        int[] alphas  = { 8, 18, 30, 44, 58 };
        int[] offsets = { 4,  3,  2,  1,  1 };
        var sf = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center };
        for (int i = 0; i < alphas.Length; i++) {
            using (var b = new SolidBrush(Color.FromArgb(alphas[i], 0, 0, 0)))
                g.DrawString(Text, Font, b, new RectangleF(offsets[i], offsets[i], Width, Height), sf);
        }
        var rect = new RectangleF(0, 0, Width, Height);
        using (var gb = new LinearGradientBrush(new Rectangle(0,0,Width == 0?1:Width, Height == 0?1:Height), GradientStart, GradientEnd, LinearGradientMode.Horizontal))
            g.DrawString(Text, Font, gb, rect, sf);
    }
    protected override void OnResize(EventArgs e) { base.OnResize(e); Invalidate(); }
}

public class GlowButton : Button {
    private bool _h, _dn;
    public Color HoverColor    { get; set; }
    public Color GlowColor     { get; set; }
    public Color FormColor     { get; set; }
    public int   CornerRadius  { get; set; } = 8;
    public GlowButton() {
        SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.DoubleBuffer, true);
        FlatStyle = FlatStyle.Flat;
        FlatAppearance.BorderSize = 0;
    }
    private GraphicsPath RndPath(Rectangle r) {
        int d = Math.Min(CornerRadius * 2, Math.Min(r.Width, r.Height));
        var gp = new GraphicsPath();
        gp.AddArc(r.Left, r.Top, d, d, 180, 90);
        gp.AddArc(r.Right - d, r.Top, d, d, 270, 90);
        gp.AddArc(r.Right - d, r.Bottom - d, d, d, 0, 90);
        gp.AddArc(r.Left, r.Bottom - d, d, d, 90, 90);
        gp.CloseFigure();
        return gp;
    }
    protected override void OnPaint(PaintEventArgs pe) {
        var g = pe.Graphics;
        g.SmoothingMode = SmoothingMode.AntiAlias;
        g.Clear(FormColor == Color.Empty ? Color.FromArgb(11,11,16) : FormColor);
        var r = ClientRectangle;
        var col = _dn ? Color.FromArgb(-20 + GlowColor.R, Math.Max(0,GlowColor.G-20), Math.Max(0,GlowColor.B-20))
                      : _h  ? HoverColor : BackColor;
        // Glow shadow
        if (_h || _dn) {
            int[] a = {8,22,42}; int[] pad = {3,2,1};
            foreach (var (aa,pp) in new[]{(a[0],pad[0]),(a[1],pad[1]),(a[2],pad[2])}) {
                using (var b = new SolidBrush(Color.FromArgb(aa, GlowColor)))
                using (var p = RndPath(Rectangle.Inflate(r, pp, pp))) {
                    g.FillPath(b, p);
                }
            }
        }
        using (var p = RndPath(r)) {
            using (var b = new SolidBrush(col)) g.FillPath(b, p);
        }
        var sf = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center };
        using (var b = new SolidBrush(ForeColor))
            g.DrawString(Text, Font, b, r, sf);
    }
    protected override void OnMouseEnter(EventArgs e) { _h=true;  Invalidate(); base.OnMouseEnter(e); }
    protected override void OnMouseLeave(EventArgs e) { _h=false; Invalidate(); base.OnMouseLeave(e); }
    protected override void OnMouseDown(MouseEventArgs e) { _dn=true;  Invalidate(); base.OnMouseDown(e); }
    protected override void OnMouseUp(MouseEventArgs e)   { _dn=false; Invalidate(); base.OnMouseUp(e); }
}

public class CapsuleProgress : Control {
    private int _val;
    public int Progress {
        get => _val;
        set { _val = Math.Max(0,Math.Min(100,value)); Invalidate(); }
    }
    public Color TrackColor { get; set; }
    public Color FillStart  { get; set; }
    public Color FillEnd    { get; set; }
    public CapsuleProgress() {
        SetStyle(ControlStyles.AllPaintingInWmPaint|ControlStyles.UserPaint|ControlStyles.DoubleBuffer, true);
    }
    private GraphicsPath Capsule(RectangleF r) {
        float rad = r.Height / 2f;
        var gp = new GraphicsPath();
        gp.AddArc(r.Left, r.Top, r.Height, r.Height, 90, 180);
        gp.AddArc(r.Right - r.Height, r.Top, r.Height, r.Height, 270, 180);
        gp.CloseFigure();
        return gp;
    }
    protected override void OnPaint(PaintEventArgs e) {
        var g = e.Graphics;
        g.SmoothingMode = SmoothingMode.AntiAlias;
        var tr = new RectangleF(0, 0, Width, Height);
        using (var b = new SolidBrush(TrackColor))
        using (var p = Capsule(tr)) g.FillPath(b, p);
        if (_val > 0) {
            float fw = Math.Max(Height, (Width - Height) * _val / 100f + Height);
            var fr = new RectangleF(0, 0, fw, Height);
            using (var gb = new LinearGradientBrush(new Rectangle(0,0,(int)fw==0?1:(int)fw,Height), FillStart, FillEnd, LinearGradientMode.Horizontal))
            using (var p = Capsule(fr)) g.FillPath(gb, p);
        }
    }
}
"@ -ReferencedAssemblies "System.Windows.Forms","System.Drawing"

# ═══════════════════════════════════════════════════════════════════
#  إعدادات ثابتة
# ═══════════════════════════════════════════════════════════════════
$REPO_OWNER    = "LOSTSTR"
$REPO_NAME     = "Esharq"
$INSTALLER_VER = "1.14.13.1"
$ASAR_NAME     = "desktop.asar"
$RELEASE_API   = "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/releases/latest"
$USER_AGENT    = "Esharq-Installer/$INSTALLER_VER (+https://github.com/$REPO_OWNER/$REPO_NAME)"
$SUPPORT_URL   = "https://discord.gg/QamdqDNEDa"

$DataDir    = if ($env:EQUICORD_USER_DATA_DIR) { $env:EQUICORD_USER_DATA_DIR } else { Join-Path $env:APPDATA "Esharq" }
$AsarTarget = Join-Path $DataDir "equicord.asar"

# ── CrimsonNight Palette ────────────────────────────────────────────
$BG_DARK      = [System.Drawing.Color]::FromArgb( 11,  11,  16)
$BG_PANEL     = [System.Drawing.Color]::FromArgb( 22,  22,  32)
$BG_HEADER    = [System.Drawing.Color]::FromArgb( 15,   5,  10)
$ACCENT       = [System.Drawing.Color]::FromArgb(224,  34,  68)
$ACCENT2      = [System.Drawing.Color]::FromArgb(192,  38, 211)
$ACCENT3      = [System.Drawing.Color]::FromArgb(235,  69, 158)
$FG_WHITE     = [System.Drawing.Color]::FromArgb(220, 200, 205)
$FG_MUTED     = [System.Drawing.Color]::FromArgb(120,  90,  98)
$FG_DIM       = [System.Drawing.Color]::FromArgb( 60,  35,  42)
$WARN_BG      = [System.Drawing.Color]::FromArgb( 28,   8,  12)
$WARN_FG      = [System.Drawing.Color]::FromArgb(220, 100, 120)
$WARN_BORDER  = [System.Drawing.Color]::FromArgb(100,  20,  35)
$BTN_INSTALL  = [System.Drawing.Color]::FromArgb(224,  34,  68)
$BTN_REPAIR   = [System.Drawing.Color]::FromArgb( 30,  30,  46)
$BTN_REMOVE   = [System.Drawing.Color]::FromArgb( 30,  30,  46)
$BTN_OPENSAR  = [System.Drawing.Color]::FromArgb( 30,  30,  46)
$BTN_DISCORD  = [System.Drawing.Color]::FromArgb( 88, 101, 242)
$SUCCESS_CLR  = [System.Drawing.Color]::FromArgb( 87, 242, 135)
$ERROR_CLR    = [System.Drawing.Color]::FromArgb(237,  66,  69)

# ═══════════════════════════════════════════════════════════════════
#  اكتشاف نسخ Discord
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
        $base  = Join-Path $env:LOCALAPPDATA $v.Dir
        if (-not (Test-Path $base)) { continue }
        $appDir = Get-ChildItem $base -Directory -Filter "app-*" -EA SilentlyContinue |
                  Sort-Object Name -Descending | Select-Object -First 1
        if (-not $appDir) { continue }
        $res = Join-Path $appDir.FullName "resources"
        if (-not (Test-Path $res)) { continue }
        $patched = Test-Path (Join-Path $res $ASAR_NAME)
        $found.Add(@{
            Label     = "$($v.Name) — $base$(if ($patched) { '  ✔ مُثبَّت' })"
            Name      = $v.Name
            Resources = $res
            Patched   = $patched
        })
    }
    return $found
}

function Get-LatestTag {
    try { return (Invoke-RestMethod $RELEASE_API -Headers @{"User-Agent"=$USER_AGENT} -EA Stop).tag_name }
    catch { return "غير متاح" }
}

function Get-LocalVersion([string]$ResourcesPath) {
    $p = Join-Path $ResourcesPath $ASAR_NAME
    if (-not (Test-Path $p)) { return "لا يوجد" }
    try { return (Get-Item $p).LastWriteTime.ToString("yyyy-MM-dd") } catch { return "مثبَّت" }
}

# ═══════════════════════════════════════════════════════════════════
#  تنزيل مع شريط تقدم
# ═══════════════════════════════════════════════════════════════════
function Invoke-Download {
    param([string]$Url, [string]$Dest, [scriptblock]$OnProgress)
    $req  = [System.Net.HttpWebRequest]::Create($Url)
    $req.UserAgent       = $USER_AGENT
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
#  عمليات التثبيت
# ═══════════════════════════════════════════════════════════════════
function Install-Mod {
    param([string]$ResourcesPath, [scriptblock]$Status, [scriptblock]$Progress)
    & $Status "جارٍ جلب معلومات آخر إصدار..."
    & $Progress 5
    $release = Invoke-RestMethod $RELEASE_API -Headers @{"User-Agent"=$USER_AGENT} -EA Stop
    $asset   = $release.assets | Where-Object { $_.name -eq $ASAR_NAME } | Select-Object -First 1
    if (-not $asset) { throw "لم يُعثر على ملف $ASAR_NAME في الإصدار $($release.tag_name)" }
    $mb = [math]::Round($asset.size / 1MB, 1)
    & $Status "تحميل $ASAR_NAME — $($release.tag_name) ($mb MB)"
    & $Progress 10
    New-Item -ItemType Directory -Path $DataDir -Force | Out-Null
    $tmp = Join-Path $env:TEMP ("esharq_" + [guid]::NewGuid().ToString("N") + ".asar")
    Invoke-Download -Url $asset.browser_download_url -Dest $tmp -OnProgress {
        param($p,$dl,$tot)
        $mn=[math]::Round($dl/1MB,1); $mt=[math]::Round($tot/1MB,1)
        & $Status "تحميل: $mn/$mt MB  ($p%)"
        & $Progress ([int](10 + $p * 0.6))
    }
    & $Status "نسخ الملف إلى مجلد الموارد..."
    & $Progress 75
    Stop-DiscordFromResources $ResourcesPath
    Copy-Item $tmp (Join-Path $ResourcesPath $ASAR_NAME) -Force
    Copy-Item $tmp $AsarTarget -Force
    Remove-Item $tmp -EA SilentlyContinue
    & $Progress 100
    & $Status "✔ تم التثبيت — أعد تشغيل Discord لتفعيل Esharq"
}

function Uninstall-Mod {
    param([string]$ResourcesPath, [scriptblock]$Status, [scriptblock]$Progress)
    & $Status "جارٍ الإزالة..."
    & $Progress 50
    $f = Join-Path $ResourcesPath $ASAR_NAME
    if (Test-Path $f) { Remove-Item $f -Force }
    if (Test-Path $AsarTarget) { Remove-Item $AsarTarget -Force }
    & $Progress 100
    & $Status "✔ تمت الإزالة — أعد تشغيل Discord"
}

function Install-OpenAsar {
    param([string]$ResourcesPath, [scriptblock]$Status, [scriptblock]$Progress)
    & $Status "جارٍ إغلاق Discord..."
    & $Progress 5
    Stop-DiscordFromResources $ResourcesPath
    & $Status "جارٍ تنزيل OpenAsar..."
    & $Progress 10
    $tmp = Join-Path $env:TEMP ("openasar_" + [guid]::NewGuid().ToString("N") + ".asar")
    Invoke-Download "https://github.com/GooseMod/OpenAsar/releases/download/nightly/app.asar" $tmp {
        param($p) & $Progress ([int](10 + $p * 0.85))
    }
    & $Status "نسخ OpenAsar..."
    & $Progress 97
    Copy-Item $tmp (Join-Path $ResourcesPath "app.asar") -Force
    Remove-Item $tmp -EA SilentlyContinue
    & $Progress 100
    & $Status "✔ تم تثبيت OpenAsar — أعد تشغيل Discord"
}

function Stop-DiscordFromResources([string]$ResourcesPath) {
    $discordDir = Split-Path (Split-Path $ResourcesPath -Parent) -Parent
    $procName   = Split-Path $discordDir -Leaf
    Get-Process -Name $procName -EA SilentlyContinue | Stop-Process -Force -EA SilentlyContinue
    Start-Sleep -Milliseconds 1200
}

function Confirm-DiscordStopped([string]$ResourcesPath) {
    $discordDir = Split-Path (Split-Path $ResourcesPath -Parent) -Parent
    $procName   = Split-Path $discordDir -Leaf
    if (Get-Process -Name $procName -EA SilentlyContinue) {
        $ans = [System.Windows.Forms.MessageBox]::Show(
            "Discord يعمل حالياً وسيتم إغلاقه تلقائياً لإتمام العملية.`nهل تريد المتابعة؟",
            "تنبيه — Discord قيد التشغيل",
            [System.Windows.Forms.MessageBoxButtons]::YesNo,
            [System.Windows.Forms.MessageBoxIcon]::Warning)
        if ($ans -ne [System.Windows.Forms.DialogResult]::Yes) { return $false }
        Stop-DiscordFromResources $ResourcesPath
    }
    return $true
}

# ═══════════════════════════════════════════════════════════════════
#  بناء الواجهة — CrimsonNight
# ═══════════════════════════════════════════════════════════════════
function Show-Installer {

    # ── النموذج الرئيسي ──────────────────────────────────────────────
    $form = New-Object System.Windows.Forms.Form
    $form.Text            = "Esharq"
    $form.Size            = New-Object System.Drawing.Size(1200, 700)
    $form.MinimumSize     = $form.Size
    $form.MaximumSize     = $form.Size
    $form.StartPosition   = [System.Windows.Forms.FormStartPosition]::CenterScreen
    $form.BackColor       = $BG_DARK
    $form.FormBorderStyle = [System.Windows.Forms.FormBorderStyle]::FixedSingle
    $form.MaximizeBox     = $false
    $form.Font            = New-Object System.Drawing.Font("Segoe UI", 11)

    $icoPath = Join-Path $PSScriptRoot "icon.ico"
    if (Test-Path $icoPath) { try { $form.Icon = New-Object System.Drawing.Icon($icoPath) } catch {} }

    # ── شريط التمييز العلوي (4px متدرج) ────────────────────────────
    $accentBar = New-Object System.Windows.Forms.Panel
    $accentBar.Location = New-Object System.Drawing.Point(0, 0)
    $accentBar.Size     = New-Object System.Drawing.Size(1200, 4)
    $accentBar.Add_Paint({
        param($s, $e)
        $r = $s.ClientRectangle
        $grad = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
            $r, $ACCENT, $ACCENT3,
            [System.Drawing.Drawing2D.LinearGradientMode]::Horizontal)
        $e.Graphics.FillRectangle($grad, $r)
        $grad.Dispose()
    })
    $form.Controls.Add($accentBar)

    # ── هيدر ─────────────────────────────────────────────────────────
    $header = New-Object System.Windows.Forms.Panel
    $header.Location  = New-Object System.Drawing.Point(0, 4)
    $header.Size      = New-Object System.Drawing.Size(1200, 86)
    $header.BackColor = $BG_HEADER
    $header.Add_Paint({
        param($s,$e)
        $g = $e.Graphics
        # Crimson glow orb top-right
        $glowBrush = New-Object System.Drawing.Drawing2D.PathGradientBrush(
            [System.Drawing.PointF[]](
                [System.Drawing.PointF]::new(1140, 0),
                [System.Drawing.PointF]::new(1200, 0),
                [System.Drawing.PointF]::new(1200, 86),
                [System.Drawing.PointF]::new(1140, 86)
            )
        )
        $glowBrush.CenterPoint    = [System.Drawing.PointF]::new(1200, 0)
        $glowBrush.CenterColor    = [System.Drawing.Color]::FromArgb(40, 224, 34, 68)
        $glowBrush.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 224, 34, 68))
        $g.FillRectangle($glowBrush, 1060, 0, 140, 86)
        $glowBrush.Dispose()
        # Bottom border line
        $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(60, 224, 34, 68), 1)
        $g.DrawLine($pen, 0, 85, 1200, 85)
        $pen.Dispose()
    })
    $form.Controls.Add($header)

    # العنوان بالتدرج
    $titleLbl = New-Object GradientLabel
    $titleLbl.Text           = "Esharq"
    $titleLbl.GradientStart  = $ACCENT
    $titleLbl.GradientEnd    = $ACCENT2
    $titleLbl.Location       = New-Object System.Drawing.Point(0, 0)
    $titleLbl.Size           = New-Object System.Drawing.Size(400, 86)
    $titleLbl.Font           = New-Object System.Drawing.Font("Segoe UI", 30, [System.Drawing.FontStyle]::Bold)
    $titleLbl.BackColor      = [System.Drawing.Color]::Transparent
    $header.Controls.Add($titleLbl)

    # معلومات الإصدار (يمين)
    function HdrLbl([string]$T, [int]$Y, [System.Drawing.Color]$C) {
        $l = New-Object System.Windows.Forms.Label
        $l.Text      = $T
        $l.Location  = New-Object System.Drawing.Point(560, $Y)
        $l.Size      = New-Object System.Drawing.Size(620, 22)
        $l.ForeColor = $C
        $l.BackColor = [System.Drawing.Color]::Transparent
        $l.Font      = New-Object System.Drawing.Font("Segoe UI", 10)
        $l.TextAlign = [System.Drawing.ContentAlignment]::MiddleRight
        $header.Controls.Add($l)
    }
    $lblLocalVerH  = HdrLbl "الإصدار المحلي: جارٍ الفحص..."    14 $FG_MUTED
    $lblLatestVerH = HdrLbl "آخر إصدار: جارٍ الجلب..."         36 $FG_MUTED
    $lblInstallerH = HdrLbl "إصدار المثبت: v$INSTALLER_VER"    58 $FG_DIM

    # ── منطقة المحتوى الرئيسية ──────────────────────────────────────
    $PAD  = 48
    $BODY = 92  # Y بداية المحتوى

    # دالة label مبسطة
    function Lbl([string]$T, [int]$X, [int]$Y, [System.Drawing.Color]$C, [float]$FS=11, [System.Drawing.FontStyle]$ST=[System.Drawing.FontStyle]::Regular, [int]$W=0, [int]$H=26) {
        $l = New-Object System.Windows.Forms.Label
        $l.Text      = $T
        $l.Location  = New-Object System.Drawing.Point($X, $Y)
        $l.ForeColor = $C
        $l.BackColor = [System.Drawing.Color]::Transparent
        $l.Font      = New-Object System.Drawing.Font("Segoe UI", $FS, $ST)
        if ($W -gt 0) { $l.Size = New-Object System.Drawing.Size($W, $H); $l.AutoSize=$false } else { $l.AutoSize=$true }
        $form.Controls.Add($l)
        return $l
    }

    # ── سطر المسار + زر فتح المجلد ──────────────────────────────────
    $infoY = $BODY + 6

    $pathLbl = Lbl "📁  سيتم تنزيل Esharq إلى: $AsarTarget" $PAD $infoY $FG_MUTED 10

    $btnOpenDir = New-Object GlowButton
    $btnOpenDir.Text       = "فتح المجلد"
    $btnOpenDir.Location   = New-Object System.Drawing.Point(($pathLbl.Right + 12), ($infoY - 2))
    $btnOpenDir.Size       = New-Object System.Drawing.Size(110, 28)
    $btnOpenDir.BackColor  = [System.Drawing.Color]::FromArgb(40, 15, 22)
    $btnOpenDir.HoverColor = [System.Drawing.Color]::FromArgb(60, 20, 30)
    $btnOpenDir.GlowColor  = $ACCENT
    $btnOpenDir.FormColor  = $BG_DARK
    $btnOpenDir.ForeColor  = $ACCENT
    $btnOpenDir.Font       = New-Object System.Drawing.Font("Segoe UI", 9)
    $btnOpenDir.CornerRadius = 6
    $btnOpenDir.Cursor     = [System.Windows.Forms.Cursors]::Hand
    $btnOpenDir.Add_Click({
        New-Item -ItemType Directory -Path $DataDir -Force | Out-Null
        Start-Process explorer.exe $DataDir
    })
    $form.Controls.Add($btnOpenDir)

    Lbl "لتخصيص المسار: قم بتعيين متغير البيئة 'EQUICORD_USER_DATA_DIR' ثم أعد تشغيل المثبت" $PAD ($infoY + 30) $FG_DIM 10 | Out-Null

    # ── زر Discord ──────────────────────────────────────────────────
    $btnDiscord = New-Object GlowButton
    $btnDiscord.Text         = "🎮  انضم إلى سيرفر الدعم العربي على Discord"
    $btnDiscord.Location     = New-Object System.Drawing.Point($PAD, ($infoY + 58))
    $btnDiscord.Size         = New-Object System.Drawing.Size(500, 38)
    $btnDiscord.BackColor    = $BTN_DISCORD
    $btnDiscord.HoverColor   = [System.Drawing.Color]::FromArgb(110, 125, 255)
    $btnDiscord.GlowColor    = $BTN_DISCORD
    $btnDiscord.FormColor    = $BG_DARK
    $btnDiscord.ForeColor    = [System.Drawing.Color]::White
    $btnDiscord.Font         = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
    $btnDiscord.CornerRadius = 10
    $btnDiscord.Cursor       = [System.Windows.Forms.Cursors]::Hand
    $btnDiscord.Add_Click({ Start-Process $SUPPORT_URL })
    $form.Controls.Add($btnDiscord)

    # ── صندوق التحذير (CrimsonNight — أحمر داكن) ────────────────────
    $warnY = $BODY + 108

    $warnPanel = New-Object System.Windows.Forms.Panel
    $warnPanel.Location  = New-Object System.Drawing.Point($PAD, $warnY)
    $warnPanel.Size      = New-Object System.Drawing.Size(1104, 78)
    $warnPanel.BackColor = $WARN_BG
    $warnPanel.Add_Paint({
        param($s, $e)
        # إطار قرمزي
        $pen = New-Object System.Drawing.Pen($WARN_BORDER, 1)
        $e.Graphics.DrawRectangle($pen, 0, 0, ($s.Width-1), ($s.Height-1))
        $pen.Dispose()
        # شريط جانبي أحمر (RTL = يمين)
        $e.Graphics.FillRectangle([System.Drawing.Brushes]::Firebrick, ($s.Width - 4), 0, 4, $s.Height)
    })
    $form.Controls.Add($warnPanel)

    $warnText = New-Object System.Windows.Forms.Label
    $warnText.Text      = "⚠  هام جداً  —  GitHub ومستودع LOSTSTR/Esharq هما المصدران الرسميان الوحيدان للحصول على Esharq.`r`nأي مصدر آخر يُعتبر ضاراً — احذف كل شيء وأجرِ فحصاً للبرامج الضارة وغيّر كلمة مرور Discord."
    $warnText.Location  = New-Object System.Drawing.Point(14, 10)
    $warnText.Size      = New-Object System.Drawing.Size(1076, 58)
    $warnText.ForeColor = $WARN_FG
    $warnText.BackColor = [System.Drawing.Color]::Transparent
    $warnText.Font      = New-Object System.Drawing.Font("Segoe UI", 11)
    $warnPanel.Controls.Add($warnText)

    # ── اختيار نسخة Discord ─────────────────────────────────────────
    $selectY = $warnY + 88

    Lbl "الرجاء اختيار نسخة Discord للتعديل عليها" $PAD $selectY $FG_WHITE 13 Bold | Out-Null

    $radios   = [System.Collections.Generic.List[System.Windows.Forms.RadioButton]]::new()
    $installs = @(Get-DiscordInstalls)
    $radioY   = $selectY + 36

    foreach ($inst in $installs) {
        $rb = New-Object System.Windows.Forms.RadioButton
        $rb.Text      = $inst.Label
        $rb.Tag       = $inst
        $rb.Location  = New-Object System.Drawing.Point(56, $radioY)
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
        Lbl "⚠  لم يُعثر على أي نسخة من Discord مثبتة" 56 $radioY $FG_MUTED 10 | Out-Null
        $radioY += 28
    }

    # مسار مخصص
    $rbCustom = New-Object System.Windows.Forms.RadioButton
    $rbCustom.Text      = "مسار تثبيت مخصص"
    $rbCustom.Location  = New-Object System.Drawing.Point(56, ($radioY + 8))
    $rbCustom.AutoSize  = $true
    $rbCustom.ForeColor = $FG_WHITE
    $rbCustom.BackColor = [System.Drawing.Color]::Transparent
    $rbCustom.Font      = New-Object System.Drawing.Font("Segoe UI", 11)
    $rbCustom.Cursor    = [System.Windows.Forms.Cursors]::Hand
    $form.Controls.Add($rbCustom)

    $txtCustom = New-Object System.Windows.Forms.TextBox
    $txtCustom.Location    = New-Object System.Drawing.Point($PAD, ($radioY + 44))
    $txtCustom.Size        = New-Object System.Drawing.Size(1104, 36)
    $txtCustom.BackColor   = $BG_PANEL
    $txtCustom.ForeColor   = $FG_DIM
    $txtCustom.BorderStyle = [System.Windows.Forms.BorderStyle]::FixedSingle
    $txtCustom.Font        = New-Object System.Drawing.Font("Segoe UI", 11)
    $txtCustom.Text        = "المسار المخصص (مجلد resources الخاص بـ Discord)"
    $txtCustom.Enabled     = $false
    $form.Controls.Add($txtCustom)

    $rbCustom.Add_CheckedChanged({
        $txtCustom.Enabled   = $rbCustom.Checked
        $txtCustom.ForeColor = if ($rbCustom.Checked) { $FG_WHITE } else { $FG_DIM }
    })

    # ── شريط الحالة والتقدم ─────────────────────────────────────────
    $statusY = 572

    $lblStatus = New-Object System.Windows.Forms.Label
    $lblStatus.Text      = "اختر نسخة Discord ثم اضغط على أحد الأزرار"
    $lblStatus.Location  = New-Object System.Drawing.Point($PAD, $statusY)
    $lblStatus.Size      = New-Object System.Drawing.Size(1104, 26)
    $lblStatus.ForeColor = $FG_MUTED
    $lblStatus.BackColor = [System.Drawing.Color]::Transparent
    $lblStatus.Font      = New-Object System.Drawing.Font("Segoe UI", 10)
    $form.Controls.Add($lblStatus)

    $progBar = New-Object CapsuleProgress
    $progBar.Location   = New-Object System.Drawing.Point($PAD, ($statusY + 30))
    $progBar.Size       = New-Object System.Drawing.Size(1104, 6)
    $progBar.TrackColor = [System.Drawing.Color]::FromArgb(30, 10, 15)
    $progBar.FillStart  = $ACCENT
    $progBar.FillEnd    = $ACCENT2
    $form.Controls.Add($progBar)

    # ── خط فاصل ─────────────────────────────────────────────────────
    $sep = New-Object System.Windows.Forms.Panel
    $sep.Location  = New-Object System.Drawing.Point($PAD, ($statusY + 42))
    $sep.Size      = New-Object System.Drawing.Size(1104, 1)
    $sep.BackColor = [System.Drawing.Color]::FromArgb(40, 15, 22)
    $form.Controls.Add($sep)

    # ── الأزرار الأربعة ─────────────────────────────────────────────
    $btnY   = 614
    $btnW   = 264
    $btnH   = 50
    $gap    = 8

    function New-GBtn([string]$T, [System.Drawing.Color]$Bg, [System.Drawing.Color]$Glow, [System.Drawing.Color]$Fg, [int]$X) {
        $b = New-Object GlowButton
        $b.Text         = $T
        $b.Location     = New-Object System.Drawing.Point($X, $btnY)
        $b.Size         = New-Object System.Drawing.Size($btnW, $btnH)
        $b.BackColor    = $Bg
        $b.HoverColor   = [System.Drawing.Color]::FromArgb([Math]::Min(255,$Bg.R+20), [Math]::Min(255,$Bg.G+20), [Math]::Min(255,$Bg.B+20))
        $b.GlowColor    = $Glow
        $b.FormColor    = $BG_DARK
        $b.ForeColor    = $Fg
        $b.Font         = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
        $b.CornerRadius = 10
        $b.Cursor       = [System.Windows.Forms.Cursors]::Hand
        $form.Controls.Add($b)
        return $b
    }

    $crimsonFg = [System.Drawing.Color]::White
    $darkFg    = [System.Drawing.Color]::FromArgb(150, 120, 130)

    $btnInstall  = New-GBtn "تثبيت"                    $BTN_INSTALL  $ACCENT   $crimsonFg ($PAD)
    $btnRepair   = New-GBtn "إعادة التثبيت / الإصلاح"  $BTN_REPAIR   $ACCENT   $darkFg    ($PAD + $btnW + $gap)
    $btnRemove   = New-GBtn "إزالة التثبيت"             $BTN_REMOVE   $ERROR_CLR $darkFg   ($PAD + ($btnW+$gap)*2)
    $btnOpenSar  = New-GBtn "تثبيت OpenAsar"            $BTN_OPENSAR  $ACCENT   $darkFg    ($PAD + ($btnW+$gap)*3)

    # ── فوتر ─────────────────────────────────────────────────────────
    $footer = New-Object System.Windows.Forms.Panel
    $footer.Location  = New-Object System.Drawing.Point(0, 668)
    $footer.Size      = New-Object System.Drawing.Size(1200, 32)
    $footer.BackColor = [System.Drawing.Color]::FromArgb(8, 5, 8)
    $footer.Add_Paint({
        param($s,$e)
        $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(40,15,22), 1)
        $e.Graphics.DrawLine($pen, 0, 0, $s.Width, 0)
        $pen.Dispose()
    })
    $form.Controls.Add($footer)

    $footerLeft = New-Object System.Windows.Forms.Label
    $footerLeft.Text      = "LOSTSTR • krym511 • 𝚁𝙰𝚈𝙼𝙾𝙽𝙳♞ • Abo Ahmed • S99 • iosiph • .fmo   —   Esharq 2026 • GPL-3.0"
    $footerLeft.Location  = New-Object System.Drawing.Point(12, 0)
    $footerLeft.Size      = New-Object System.Drawing.Size(800, 32)
    $footerLeft.ForeColor = [System.Drawing.Color]::FromArgb(55, 30, 38)
    $footerLeft.BackColor = [System.Drawing.Color]::Transparent
    $footerLeft.Font      = New-Object System.Drawing.Font("Segoe UI", 9)
    $footerLeft.TextAlign = [System.Drawing.ContentAlignment]::MiddleLeft
    $footer.Controls.Add($footerLeft)

    $footerRight = New-Object System.Windows.Forms.LinkLabel
    $footerRight.Text      = "LOSTSTR/Esharq"
    $footerRight.Location  = New-Object System.Drawing.Point(900, 0)
    $footerRight.Size      = New-Object System.Drawing.Size(280, 32)
    $footerRight.ForeColor = [System.Drawing.Color]::FromArgb(100, 30, 50)
    $footerRight.BackColor = [System.Drawing.Color]::Transparent
    $footerRight.Font      = New-Object System.Drawing.Font("Segoe UI", 9)
    $footerRight.TextAlign = [System.Drawing.ContentAlignment]::MiddleRight
    $footerRight.LinkColor = [System.Drawing.Color]::FromArgb(120, 40, 60)
    $footerRight.ActiveLinkColor = $ACCENT
    $footerRight.LinkBehavior = [System.Windows.Forms.LinkBehavior]::HoverUnderline
    $footerRight.Add_LinkClicked({ Start-Process "https://github.com/$REPO_OWNER/$REPO_NAME" })
    $footer.Controls.Add($footerRight)

    # ═══ دوال مساعدة ════════════════════════════════════════════════
    function Get-Target {
        if ($rbCustom.Checked) {
            $p = $txtCustom.Text.Trim()
            if (-not $p -or -not (Test-Path $p)) { throw "المسار المخصص غير صحيح أو غير موجود" }
            return $p
        }
        foreach ($rb in $radios) { if ($rb.Checked) { return $rb.Tag.Resources } }
        throw "لم تختر أي نسخة من Discord"
    }

    function Set-Status([string]$Msg, [System.Drawing.Color]$Col) {
        if (-not $Col) { $Col = $FG_WHITE }
        $lblStatus.ForeColor = $Col
        $lblStatus.Text = $Msg
        $form.Refresh()
        [System.Windows.Forms.Application]::DoEvents()
    }

    function Set-Progress([int]$Val) {
        $progBar.Progress = $Val
        [System.Windows.Forms.Application]::DoEvents()
    }

    function Set-Busy([bool]$On) {
        $btnInstall.Enabled = -not $On
        $btnRepair.Enabled  = -not $On
        $btnRemove.Enabled  = -not $On
        $btnOpenSar.Enabled = -not $On
        $form.UseWaitCursor = $On
    }

    function Refresh-UI {
        $installs = @(Get-DiscordInstalls)
        $i = 0
        foreach ($rb in $radios) {
            if ($i -lt $installs.Count) { $rb.Text = $installs[$i].Label; $rb.Tag = $installs[$i] }
            $i++
        }
    }

    # ── تحميل معلومات الإصدار ─────────────────────────────────────
    $form.Add_Shown({
        $sel = $null
        foreach ($rb in $radios) { if ($rb.Checked) { $sel = $rb.Tag; break } }
        $localTxt = if ($sel) { Get-LocalVersion $sel.Resources } else { "لا يوجد" }
        if ($lblLocalVerH) { $lblLocalVerH.Text = "الإصدار المحلي: $localTxt" }
        if ($lblLatestVerH) { $lblLatestVerH.Text = "آخر إصدار: جارٍ الجلب..." }
        [System.Windows.Forms.Application]::DoEvents()
        $latest = Get-LatestTag
        if ($lblLatestVerH) { $lblLatestVerH.Text = "آخر إصدار: $latest" }
    })

    # ═══ أحداث الأزرار ══════════════════════════════════════════════
    $btnInstall.Add_Click({
        try {
            $target = Get-Target
            if (-not (Confirm-DiscordStopped $target)) { return }
            Set-Busy $true; Set-Progress 0
            Set-Status "جارٍ التثبيت..." $FG_WHITE
            Install-Mod $target { param($m) Set-Status $m $FG_WHITE } { param($p) Set-Progress $p }
            Set-Status "✔ تم التثبيت — شغّل Discord مرة أخرى" $SUCCESS_CLR
            Refresh-UI
        } catch {
            Set-Status "✖ خطأ: $_" $ERROR_CLR
            Set-Progress 0
        } finally { Set-Busy $false }
    })

    $btnRepair.Add_Click({
        try {
            $target = Get-Target
            if (-not (Confirm-DiscordStopped $target)) { return }
            Set-Busy $true; Set-Progress 0
            Set-Status "جارٍ إعادة التثبيت..." $FG_WHITE
            Install-Mod $target { param($m) Set-Status $m $FG_WHITE } { param($p) Set-Progress $p }
            Set-Status "✔ تمت إعادة التثبيت — شغّل Discord مرة أخرى" $SUCCESS_CLR
            Refresh-UI
        } catch {
            Set-Status "✖ خطأ: $_" $ERROR_CLR
            Set-Progress 0
        } finally { Set-Busy $false }
    })

    $btnRemove.Add_Click({
        try {
            $target = Get-Target
            $ans = [System.Windows.Forms.MessageBox]::Show(
                "هل تريد إزالة Esharq بالكامل؟",
                "تأكيد الإزالة",
                [System.Windows.Forms.MessageBoxButtons]::YesNo,
                [System.Windows.Forms.MessageBoxIcon]::Question)
            if ($ans -ne [System.Windows.Forms.DialogResult]::Yes) { return }
            if (-not (Confirm-DiscordStopped $target)) { return }
            Set-Busy $true; Set-Progress 0
            Set-Status "جارٍ الإزالة..." $FG_WHITE
            Uninstall-Mod $target { param($m) Set-Status $m $FG_WHITE } { param($p) Set-Progress $p }
            Set-Status "✔ تمت الإزالة — شغّل Discord مرة أخرى" $SUCCESS_CLR
            Refresh-UI
        } catch {
            Set-Status "✖ خطأ: $_" $ERROR_CLR
            Set-Progress 0
        } finally { Set-Busy $false }
    })

    $btnOpenSar.Add_Click({
        try {
            $target = Get-Target
            if (-not (Confirm-DiscordStopped $target)) { return }
            Set-Busy $true; Set-Progress 0
            Set-Status "جارٍ تثبيت OpenAsar..." $FG_WHITE
            Install-OpenAsar $target { param($m) Set-Status $m $FG_WHITE } { param($p) Set-Progress $p }
            Set-Status "✔ تم تثبيت OpenAsar — شغّل Discord مرة أخرى" $SUCCESS_CLR
        } catch {
            Set-Status "✖ خطأ: $_" $ERROR_CLR
            Set-Progress 0
        } finally { Set-Busy $false }
    })

    [void]$form.ShowDialog()
}

Show-Installer
