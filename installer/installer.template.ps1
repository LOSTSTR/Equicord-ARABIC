#Requires -Version 5.1
<#
.SYNOPSIS  Equicord-ARABIC Installer
.DESCRIPTION
    Repository: https://github.com/LOSTSTR/Equicord-ARABIC
    Copyright (c) 2026 LOSTSTR — GPL-3.0
#>

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
[System.Windows.Forms.Application]::EnableVisualStyles()
[System.Windows.Forms.Application]::SetCompatibleTextRenderingDefault($false)

Add-Type -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Text;
using System.Windows.Forms;

public class GlowButton : Button {
    private bool _h = false, _dn = false;
    public Color HoverColor   { get; set; }
    public Color GlowColor    { get; set; }
    public Color FormColor    { get; set; }
    public int   CornerRadius { get; set; }
    public GlowButton() {
        CornerRadius = 12;
        HoverColor   = Color.Empty;
        GlowColor    = Color.FromArgb(140, 88, 101, 242);
        FormColor    = Color.FromArgb(8, 9, 18);
        SetStyle(ControlStyles.UserPaint | ControlStyles.AllPaintingInWmPaint |
                 ControlStyles.OptimizedDoubleBuffer | ControlStyles.ResizeRedraw, true);
        FlatStyle = FlatStyle.Flat; FlatAppearance.BorderSize = 0; Cursor = Cursors.Hand;
    }
    protected override void OnMouseEnter(EventArgs e) { _h = true;  Invalidate(); base.OnMouseEnter(e); }
    protected override void OnMouseLeave(EventArgs e) { _h = false; _dn = false; Invalidate(); base.OnMouseLeave(e); }
    protected override void OnMouseDown(MouseEventArgs e) { _dn = true;  Invalidate(); base.OnMouseDown(e); }
    protected override void OnMouseUp  (MouseEventArgs e) { _dn = false; Invalidate(); base.OnMouseUp(e);   }
    private GraphicsPath RndPath(Rectangle r) {
        int d = Math.Min(CornerRadius * 2, Math.Min(r.Width, r.Height));
        var gp = new GraphicsPath();
        gp.AddArc(r.Left,       r.Top,        d, d, 180, 90);
        gp.AddArc(r.Right - d,  r.Top,        d, d, 270, 90);
        gp.AddArc(r.Right - d,  r.Bottom - d, d, d,   0, 90);
        gp.AddArc(r.Left,       r.Bottom - d, d, d,  90, 90);
        gp.CloseFigure(); return gp;
    }
    protected override void OnPaint(PaintEventArgs pe) {
        var g = pe.Graphics;
        g.SmoothingMode = SmoothingMode.AntiAlias;
        g.Clear(FormColor);
        var rect = new Rectangle(4, 4, Width - 9, Height - 9);
        if (rect.Width < 2 || rect.Height < 2) return;
        Color bg;
        if (_dn)
            bg = Color.FromArgb(Math.Max(0, BackColor.R - 30),
                                Math.Max(0, BackColor.G - 30),
                                Math.Max(0, BackColor.B - 30));
        else if (_h && HoverColor != Color.Empty)
            bg = HoverColor;
        else
            bg = BackColor;
        using (var path = RndPath(rect)) {
            if (_h || _dn) {
                int[]   ga = { 8, 22, 42 };
                float[] gw = { 8f, 5f, 2f };
                for (int i = 0; i < 3; i++)
                    using (var gpen = new Pen(Color.FromArgb(ga[i], GlowColor.R, GlowColor.G, GlowColor.B), gw[i]))
                        g.DrawPath(gpen, path);
            }
            using (var br = new SolidBrush(bg)) g.FillPath(br, path);
            if (_h && !_dn)
                using (var shim = new SolidBrush(Color.FromArgb(22, 255, 255, 255)))
                using (var sp = RndPath(new Rectangle(rect.X, rect.Y, rect.Width, rect.Height / 2)))
                    g.FillPath(shim, sp);
            using (var bpen = new Pen(Color.FromArgb(_h ? 190 : 65, GlowColor.R, GlowColor.G, GlowColor.B), 1.5f))
                g.DrawPath(bpen, path);
        }
        TextRenderer.DrawText(g, Text, Font,
            new Rectangle(4, 4, Width - 8, Height - 8), ForeColor,
            TextFormatFlags.HorizontalCenter | TextFormatFlags.VerticalCenter | TextFormatFlags.WordBreak);
    }
}

