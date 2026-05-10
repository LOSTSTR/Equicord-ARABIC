#Requires -Version 5.1
<#
.SYNOPSIS
    Equicord-ARABIC Installer
.DESCRIPTION
    مُثبِّت النسخة العربية من Equicord لتعديل Discord
    Copyright (c) 2026 LOSTSTR - GPL-3.0
#>

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName PresentationFramework
[System.Windows.Forms.Application]::EnableVisualStyles()
[System.Windows.Forms.Application]::SetCompatibleTextRenderingDefault($false)

# ═══════════════════════════════════════════════════════════════════
#  Configuration
# ═══════════════════════════════════════════════════════════════════
$Script:Config = @{
    RepoOwner    = "LOSTSTR"
    RepoName     = "Equicord-ARABIC"
    AppName      = "Equicord-ARABIC"
    AppVersion   = "1.0.0"
    AsarName     = "desktop.asar"
    UserAgent    = "EquicordArabic-Installer/1.0 (+https://github.com/LOSTSTR/Equicord-ARABIC)"
    ReleaseApi   = "https://api.github.com/repos/LOSTSTR/Equicord-ARABIC/releases/latest"
    GitHubUrl    = "https://github.com/LOSTSTR/Equicord-ARABIC"
    IconPath     = Join-Path $PSScriptRoot "icon.ico"

    # Colors
    ColorBg        = [System.Drawing.Color]::FromArgb(15,  15,  15)
    ColorPanel     = [System.Drawing.Color]::FromArgb(28,  28,  28)
    ColorBorder    = [System.Drawing.Color]::FromArgb(45,  45,  45)
    ColorAccent    = [System.Drawing.Color]::FromArgb(212, 175, 55)   # Gold
    ColorAccentDim = [System.Drawing.Color]::FromArgb(140, 115, 30)   # Dark gold
    ColorText      = [System.Drawing.Color]::FromArgb(220, 220, 220)
    ColorMuted     = [System.Drawing.Color]::FromArgb(120, 120, 120)
    ColorSuccess   = [System.Drawing.Color]::FromArgb(87,  242, 135)
    ColorDanger    = [System.Drawing.Color]::FromArgb(237, 66,  69)
    ColorWarning   = [System.Drawing.Color]::FromArgb(255, 200, 60)
}

$Script:DiscordVariants = @(
    @{ Key = "Stable";      Dir = "Discord";             Emoji = "⬤" }
    @{ Key = "PTB";         Dir = "DiscordPTB";          Emoji = "⬤" }
    @{ Key = "Canary";      Dir = "DiscordCanary";       Emoji = "⬤" }
    @{ Key = "Development"; Dir = "DiscordDevelopment";  Emoji = "⬤" }
)

$Script:Installs   = @()
$Script:Working    = $false

# ═══════════════════════════════════════════════════════════════════
#  Discord Detection
# ═══════════════════════════════════════════════════════════════════
function Get-DiscordInstalls {
    $result = [System.Collections.Generic.List[hashtable]]::new()

    foreach ($v in $Script:DiscordVariants) {
        $base = Join-Path $env:LOCALAPPDATA $v.Dir
        if (-not (Test-Path $base)) { continue }

        $appDir = Get-ChildItem -Path $base -Directory -Filter "app-*" -ErrorAction SilentlyContinue |
                  Sort-Object Name -Descending | Select-Object -First 1
        if (-not $appDir) { continue }

        $resources = Join-Path $appDir.FullName "resources"
        if (-not (Test-Path $resources)) { continue }

        $result.Add(@{
            Variant   = $v.Key
            Base      = $base
            AppDir    = $appDir.FullName
            Resources = $resources
            Installed = (Test-Path (Join-Path $resources $Script:Config.AsarName))
        })
    }
    return $result
}

# ═══════════════════════════════════════════════════════════════════
#  GitHub Release
# ═══════════════════════════════════════════════════════════════════
function Get-LatestRelease {
    $headers = @{
        "User-Agent" = $Script:Config.UserAgent
        "Accept"     = "application/vnd.github+json"
    }
    try {
        return Invoke-RestMethod -Uri $Script:Config.ReleaseApi -Headers $headers -ErrorAction Stop
    } catch {
        throw "فشل الاتصال بـ GitHub API: $_"
    }
}