public class GradientLabel : Control {
    public Color GradientStart { get; set; }
    public Color GradientEnd   { get; set; }
    public GradientLabel() {
        SetStyle(ControlStyles.UserPaint | ControlStyles.AllPaintingInWmPaint |
                 ControlStyles.OptimizedDoubleBuffer, true);
        BackColor     = Color.FromArgb(8, 9, 18);
        GradientStart = Color.FromArgb(180, 140, 255);
        GradientEnd   = Color.FromArgb(80, 180, 255);
    }
    protected override void OnPaint(PaintEventArgs e) {
        var g = e.Graphics;
        g.Clear(BackColor);
        if (string.IsNullOrEmpty(Text)) return;
        g.SmoothingMode     = SmoothingMode.AntiAlias;
        g.TextRenderingHint = TextRenderingHint.AntiAliasGridFit;
        using (var font = new Font("Segoe UI", 30, FontStyle.Bold, GraphicsUnit.Point)) {
            var sz = g.MeasureString(Text, font);
            float x = (Width  - sz.Width)  / 2f; if (x < 0) x = 0;
            float y = (Height - sz.Height) / 2f; if (y < 0) y = 0;
            int[] alphas = { 8, 18, 30, 44, 58 };
            for (int r = 5; r >= 1; r--)
                using (var gb = new SolidBrush(Color.FromArgb(alphas[5 - r], 139, 92, 246))) {
                    g.DrawString(Text, font, gb, x - r, y);
                    g.DrawString(Text, font, gb, x + r, y);
                    g.DrawString(Text, font, gb, x,     y - r);
                    g.DrawString(Text, font, gb, x,     y + r);
                }
            var rc = new RectangleF(x, y, Math.Max(1, sz.Width), Math.Max(1, sz.Height));
            using (var grad = new LinearGradientBrush(rc, GradientStart, GradientEnd,
                       LinearGradientMode.Horizontal))
                g.DrawString(Text, font, grad, x, y);
        }
    }
}

public class GradientProgress : Control {
    private int _val;
    public int Progress {
        get => _val;
        set { _val = value < 0 ? 0 : (value > 100 ? 100 : value); Invalidate(); }
    }
    public Color TrackColor { get; set; }
    public Color FillStart  { get; set; }
    public Color FillEnd    { get; set; }
    public GradientProgress() {
        SetStyle(ControlStyles.UserPaint | ControlStyles.AllPaintingInWmPaint |
                 ControlStyles.OptimizedDoubleBuffer | ControlStyles.ResizeRedraw, true);
        TrackColor = Color.FromArgb(24, 26, 54);
        FillStart  = Color.FromArgb(139, 92, 246);
        FillEnd    = Color.FromArgb(96, 165, 250);
    }
    private GraphicsPath CapsulePath(RectangleF r) {
        var gp = new GraphicsPath();
        float d = Math.Min(r.Height, r.Width);
        if (r.Width <= d + 1f) {
            gp.AddEllipse(r.X, r.Y, Math.Max(1, r.Width), Math.Max(1, r.Height));
            return gp;
        }
        gp.AddArc(r.X, r.Y, d, d, 90, 180);
        gp.AddArc(r.Right - d, r.Y, d, d, 270, 180);
        gp.CloseFigure(); return gp;
    }
    protected override void OnPaint(PaintEventArgs e) {
        var g = e.Graphics;
        g.SmoothingMode = SmoothingMode.AntiAlias;
        g.Clear(BackColor);
        if (Width < 2 || Height < 2) return;
        var track = new RectangleF(0, 0, Width - 1, Height - 1);
        using (var tp = CapsulePath(track))
        using (var tb = new SolidBrush(TrackColor))
            g.FillPath(tb, tp);
        if (_val > 0) {
            float fw = Math.Max(Height, (Width - 1f) * _val / 100f);
            var fill = new RectangleF(0, 0, fw, Height - 1);
            if (fill.Width >= 1 && fill.Height >= 1) {
                var gbrc = new RectangleF(0, 0, Math.Max(1, fw), Math.Max(1, fill.Height));
                using (var fp = CapsulePath(fill))
                using (var fb = new LinearGradientBrush(gbrc, FillStart, FillEnd,
                           LinearGradientMode.Horizontal)) {
                    g.FillPath(fb, fp);
                    using (var gpen = new Pen(Color.FromArgb(80, FillEnd.R, FillEnd.G, FillEnd.B), 1.5f))
                        g.DrawPath(gpen, fp);
                }
            }
        }
    }
}
"@ -ReferencedAssemblies @('System.Windows.Forms', 'System.Drawing')

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

$BG_DARK       = [System.Drawing.Color]::FromArgb(  8,   9,  18)
$BG_PANEL      = [System.Drawing.Color]::FromArgb( 16,  18,  38)
$BG_WARN       = [System.Drawing.Color]::FromArgb( 14,  15,  32)
$FG_WHITE      = [System.Drawing.Color]::FromArgb(227, 229, 232)
$FG_MUTED      = [System.Drawing.Color]::FromArgb(142, 146, 151)
$GOLD          = [System.Drawing.Color]::FromArgb(254, 231,  92)
$BTN_INSTALL   = [System.Drawing.Color]::FromArgb( 87, 242, 135)
$BTN_INSTALL_H = [System.Drawing.Color]::FromArgb( 59, 165,  93)
$BTN_REPAIR    = [System.Drawing.Color]::FromArgb( 88, 101, 242)
$BTN_REPAIR_H  = [System.Drawing.Color]::FromArgb( 71,  82, 196)
$BTN_REMOVE    = [System.Drawing.Color]::FromArgb(237,  66,  69)
$BTN_REMOVE_H  = [System.Drawing.Color]::FromArgb(192,  53,  55)
$BTN_OPENSAR   = [System.Drawing.Color]::FromArgb( 32, 178, 170)
$BTN_OPENSAR_H = [System.Drawing.Color]::FromArgb( 22, 140, 133)
$BTN_SUPPORT   = [System.Drawing.Color]::FromArgb( 88, 101, 242)
$BTN_SUPPORT_H = [System.Drawing.Color]::FromArgb( 71,  82, 196)
$LINK_COLOR    = [System.Drawing.Color]::FromArgb(  0, 176, 244)

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

function Get-LatestTag {
    try { $r = Invoke-RestMethod $RELEASE_API -Headers @{"User-Agent"=$USER_AGENT} -EA Stop; return $r.tag_name }
    catch { return "غير متاح" }
}

function Get-LocalVersion([string]$ResourcesPath) {
    if (-not (Test-Path (Join-Path $ResourcesPath "_app.asar"))) { return "لا يوجد" }
    try { return (Get-Item (Join-Path $ResourcesPath "app.asar")).LastWriteTime.ToString("yyyy-MM-dd") }
    catch { return "مثبَّت" }
}

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
    $bw.Write([uint32]4); $bw.Write([uint32]($alignLen+8))
    $bw.Write([uint32]($alignLen+4)); $bw.Write([uint32]$hdrLen)
    $bw.Write($padded); $bw.Write($indexJs); $bw.Write($pkgJson)
    $bw.Flush()
    [System.IO.File]::WriteAllBytes($Path, $ms.ToArray())
    $bw.Dispose(); $ms.Dispose()
}

function Invoke-Download {
    param([string]$Url, [string]$Dest, [scriptblock]$OnProgress)
    $req = [System.Net.HttpWebRequest]::Create($Url)
    $req.UserAgent = $USER_AGENT; $req.AllowAutoRedirect = $true
    $resp = $req.GetResponse(); $total = $resp.ContentLength
    $sr   = $resp.GetResponseStream(); $fs = [System.IO.File]::Create($Dest)
    $buf  = New-Object byte[] 65536; $done = 0L
    try {
        while ($true) {
            $n = $sr.Read($buf, 0, $buf.Length); if ($n -le 0) { break }
            $fs.Write($buf, 0, $n); $done += $n
            if ($total -gt 0 -and $OnProgress) { & $OnProgress ([int](($done/$total)*100)) $done $total }
        }
    } finally { $fs.Close(); $sr.Close(); $resp.Close() }
}

function Install-Mod {
    param([string]$ResourcesPath, [scriptblock]$Status, [scriptblock]$Progress)
    & $Status "إيقاف Discord..."; & $Progress 3
    Stop-DiscordProcesses $ResourcesPath
    & $Status "جارٍ جلب معلومات آخر إصدار..."; & $Progress 5
    $release = Invoke-RestMethod $RELEASE_API -Headers @{"User-Agent"=$USER_AGENT} -EA Stop
    $asset   = $release.assets | Where-Object { $_.name -eq $ASAR_NAME } | Select-Object -First 1
    if (-not $asset) { throw "لم يُعثر على ملف $ASAR_NAME في الإصدار $($release.tag_name)" }
    $mb = [math]::Round($asset.size/1MB,1)
    & $Status "تحميل $ASAR_NAME — $($release.tag_name) ($mb MB)"; & $Progress 10
    New-Item -ItemType Directory -Path $DataDir -Force | Out-Null
    $tmp = Join-Path ([System.IO.Path]::GetTempPath()) ("eq_ar_"+[guid]::NewGuid().ToString("N")+".asar")
    Invoke-Download -Url $asset.browser_download_url -Dest $tmp -OnProgress {
        param($p,$dl,$tot)
        $mn=[math]::Round($dl/1MB,1); $mt=[math]::Round($tot/1MB,1)
        & $Status "تحميل: $mn/$mt MB  ($p%)"; & $Progress ([int](10+$p*0.55))
    }
    $appAsar = Join-Path $ResourcesPath "app.asar"; $origAsar = Join-Path $ResourcesPath "_app.asar"
    & $Status "نسخ equicord.asar إلى مجلد البيانات..."; & $Progress 68
    Copy-Item $tmp $AsarTarget -Force; Remove-Item $tmp -EA SilentlyContinue
    & $Status "حفظ نسخة احتياطية من Discord الأصلي..."; & $Progress 75
    if (-not (Test-Path $origAsar)) {
        if (Test-Path $appAsar) { Copy-Item $appAsar $origAsar -Force }
        else { throw "لم يُعثر على app.asar في مجلد موارد Discord" }
    }
    & $Status "كتابة شيم Equicord في Discord..."; & $Progress 85
    Write-AppAsarShim -Path $appAsar -EquicordAsarPath $AsarTarget
    & $Progress 93; & $Status "إعادة تشغيل Discord..."
    Start-DiscordProcess $ResourcesPath; Start-Sleep -Milliseconds 300
    & $Progress 100; & $Status "تم التثبيت — Discord يُعاد تشغيله الآن"
}