function Invoke-FileDownload {
    param(
        [string]$Url,
        [string]$Destination,
        [scriptblock]$OnProgress
    )

    $req = [System.Net.HttpWebRequest]::Create($Url)
    $req.UserAgent    = $Script:Config.UserAgent
    $req.AllowAutoRedirect = $true
    $req.Timeout      = 60000

    $resp   = $req.GetResponse()
    $total  = $resp.ContentLength
    $stream = $resp.GetResponseStream()
    $file   = [System.IO.File]::Create($Destination)
    $buf    = New-Object byte[] 65536
    $done   = 0L

    try {
        while ($true) {
            $n = $stream.Read($buf, 0, $buf.Length)
            if ($n -le 0) { break }
            $file.Write($buf, 0, $n)
            $done += $n
            if ($total -gt 0 -and $OnProgress) {
                $pct = [int](($done / $total) * 100)
                & $OnProgress $pct $done $total
            }
        }
    } finally {
        $file.Close()
        $stream.Close()
        $resp.Close()
    }
}

# ═══════════════════════════════════════════════════════════════════
#  Install / Uninstall Logic
# ═══════════════════════════════════════════════════════════════════
function Install-EquicordArabic {
    param(
        [hashtable]   $Install,
        [scriptblock] $Status,
        [scriptblock] $Progress
    )

    & $Status "جارٍ جلب معلومات آخر إصدار..."
    & $Progress 5

    $release = Get-LatestRelease
    $asset   = $release.assets | Where-Object { $_.name -eq $Script:Config.AsarName } | Select-Object -First 1

    if (-not $asset) {
        throw "لم يُعثر على ملف $($Script:Config.AsarName) في الإصدار $($release.tag_name)"
    }

    $sizeMB = [math]::Round($asset.size / 1MB, 1)
    & $Status "تحميل $($Script:Config.AsarName) — الإصدار $($release.tag_name) ($sizeMB MB)"
    & $Progress 10

    $tmp = Join-Path $env:TEMP ("equicord_ar_" + [guid]::NewGuid().ToString("N") + ".asar")

    Invoke-FileDownload -Url $asset.browser_download_url -Destination $tmp -OnProgress {
        param($pct, $dl, $total)
        $mbNow = [math]::Round($dl / 1MB, 1)
        $mbAll = [math]::Round($total / 1MB, 1)
        & $Status "جارٍ التحميل: $mbNow / $mbAll MB  ($pct%)"
        & $Progress ([int](10 + $pct * 0.65))
    }

    & $Status "جارٍ تثبيت الملفات في Discord $($Install.Variant)..."
    & $Progress 78

    $dest = Join-Path $Install.Resources $Script:Config.AsarName
    Copy-Item -Path $tmp -Destination $dest -Force -ErrorAction Stop
    Remove-Item $tmp -ErrorAction SilentlyContinue

    & $Progress 100
    & $Status "تم تثبيت Equicord-ARABIC في Discord $($Install.Variant) بنجاح!"
}

function Uninstall-EquicordArabic {
    param(
        [hashtable]   $Install,
        [scriptblock] $Status,
        [scriptblock] $Progress
    )

    & $Status "جارٍ إزالة Equicord-ARABIC من Discord $($Install.Variant)..."
    & $Progress 40

    $asarPath = Join-Path $Install.Resources $Script:Config.AsarName
    if (Test-Path $asarPath) {
        Remove-Item $asarPath -Force -ErrorAction Stop
    }

    & $Progress 100
    & $Status "تمت إزالة Equicord-ARABIC من Discord $($Install.Variant)."
}

# ═══════════════════════════════════════════════════════════════════
#  UI Helpers
# ═══════════════════════════════════════════════════════════════════
function New-FlatButton {
    param(
        [string]$Text,
        [System.Drawing.Color]$Bg,
        [System.Drawing.Color]$Fg,
        [System.Drawing.Size]$Size,
        [System.Drawing.Point]$Location
    )
    $b = New-Object System.Windows.Forms.Button
    $b.Text      = $Text
    $b.Size      = $Size
    $b.Location  = $Location
    $b.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
    $b.BackColor = $Bg
    $b.ForeColor = $Fg
    $b.FlatAppearance.BorderSize  = 0
    $b.FlatAppearance.BorderColor = $Bg
    $b.Font      = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
    $b.Cursor    = [System.Windows.Forms.Cursors]::Hand
    $b.UseVisualStyleBackColor = $false
    return $b
}