function Uninstall-Mod {
    param([string]$ResourcesPath, [scriptblock]$Status, [scriptblock]$Progress)
    & $Status "إيقاف Discord..."; & $Progress 10
    Stop-DiscordProcesses $ResourcesPath
    $appAsar = Join-Path $ResourcesPath "app.asar"; $origAsar = Join-Path $ResourcesPath "_app.asar"
    & $Status "جارٍ استعادة Discord الأصلي..."; & $Progress 40
    if (Test-Path $origAsar) {
        Copy-Item $origAsar $appAsar -Force; Remove-Item $origAsar -Force
        & $Status "تمت استعادة app.asar الأصلي"
    } else { & $Status "لم يُعثر على _app.asar — ربما لم يُثبَّت Equicord" }
    & $Progress 80
    if (Test-Path $AsarTarget) { Remove-Item $AsarTarget -EA SilentlyContinue }
    & $Progress 90; & $Status "إعادة تشغيل Discord..."
    Start-DiscordProcess $ResourcesPath; Start-Sleep -Milliseconds 300
    & $Progress 100; & $Status "تمت الإزالة — Discord يُعاد تشغيله الآن"
}

function Install-OpenAsar {
    param([string]$ResourcesPath, [scriptblock]$Status, [scriptblock]$Progress)
    & $Status "جارٍ تنزيل OpenAsar..."; & $Progress 10
    $tmp = Join-Path ([System.IO.Path]::GetTempPath()) ("openasar_"+[guid]::NewGuid().ToString("N")+".asar")
    Invoke-Download "https://github.com/GooseMod/OpenAsar/releases/download/nightly/app.asar" $tmp {
        param($p) & $Progress ([int](10+$p*0.85))
    }
    & $Status "نسخ OpenAsar..."; & $Progress 97
    Copy-Item $tmp (Join-Path $ResourcesPath "app.asar") -Force
    Remove-Item $tmp -EA SilentlyContinue
    & $Progress 100; & $Status "تم تثبيت OpenAsar — أعد تشغيل Discord"
}