function New-Lbl {
    param(
        [string]$Text,
        [int]$Size = 9,
        [System.Drawing.Color]$Color,
        [System.Drawing.Point]$Location,
        [System.Drawing.FontStyle]$Style = [System.Drawing.FontStyle]::Regular
    )
    if (-not $Color) { $Color = $Script:Config.ColorText }
    $l = New-Object System.Windows.Forms.Label
    $l.Text      = $Text
    $l.ForeColor = $Color
    $l.BackColor = [System.Drawing.Color]::Transparent
    $l.Font      = New-Object System.Drawing.Font("Segoe UI", $Size, $Style)
    $l.AutoSize  = $true
    if ($Location) { $l.Location = $Location }
    return $l
}

# ═══════════════════════════════════════════════════════════════════
#  Main Form
# ═══════════════════════════════════════════════════════════════════
function Show-Installer {
    $C = $Script:Config

    # ── Root form ──
    $form = New-Object System.Windows.Forms.Form
    $form.Text            = "Equicord-ARABIC  —  المُثبِّت"
    $form.Size            = New-Object System.Drawing.Size(580, 640)
    $form.MinimumSize     = $form.Size
    $form.MaximumSize     = $form.Size
    $form.StartPosition   = [System.Windows.Forms.FormStartPosition]::CenterScreen
    $form.BackColor       = $C.ColorBg
    $form.FormBorderStyle = [System.Windows.Forms.FormBorderStyle]::FixedSingle
    $form.MaximizeBox     = $false

    if (Test-Path $C.IconPath) {
        try { $form.Icon = New-Object System.Drawing.Icon($C.IconPath) } catch {}
    }

    # ── Header ──────────────────────────────────────────────────────
    $header = New-Object System.Windows.Forms.Panel
    $header.Dock      = [System.Windows.Forms.DockStyle]::Top
    $header.Height    = 120
    $header.BackColor = $C.ColorPanel
    $form.Controls.Add($header)

    $lblTitle = New-Lbl "Equicord-ARABIC" 22 $C.ColorAccent (New-Object System.Drawing.Point(20,16)) Bold
    $header.Controls.Add($lblTitle)

    $lblSub = New-Lbl "النسخة العربية الكاملة من Equicord  •  Discord Mod" 9 $C.ColorMuted (New-Object System.Drawing.Point(22,54))
    $header.Controls.Add($lblSub)

    $lblVer = New-Lbl "v$($C.AppVersion)" 8 ([System.Drawing.Color]::FromArgb(80,80,80)) (New-Object System.Drawing.Point(22,74))
    $header.Controls.Add($lblVer)

    $goldLine = New-Object System.Windows.Forms.Label
    $goldLine.Size      = New-Object System.Drawing.Size(540, 2)
    $goldLine.Location  = New-Object System.Drawing.Point(20, 108)
    $goldLine.BackColor = $C.ColorAccent
    $header.Controls.Add($goldLine)

    # ── Body ────────────────────────────────────────────────────────
    $body = New-Object System.Windows.Forms.Panel
    $body.Location  = New-Object System.Drawing.Point(0, 120)
    $body.Size      = New-Object System.Drawing.Size(580, 462)
    $body.BackColor = $C.ColorBg
    $form.Controls.Add($body)

    # Detected installs label
    $lblDetect = New-Lbl "نسخ Discord المكتشفة على جهازك:" 10 $C.ColorText (New-Object System.Drawing.Point(20, 18)) SemiBold
    $body.Controls.Add($lblDetect)

    # List box
    $list = New-Object System.Windows.Forms.ListBox
    $list.Location    = New-Object System.Drawing.Point(20, 44)
    $list.Size        = New-Object System.Drawing.Size(535, 130)
    $list.BackColor   = $C.ColorPanel
    $list.ForeColor   = $C.ColorText
    $list.BorderStyle = [System.Windows.Forms.BorderStyle]::FixedSingle
    $list.Font        = New-Object System.Drawing.Font("Segoe UI", 10)
    $list.SelectionMode = [System.Windows.Forms.SelectionMode]::One
    $body.Controls.Add($list)

    # Status box
    $statusBox = New-Object System.Windows.Forms.Panel
    $statusBox.Location  = New-Object System.Drawing.Point(20, 188)
    $statusBox.Size      = New-Object System.Drawing.Size(535, 70)
    $statusBox.BackColor = $C.ColorPanel
    $body.Controls.Add($statusBox)

    $lblStatus = New-Object System.Windows.Forms.Label
    $lblStatus.Text      = "اختر نسخة Discord ثم اضغط 'تثبيت'"
    $lblStatus.Location  = New-Object System.Drawing.Point(10, 10)
    $lblStatus.Size      = New-Object System.Drawing.Size(515, 50)
    $lblStatus.ForeColor = $C.ColorText
    $lblStatus.BackColor = [System.Drawing.Color]::Transparent
    $lblStatus.Font      = New-Object System.Drawing.Font("Segoe UI", 9)
    $statusBox.Controls.Add($lblStatus)

    # Progress bar
    $prog = New-Object System.Windows.Forms.ProgressBar
    $prog.Location  = New-Object System.Drawing.Point(20, 268)
    $prog.Size      = New-Object System.Drawing.Size(535, 18)
    $prog.Minimum   = 0
    $prog.Maximum   = 100
    $prog.Value     = 0
    $prog.Style     = [System.Windows.Forms.ProgressBarStyle]::Continuous
    $body.Controls.Add($prog)

    # Buttons row 1
    $btnInstall = New-FlatButton "⬇  تثبيت / تحديث" `
        $C.ColorAccent ([System.Drawing.Color]::FromArgb(20,20,20)) `
        (New-Object System.Drawing.Size(172, 46)) (New-Object System.Drawing.Point(20, 302))
    $body.Controls.Add($btnInstall)

    $btnUninstall = New-FlatButton "🗑  إزالة" `
        ([System.Drawing.Color]::FromArgb(55,25,25)) $C.ColorDanger `
        (New-Object System.Drawing.Size(172, 46)) (New-Object System.Drawing.Point(200, 302))
    $body.Controls.Add($btnUninstall)

    $btnFolder = New-FlatButton "📁  المجلد" `
        ([System.Drawing.Color]::FromArgb(40,40,40)) $C.ColorText `
        (New-Object System.Drawing.Size(172, 46)) (New-Object System.Drawing.Point(383, 302))
    $body.Controls.Add($btnFolder)

    # Info panel
    $infoPanel = New-Object System.Windows.Forms.Panel
    $infoPanel.Location  = New-Object System.Drawing.Point(20, 365)
    $infoPanel.Size      = New-Object System.Drawing.Size(535, 80)
    $infoPanel.BackColor = $C.ColorPanel
    $body.Controls.Add($infoPanel)

    $infoText = @(
        "• يتم تحميل الملفات مباشرة من مستودع LOSTSTR/Equicord-ARABIC"
        "• يتم التحديث التلقائي من داخل Discord بعد التثبيت"
        "• متوافق مع Discord الرسمي (Stable / PTB / Canary)"
    ) -join "`n"

    $lblInfo = New-Object System.Windows.Forms.Label
    $lblInfo.Text      = $infoText
    $lblInfo.Location  = New-Object System.Drawing.Point(10, 8)
    $lblInfo.Size      = New-Object System.Drawing.Size(515, 65)
    $lblInfo.ForeColor = $C.ColorMuted
    $lblInfo.BackColor = [System.Drawing.Color]::Transparent
    $lblInfo.Font      = New-Object System.Drawing.Font("Segoe UI", 8)
    $infoPanel.Controls.Add($lblInfo)

    # ── Footer ──────────────────────────────────────────────────────
    $footer = New-Object System.Windows.Forms.Panel
    $footer.Dock      = [System.Windows.Forms.DockStyle]::Bottom
    $footer.Height    = 44
    $footer.BackColor = $C.ColorPanel
    $form.Controls.Add($footer)

    $lblCopy = New-Lbl "Equicord-ARABIC © 2026 LOSTSTR  —  GPL-3.0" 8 $C.ColorMuted (New-Object System.Drawing.Point(14,12))
    $footer.Controls.Add($lblCopy)

    $lnkGH = New-Object System.Windows.Forms.LinkLabel
    $lnkGH.Text      = "GitHub ↗"
    $lnkGH.Location  = New-Object System.Drawing.Point(480, 12)
    $lnkGH.AutoSize  = $true
    $lnkGH.Font      = New-Object System.Drawing.Font("Segoe UI", 8)
    $lnkGH.LinkColor = $C.ColorAccent
    $lnkGH.ActiveLinkColor = $C.ColorAccent
    $footer.Controls.Add($lnkGH)
    $lnkGH.Add_LinkClicked({ Start-Process $Script:Config.GitHubUrl })

    # ═══════════════════════════════════════════════════════════════
    #  Internal helpers
    # ═══════════════════════════════════════════════════════════════
    function Refresh-List {
        $Script:Installs = @(Get-DiscordInstalls)
        $sel = $list.SelectedIndex
        $list.Items.Clear()
        if ($Script:Installs.Count -eq 0) {
            $list.Items.Add("  ⚠  لم يُعثر على أي نسخة مثبتة من Discord")
        } else {
            foreach ($i in $Script:Installs) {
                $tag = if ($i.Installed) { "✔ مثبت" } else { "—  غير مثبت" }
                $list.Items.Add("  Discord $($i.Variant.PadRight(12))   $tag")
            }
        }
        if ($sel -ge 0 -and $sel -lt $list.Items.Count) { $list.SelectedIndex = $sel }
        elseif ($list.Items.Count -gt 0)                 { $list.SelectedIndex = 0 }
    }

    function Set-UIEnabled([bool]$on) {
        $btnInstall.Enabled   = $on -and ($Script:Installs.Count -gt 0)
        $btnUninstall.Enabled = $on -and ($Script:Installs.Count -gt 0)
        $btnFolder.Enabled    = $on
        $list.Enabled         = $on
        $form.UseWaitCursor   = -not $on
    }

    function Set-Status([string]$msg, [System.Drawing.Color]$color) {
        if (-not $color) { $color = $Script:Config.ColorText }
        $lblStatus.ForeColor = $color
        $lblStatus.Text = $msg
        $form.Refresh()
        [System.Windows.Forms.Application]::DoEvents()
    }

    function Set-Progress([int]$val) {
        $prog.Value = [Math]::Max(0, [Math]::Min(100, $val))
        [System.Windows.Forms.Application]::DoEvents()
    }

    function Get-SelectedInstall {
        $idx = $list.SelectedIndex
        if ($idx -lt 0 -or $idx -ge $Script:Installs.Count) { return $null }
        return $Script:Installs[$idx]
    }

    # ═══════════════════════════════════════════════════════════════
    #  Event Handlers
    # ═══════════════════════════════════════════════════════════════
    $btnInstall.Add_Click({
        $inst = Get-SelectedInstall
        if (-not $inst) {
            [System.Windows.Forms.MessageBox]::Show(
                "الرجاء اختيار نسخة Discord من القائمة أولاً.",
                "Equicord-ARABIC", [System.Windows.Forms.MessageBoxButtons]::OK,
                [System.Windows.Forms.MessageBoxIcon]::Warning) | Out-Null
            return
        }
        Set-UIEnabled $false
        Set-Progress 0
        try {
            Install-EquicordArabic $inst { param($m) Set-Status $m } { param($p) Set-Progress $p }
            Set-Status "✔ تم التثبيت بنجاح — أعد تشغيل Discord لتفعيل التغييرات" $Script:Config.ColorSuccess
        } catch {
            Set-Status "✖ خطأ: $_" $Script:Config.ColorDanger
            Set-Progress 0
        } finally {
            Set-UIEnabled $true
            Refresh-List
        }
    })

    $btnUninstall.Add_Click({
        $inst = Get-SelectedInstall
        if (-not $inst) { return }
        if (-not $inst.Installed) {
            Set-Status "Equicord-ARABIC غير مثبت في Discord $($inst.Variant)." $Script:Config.ColorWarning
            return
        }
        $ans = [System.Windows.Forms.MessageBox]::Show(
            "هل تريد إزالة Equicord-ARABIC من Discord $($inst.Variant)؟",
            "تأكيد الإزالة",
            [System.Windows.Forms.MessageBoxButtons]::YesNo,
            [System.Windows.Forms.MessageBoxIcon]::Question)
        if ($ans -ne [System.Windows.Forms.DialogResult]::Yes) { return }

        Set-UIEnabled $false
        Set-Progress 0
        try {
            Uninstall-EquicordArabic $inst { param($m) Set-Status $m } { param($p) Set-Progress $p }
            Set-Status "✔ تمت الإزالة — أعد تشغيل Discord" $Script:Config.ColorSuccess
        } catch {
            Set-Status "✖ فشلت الإزالة: $_" $Script:Config.ColorDanger
        } finally {
            Set-UIEnabled $true
            Refresh-List
        }
    })

    $btnFolder.Add_Click({
        $inst = Get-SelectedInstall
        if ($inst) { Start-Process explorer.exe $inst.Resources }
    })

    # Initial load
    Refresh-List
    Set-UIEnabled ($Script:Installs.Count -gt 0)
    if ($Script:Installs.Count -eq 0) {
        Set-Status "لم يُعثر على Discord. قم بتثبيته ثم أعد تشغيل هذا المثبت." $Script:Config.ColorWarning
    }

    [void]$form.ShowDialog()
}

# ═══════════════════════════════════════════════════════════════════
#  Entry Point
# ═══════════════════════════════════════════════════════════════════
Show-Installer