# ═══════════════════════════════════════════════════════════════════
#  GUI
# ═══════════════════════════════════════════════════════════════════
function Show-Installer {

    # ── Form ──────────────────────────────────────────────────────
    $form = New-Object System.Windows.Forms.Form
    $form.Text            = "Equicord-ARABIC"
    $form.ClientSize      = New-Object System.Drawing.Size(1200, 762)
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

    # ── Background star field ──────────────────────────────────────
    $rng      = New-Object System.Random(2026)
    $starData = 1..80 | ForEach-Object {
        [PSCustomObject]@{
            X = $rng.Next(6, 1194)
            Y = $rng.Next(6, 756)
            R = $rng.Next(1, 4)
            A = $rng.Next(8, 48)
        }
    }
    $form.Add_Paint({
        param($s, $pe)
        $g = $pe.Graphics
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
        foreach ($st in $starData) {
            $b = New-Object System.Drawing.SolidBrush(
                [System.Drawing.Color]::FromArgb($st.A, 155, 165, 252))
            $g.FillEllipse($b, $st.X, $st.Y, $st.R, $st.R)
            $b.Dispose()
        }
    })

    # ── Left accent bar (purple → blue) ───────────────────────────
    $accentBar          = New-Object System.Windows.Forms.Panel
    $accentBar.Location = New-Object System.Drawing.Point(0, 0)
    $accentBar.Size     = New-Object System.Drawing.Size(4, 762)
    $accentBar.Add_Paint({
        param($s, $pe)
        $rc = New-Object System.Drawing.Rectangle(0, 0, $s.Width, $s.Height)
        $gr = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
            $rc,
            [System.Drawing.Color]::FromArgb(167, 92, 246),
            [System.Drawing.Color]::FromArgb(59, 130, 246),
            [System.Drawing.Drawing2D.LinearGradientMode]::Vertical)
        $pe.Graphics.FillRectangle($gr, $rc); $gr.Dispose()
    })
    $form.Controls.Add($accentBar)

    # ── Label helper ───────────────────────────────────────────────
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
        if ($W -gt 0) { $l.AutoSize = $false; $l.Size = New-Object System.Drawing.Size($W, $H) }
        else          { $l.AutoSize = $true }
        return $l
    }

    # ── Gradient title ─────────────────────────────────────────────
    $titleCtrl = New-Object GradientLabel
    $titleCtrl.Text          = "Equicord-ARABIC"
    $titleCtrl.Location      = New-Object System.Drawing.Point(4, 8)
    $titleCtrl.Size          = New-Object System.Drawing.Size(1196, 60)
    $titleCtrl.BackColor     = $BG_DARK
    $titleCtrl.GradientStart = [System.Drawing.Color]::FromArgb(180, 140, 255)
    $titleCtrl.GradientEnd   = [System.Drawing.Color]::FromArgb(80, 180, 255)
    $form.Controls.Add($titleCtrl)

    # ── Info section ───────────────────────────────────────────────
    $infoY = 74
    $pathLbl = Lbl "سيتم تنزيل Equicord-ARABIC إلى: $AsarTarget" 48 $infoY $FG_WHITE 11
    $form.Controls.Add($pathLbl)

    $btnOpenDir = New-Object System.Windows.Forms.Button
    $btnOpenDir.Text      = "فتح المجلد"
    $btnOpenDir.Location  = New-Object System.Drawing.Point(($pathLbl.Right + 12), ($infoY - 1))
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

    $form.Controls.Add((Lbl "لتخصيص المسار، عيّن متغير البيئة 'EQUICORD_USER_DATA_DIR' ثم أعد التشغيل" 48 ($infoY+24) $FG_MUTED 10))

    $lblInstallerVer = Lbl "إصدار المثبت: v$INSTALLER_VER" 48 ($infoY+46) $FG_WHITE 10
    $form.Controls.Add($lblInstallerVer)

    $lblLocalVer  = Lbl "الإصدار المحلي: جارٍ الفحص..."  540 ($infoY+46) $FG_WHITE 10
    $form.Controls.Add($lblLocalVer)

    $lblLatestVer = Lbl "آخر إصدار: جارٍ الجلب..."        840 ($infoY+46) $FG_WHITE 10
    $form.Controls.Add($lblLatestVer)

    # ── Warning + support panel ────────────────────────────────────
    # Key: gold accent bar is drawn inside Add_Paint — NOT as a child Panel (avoids yellow-block bug)
    $warnY = 142; $warnW = 1104; $warnH = 150

    $warnPanel          = New-Object System.Windows.Forms.Panel
    $warnPanel.Location = New-Object System.Drawing.Point(48, $warnY)
    $warnPanel.Size     = New-Object System.Drawing.Size($warnW, $warnH)
    $warnPanel.BackColor = $BG_WARN

    $warpGp = New-Object System.Drawing.Drawing2D.GraphicsPath
    $warpD  = 16
    $warpGp.AddArc(0,              0,              $warpD, $warpD, 180, 90)
    $warpGp.AddArc($warnW-$warpD,  0,              $warpD, $warpD, 270, 90)
    $warpGp.AddArc($warnW-$warpD,  $warnH-$warpD, $warpD, $warpD,   0, 90)
    $warpGp.AddArc(0,              $warnH-$warpD, $warpD, $warpD,  90, 90)
    $warpGp.CloseFigure()
    $warnPanel.Region = New-Object System.Drawing.Region($warpGp)

    $warnPanel.Add_Paint({
        param($s, $pe)
        $g = $pe.Graphics
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
        $d = 16; $w = $s.Width - 1; $h = $s.Height - 1
        $gp = New-Object System.Drawing.Drawing2D.GraphicsPath
        $gp.AddArc(0,     0,     $d, $d, 180, 90)
        $gp.AddArc($w-$d, 0,     $d, $d, 270, 90)
        $gp.AddArc($w-$d, $h-$d, $d, $d,   0, 90)
        $gp.AddArc(0,     $h-$d, $d, $d,  90, 90)
        $gp.CloseFigure()
        # 3-layer blue glow border
        $p3 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(10, 88, 101, 242), 8)
        $g.DrawPath($p3, $gp); $p3.Dispose()
        $p2 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(28, 88, 101, 242), 4)
        $g.DrawPath($p2, $gp); $p2.Dispose()
        $p1 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(80, 88, 101, 242), 1.5)
        $g.DrawPath($p1, $gp); $p1.Dispose()
        $gp.Dispose()
        # Gold left accent bar — drawn here to avoid child-Panel sizing bug
        $ab = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(254, 231, 92))
        $g.FillRectangle($ab, 2, 18, 4, ($s.Height - 36))
        $ab.Dispose()
    })
    $form.Controls.Add($warnPanel)

    # "هام جداً" badge (inside warning panel)
    $warnBadge          = New-Object System.Windows.Forms.Label
    $warnBadge.Text      = "هام جداً"
    $warnBadge.AutoSize  = $true
    $warnBadge.ForeColor = $GOLD
    $warnBadge.BackColor = [System.Drawing.Color]::Transparent
    $warnBadge.Font      = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
    $warnPanel.Controls.Add($warnBadge)
    $warnPanel.Add_Layout({
        $warnBadge.Location = New-Object System.Drawing.Point(($warnPanel.Width - $warnBadge.Width - 14), 10)
    })

    # Warning text
    $warnText          = New-Object System.Windows.Forms.Label
    $warnText.Text     = "GitHub ومستودع LOSTSTR/Equicord-ARABIC هما المصدران الرسميان الوحيدان للحصول على Equicord-ARABIC.`nأي مصدر آخر يُعتبر ضاراً — احذف كل شيء وأجرِ فحصاً للبرامج الضارة وغيّر كلمة مرور Discord."
    $warnText.Location = New-Object System.Drawing.Point(16, 10)
    $warnText.Size     = New-Object System.Drawing.Size(900, 62)
    $warnText.ForeColor = [System.Drawing.Color]::FromArgb(210, 215, 240)
    $warnText.BackColor = [System.Drawing.Color]::Transparent
    $warnText.Font     = New-Object System.Drawing.Font("Segoe UI", 10)
    $warnPanel.Controls.Add($warnText)

    # Discord support button
    $btnSupport             = New-Object GlowButton
    $btnSupport.Text        = "انضم إلى سيرفر الدعم العربي على Discord"
    $btnSupport.Location    = New-Object System.Drawing.Point(312, 88)
    $btnSupport.Size        = New-Object System.Drawing.Size(480, 46)
    $btnSupport.BackColor   = $BTN_SUPPORT
    $btnSupport.HoverColor  = $BTN_SUPPORT_H
    $btnSupport.GlowColor   = [System.Drawing.Color]::FromArgb(140, 71, 82, 196)
    $btnSupport.FormColor   = $BG_WARN
    $btnSupport.ForeColor   = [System.Drawing.Color]::White
    $btnSupport.Font        = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
    $btnSupport.CornerRadius = 10
    $btnSupport.Add_Click({ Start-Process $SUPPORT_URL })
    $warnPanel.Controls.Add($btnSupport)

    # ── Selection section ──────────────────────────────────────────
    $selectY = 308
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
        $form.Controls.Add($rb); $radios.Add($rb); $radioY += 30
    }

    if ($radios.Count -gt 0) { $radios[0].Checked = $true }
    else {
        $form.Controls.Add((Lbl "لم يُعثر على أي نسخة من Discord مثبتة على هذا الجهاز" 52 $radioY $FG_MUTED 10))
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

    # ── Decorative glowing dots ────────────────────────────────────
    $dotSz = 36; $dotGap = 18; $dotY = 568
    $dotColors = @(
        [System.Drawing.Color]::FromArgb(220, 222, 225)
        [System.Drawing.Color]::FromArgb( 88, 101, 242)
        [System.Drawing.Color]::FromArgb( 87, 242, 135)
        [System.Drawing.Color]::FromArgb(254, 231,  92)
        [System.Drawing.Color]::FromArgb(237,  66,  69)
    )
    $dotTotal  = $dotColors.Count * $dotSz + ($dotColors.Count - 1) * $dotGap  # 5×36 + 4×18 = 252
    $dotStartX = [int]((1200 - $dotTotal) / 2)

    for ($di = 0; $di -lt $dotColors.Count; $di++) {
        $dp          = New-Object System.Windows.Forms.Panel
        $dp.Location = New-Object System.Drawing.Point(($dotStartX + $di * ($dotSz + $dotGap)), $dotY)
        $dp.Size     = New-Object System.Drawing.Size($dotSz, $dotSz)
        $dp.BackColor = $BG_DARK
        $dp.Tag      = $dotColors[$di]   # color stored in Tag so Paint closure reads it safely
        $dp.Add_Paint({
            param($s, $pe)
            $g = $pe.Graphics
            $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
            $g.Clear($s.BackColor)
            $dc = [System.Drawing.Color]($s.Tag)
            # Outer glow halo
            $b1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(18, $dc.R, $dc.G, $dc.B))
            $g.FillEllipse($b1, 0, 0, $s.Width, $s.Height); $b1.Dispose()
            # Mid glow
            $b2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(48, $dc.R, $dc.G, $dc.B))
            $g.FillEllipse($b2, 4, 4, $s.Width - 8, $s.Height - 8); $b2.Dispose()
            # Core
            $b3 = New-Object System.Drawing.SolidBrush($dc)
            $g.FillEllipse($b3, 10, 10, $s.Width - 20, $s.Height - 20); $b3.Dispose()
        })
        $form.Controls.Add($dp)
    }

    # ── Status label ──────────────────────────────────────────────
    $lblStatus          = New-Object System.Windows.Forms.Label
    $lblStatus.Text     = "اختر نسخة Discord ثم اضغط على أحد الأزرار"
    $lblStatus.Location = New-Object System.Drawing.Point(48, 616)
    $lblStatus.Size     = New-Object System.Drawing.Size(1104, 26)
    $lblStatus.ForeColor = $FG_MUTED
    $lblStatus.BackColor = [System.Drawing.Color]::Transparent
    $lblStatus.Font     = New-Object System.Drawing.Font("Segoe UI", 10)
    $form.Controls.Add($lblStatus)

    # ── Gradient progress bar ──────────────────────────────────────
    $progBar          = New-Object GradientProgress
    $progBar.Location = New-Object System.Drawing.Point(48, 644)
    $progBar.Size     = New-Object System.Drawing.Size(1104, 14)
    $progBar.BackColor  = $BG_DARK
    $progBar.TrackColor = [System.Drawing.Color]::FromArgb(24, 26, 54)
    $progBar.FillStart  = [System.Drawing.Color]::FromArgb(139, 92, 246)
    $progBar.FillEnd    = [System.Drawing.Color]::FromArgb(96, 165, 250)
    $form.Controls.Add($progBar)

    # ── Action buttons (GlowButton) ───────────────────────────────
    $btnY = 670; $btnW = 264; $btnH = 54; $gap = 8; $startX = 48

    function New-GlowBtn {
        param([string]$T, [System.Drawing.Color]$Bg, [System.Drawing.Color]$Hov,
              [System.Drawing.Color]$Glow, [int]$PosX)
        $b = New-Object GlowButton
        $b.Text         = $T
        $b.Location     = New-Object System.Drawing.Point($PosX, $btnY)
        $b.Size         = New-Object System.Drawing.Size($btnW, $btnH)
        $b.BackColor    = $Bg
        $b.HoverColor   = $Hov
        $b.GlowColor    = $Glow
        $b.FormColor    = $BG_DARK
        $b.ForeColor    = [System.Drawing.Color]::White
        $b.Font         = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
        $b.CornerRadius = 12
        $form.Controls.Add($b); return $b
    }

    $gGreen = [System.Drawing.Color]::FromArgb(140,  59, 165,  93)
    $gBlue  = [System.Drawing.Color]::FromArgb(140,  71,  82, 196)
    $gRed   = [System.Drawing.Color]::FromArgb(140, 192,  53,  55)
    $gTeal  = [System.Drawing.Color]::FromArgb(140,  22, 140, 133)

    $btnInstall = New-GlowBtn "تثبيت"                    $BTN_INSTALL  $BTN_INSTALL_H  $gGreen ($startX)
    $btnRepair  = New-GlowBtn "إعادة التثبيت / الإصلاح" $BTN_REPAIR   $BTN_REPAIR_H   $gBlue  ($startX + $btnW + $gap)
    $btnRemove  = New-GlowBtn "إزالة التثبيت"            $BTN_REMOVE   $BTN_REMOVE_H   $gRed   ($startX + ($btnW+$gap)*2)
    $btnOpenSar = New-GlowBtn "تثبيت OpenAsar"           $BTN_OPENSAR  $BTN_OPENSAR_H  $gTeal  ($startX + ($btnW+$gap)*3)

    # ── Footer ────────────────────────────────────────────────────
    $sepPanel          = New-Object System.Windows.Forms.Panel
    $sepPanel.Location = New-Object System.Drawing.Point(48, 736)
    $sepPanel.Size     = New-Object System.Drawing.Size(1104, 1)
    $sepPanel.BackColor = [System.Drawing.Color]::FromArgb(35, 38, 68)
    $form.Controls.Add($sepPanel)

    $footerLbl = Lbl "LOSTSTR  —  Equicord-ARABIC  2026  •  GPL-3.0  |  krym511  •  RAYMOND  •  Abo Ahmed  •  S99" 0 740 $FG_MUTED 8.5 Regular -W 1200 -H 20
    $footerLbl.TextAlign = [System.Drawing.ContentAlignment]::MiddleCenter
    $form.Controls.Add($footerLbl)

    # ── Helper functions ──────────────────────────────────────────
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
        $lblStatus.ForeColor = $Col; $lblStatus.Text = $Msg
        $form.Refresh(); [System.Windows.Forms.Application]::DoEvents()
    }

    function Set-Progress([int]$Val) {
        $progBar.Progress = [Math]::Max(0, [Math]::Min(100, $Val))
        [System.Windows.Forms.Application]::DoEvents()
    }

    function Set-Busy([bool]$On) {
        $btnInstall.Enabled = -not $On; $btnRepair.Enabled  = -not $On
        $btnRemove.Enabled  = -not $On; $btnOpenSar.Enabled = -not $On
        $btnSupport.Enabled = -not $On; $form.UseWaitCursor = $On
    }

    function Update-RadioLabels {
        $fresh = @(Get-DiscordInstalls); $i = 0
        foreach ($rb in $radios) {
            if ($i -lt $fresh.Count) { $rb.Text = $fresh[$i].Label; $rb.Tag = $fresh[$i] }
            $i++
        }
    }

    $form.Add_Shown({
        $sel = $null
        foreach ($rb in $radios) { if ($rb.Checked) { $sel = $rb.Tag; break } }
        $lblLocalVer.Text  = if ($sel) { "الإصدار المحلي: $(Get-LocalVersion $sel.Resources)" } else { "الإصدار المحلي: لا يوجد" }
        $lblLatestVer.Text = "آخر إصدار: جارٍ الجلب..."
        [System.Windows.Forms.Application]::DoEvents()
        $lblLatestVer.Text = "آخر إصدار: $(Get-LatestTag)"
    })

    # ── Button events ─────────────────────────────────────────────
    $btnInstall.Add_Click({
        try {
            $target = Get-Target; Set-Busy $true; Set-Progress 0
            Set-Status "جارٍ التثبيت..." $FG_WHITE
            Install-Mod $target { param($m) Set-Status $m $FG_WHITE } { param($p) Set-Progress $p }
            Set-Status "تم التثبيت — Discord يُعاد تشغيله تلقائياً" ([System.Drawing.Color]::FromArgb(87, 242, 135))
            Update-RadioLabels
        } catch { Set-Status "خطأ: $_" ([System.Drawing.Color]::FromArgb(237, 66, 69)); Set-Progress 0 }
        finally  { Set-Busy $false }
    })

    $btnRepair.Add_Click({
        try {
            $target = Get-Target; Set-Busy $true; Set-Progress 0
            Set-Status "جارٍ إعادة التثبيت..." $FG_WHITE
            Install-Mod $target { param($m) Set-Status $m $FG_WHITE } { param($p) Set-Progress $p }
            Set-Status "تمت إعادة التثبيت — Discord يُعاد تشغيله تلقائياً" ([System.Drawing.Color]::FromArgb(87, 242, 135))
            Update-RadioLabels
        } catch { Set-Status "خطأ: $_" ([System.Drawing.Color]::FromArgb(237, 66, 69)); Set-Progress 0 }
        finally  { Set-Busy $false }
    })

    $btnRemove.Add_Click({
        try {
            $target = Get-Target
            $ans = [System.Windows.Forms.MessageBox]::Show(
                "هل تريد إزالة Equicord-ARABIC بالكامل؟", "تأكيد الإزالة",
                [System.Windows.Forms.MessageBoxButtons]::YesNo,
                [System.Windows.Forms.MessageBoxIcon]::Question)
            if ($ans -ne [System.Windows.Forms.DialogResult]::Yes) { return }
            Set-Busy $true; Set-Progress 0
            Set-Status "جارٍ الإزالة..." $FG_WHITE
            Uninstall-Mod $target { param($m) Set-Status $m $FG_WHITE } { param($p) Set-Progress $p }
            Set-Status "تمت الإزالة — Discord يُعاد تشغيله تلقائياً" ([System.Drawing.Color]::FromArgb(87, 242, 135))
            Update-RadioLabels
        } catch { Set-Status "خطأ: $_" ([System.Drawing.Color]::FromArgb(237, 66, 69)); Set-Progress 0 }
        finally  { Set-Busy $false }
    })

    $btnOpenSar.Add_Click({
        try {
            $target = Get-Target; Set-Busy $true; Set-Progress 0
            Set-Status "جارٍ تثبيت OpenAsar..." $FG_WHITE
            Install-OpenAsar $target { param($m) Set-Status $m $FG_WHITE } { param($p) Set-Progress $p }
            Set-Status "تم تثبيت OpenAsar — أعد تشغيل Discord" ([System.Drawing.Color]::FromArgb(87, 242, 135))
        } catch { Set-Status "خطأ: $_" ([System.Drawing.Color]::FromArgb(237, 66, 69)); Set-Progress 0 }
        finally  { Set-Busy $false }
    })

    [void]$form.ShowDialog()
}

Show-Installer
