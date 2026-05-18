#Requires -Version 5.1
<#
.SYNOPSIS
    Esharq Installer — مطابق لتصميم Equilotl الرسمي
.DESCRIPTION
    مُثبِّت Esharq مع واجهة مطابقة لـ Equilotl
    المستودع: https://github.com/LOSTSTR/Esharq
    Copyright (c) 2026 LOSTSTR — GPL-3.0
#>

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
[System.Windows.Forms.Application]::EnableVisualStyles()
[System.Windows.Forms.Application]::SetCompatibleTextRenderingDefault($false)

# ═══════════════════════════════════════════════════════════════════
#  إعدادات ثابتة
# ═══════════════════════════════════════════════════════════════════
$REPO_OWNER   = "LOSTSTR"
$REPO_NAME    = "Esharq"
$INSTALLER_VER = "1.14.13.0"
$ASAR_NAME    = "desktop.asar"
$RELEASE_API  = "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/releases/latest"
$USER_AGENT   = "Esharq-Installer/$INSTALLER_VER (+https://github.com/$REPO_OWNER/$REPO_NAME)"

# مسار بيانات Esharq (مثل Equilotl يستخدم EQUICORD_USER_DATA_DIR)
$DataDir = if ($env:EQUICORD_USER_DATA_DIR) {
    $env:EQUICORD_USER_DATA_DIR
} else {
    Join-Path $env:APPDATA "Esharq"
}
$AsarTarget = Join-Path $DataDir "equicord.asar"

# ألوان مطابقة لـ Equilotl
$BG_DARK      = [System.Drawing.Color]::FromArgb(30,  31,  34)
$BG_PANEL     = [System.Drawing.Color]::FromArgb(40,  41,  45)
$FG_WHITE     = [System.Drawing.Color]::FromArgb(220, 221, 222)
$FG_MUTED     = [System.Drawing.Color]::FromArgb(148, 155, 164)
$WARN_BG      = [System.Drawing.Color]::FromArgb(250, 210,  50)
$WARN_FG      = [System.Drawing.Color]::FromArgb(20,  20,  20)
$BTN_INSTALL  = [System.Drawing.Color]::FromArgb( 67, 181,  73)
$BTN_REPAIR   = [System.Drawing.Color]::FromArgb( 88, 101, 242)
$BTN_REMOVE   = [System.Drawing.Color]::FromArgb(237,  66,  69)
$BTN_OPENSAR  = [System.Drawing.Color]::FromArgb( 67, 181,  73)
$LINK_COLOR   = [System.Drawing.Color]::FromArgb(100, 149, 237)

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
        $base = Join-Path $env:LOCALAPPDATA $v.Dir
        if (-not (Test-Path $base)) { continue }
        $appDir = Get-ChildItem $base -Directory -Filter "app-*" -EA SilentlyContinue |
                  Sort-Object Name -Descending | Select-Object -First 1
        if (-not $appDir) { continue }
        $res = Join-Path $appDir.FullName "resources"
        if (-not (Test-Path $res)) { continue }
        $patched = Test-Path (Join-Path $res $ASAR_NAME)
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
    $p = Join-Path $ResourcesPath $ASAR_NAME
    if (-not (Test-Path $p)) { return "لا يوجد" }
    try {
        return (Get-Item $p).LastWriteTime.ToString("yyyy-MM-dd")
    } catch { return "مثبَّت" }
}

# ═══════════════════════════════════════════════════════════════════
#  تنزيل الملف مع شريط تقدم
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

# ═══════════════════════════════════════════════════════════════════
#  إدارة عمليات Discord
# ═══════════════════════════════════════════════════════════════════
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
#  بناء الواجهة
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
    if (Test-Path $icoPath) {
        try { $form.Icon = New-Object System.Drawing.Icon($icoPath) } catch {}
    }

    # ── دالة مساعدة للتسميات ──────────────────────────────────────────
    function Lbl {
        param([string]$T, [int]$X, [int]$Y, [int]$W=0, [int]$H=0,
              [System.Drawing.Color]$C, [float]$FS=11,
              [System.Drawing.FontStyle]$FS2=[System.Drawing.FontStyle]::Regular)
        if (-not $C) { $C = $FG_WHITE }
        $l = New-Object System.Windows.Forms.Label
        $l.Text      = $T
        $l.Location  = New-Object System.Drawing.Point($X,$Y)
        $l.ForeColor = $C
        $l.BackColor = [System.Drawing.Color]::Transparent
        $l.Font      = New-Object System.Drawing.Font("Segoe UI",$FS,$FS2)
        if ($W -gt 0) { $l.Size = New-Object System.Drawing.Size($W,$H); $l.AutoSize=$false }
        else          { $l.AutoSize = $true }
        return $l
    }

    # ── العنوان ─────────────────────────────────────────────────────
    $title = Lbl "Esharq" 0 24 1200 60 $FG_WHITE 28 Bold
    $title.TextAlign = [System.Drawing.ContentAlignment]::MiddleCenter
    $title.AutoSize  = $false
    $form.Controls.Add($title)

    # ═══ قسم المعلومات ══════════════════════════════════════════════
    $infoY = 90

    # سطر المسار + زر Open Directory
    $pathLbl = Lbl "سيتم تنزيل Esharq إلى: $AsarTarget" 48 $infoY $FG_WHITE 11
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

    $form.Controls.Add((Lbl "لتخصيص هذا المسار، قم بتعيين متغير البيئة 'EQUICORD_USER_DATA_DIR' ثم أعد تشغيل المثبت" 48 ($infoY+28) $FG_WHITE 11))

    # معلومات الإصدار (تُحدَّث لاحقاً)
    $lblInstallerVer = Lbl "إصدار المثبت: v$INSTALLER_VER" 48 ($infoY+62) $FG_WHITE 11
    $form.Controls.Add($lblInstallerVer)

    $lblLocalVer = Lbl "الإصدار المثبت محلياً: جارٍ الفحص..." 48 ($infoY+90) $FG_WHITE 11
    $form.Controls.Add($lblLocalVer)

    $lblLatestVer = Lbl "آخر إصدار متاح: جارٍ الجلب..." 48 ($infoY+118) $FG_WHITE 11
    $form.Controls.Add($lblLatestVer)

    # ═══ صندوق التحذير (مطابق للأصفر في Equilotl) ══════════════════
    $warnY = 240
    $warnPanel = New-Object System.Windows.Forms.Panel
    $warnPanel.Location  = New-Object System.Drawing.Point(48, $warnY)
    $warnPanel.Size      = New-Object System.Drawing.Size(1104, 90)
    $warnPanel.BackColor = $WARN_BG
    $form.Controls.Add($warnPanel)

    $warnText = New-Object System.Windows.Forms.Label
    $warnText.Text = "GitHub ومستودع LOSTSTR/Esharq هما المصدران الرسميان الوحيدان للحصول على Esharq.`nأي مصدر آخر يدّعي توزيعه يُعتبر ضاراً. إذا قمت بتنزيله من مكان آخر، احذف كل شيء وأجرِ فحصاً للبرامج الضارة وغيّر كلمة مرور Discord."
    $warnText.Location  = New-Object System.Drawing.Point(14, 10)
    $warnText.Size      = New-Object System.Drawing.Size(1076, 70)
    $warnText.ForeColor = $WARN_FG
    $warnText.BackColor = [System.Drawing.Color]::Transparent
    $warnText.Font      = New-Object System.Drawing.Font("Segoe UI", 11)
    $warnPanel.Controls.Add($warnText)

    # ═══ قسم الاختيار ═══════════════════════════════════════════════
    $selectY = 348
    $form.Controls.Add((Lbl "الرجاء اختيار نسخة Discord للتعديل عليها" 48 $selectY $FG_WHITE 13 Bold))

    # Radio buttons للنسخ المكتشفة
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
        $form.Controls.Add((Lbl "⚠  لم يُعثر على أي نسخة من Discord مثبتة على هذا الجهاز" 52 $radioY $FG_MUTED 10))
        $radioY += 28
    }

    # مسار مخصص
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

    # ═══ شريط الحالة والتقدم ════════════════════════════════════════
    $statusY = 572

    $lblStatus = New-Object System.Windows.Forms.Label
    $lblStatus.Text      = "اختر نسخة Discord ثم اضغط على أحد الأزرار"
    $lblStatus.Location  = New-Object System.Drawing.Point(48, $statusY)
    $lblStatus.Size      = New-Object System.Drawing.Size(1104, 26)
    $lblStatus.ForeColor = $FG_MUTED
    $lblStatus.BackColor = [System.Drawing.Color]::Transparent
    $lblStatus.Font      = New-Object System.Drawing.Font("Segoe UI", 10)
    $form.Controls.Add($lblStatus)

    $progBar = New-Object System.Windows.Forms.ProgressBar
    $progBar.Location = New-Object System.Drawing.Point(48, ($statusY + 28))
    $progBar.Size     = New-Object System.Drawing.Size(1104, 6)
    $progBar.Minimum  = 0
    $progBar.Maximum  = 100
    $progBar.Value    = 0
    $progBar.Style    = [System.Windows.Forms.ProgressBarStyle]::Continuous
    $form.Controls.Add($progBar)

    # ═══ الأزرار الأربعة ════════════════════════════════════════════
    $btnY  = 612
    $btnW  = 264
    $btnH  = 50
    $gap   = 8
    $startX = 48

    function New-ActionBtn {
        param([string]$T, [System.Drawing.Color]$Bg, [int]$X)
        $b = New-Object System.Windows.Forms.Button
        $b.Text      = $T
        $b.Location  = New-Object System.Drawing.Point($X, $btnY)
        $b.Size      = New-Object System.Drawing.Size($btnW, $btnH)
        $b.BackColor = $Bg
        $b.ForeColor = [System.Drawing.Color]::White
        $b.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
        $b.FlatAppearance.BorderSize = 0
        $b.Font      = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
        $b.Cursor    = [System.Windows.Forms.Cursors]::Hand
        $b.UseVisualStyleBackColor = $false
        $form.Controls.Add($b)
        return $b
    }

    $btnInstall  = New-ActionBtn "تثبيت"              $BTN_INSTALL ($startX)
    $btnRepair   = New-ActionBtn "إعادة التثبيت / الإصلاح" $BTN_REPAIR  ($startX + $btnW + $gap)
    $btnRemove   = New-ActionBtn "إزالة التثبيت"      $BTN_REMOVE  ($startX + ($btnW+$gap)*2)
    $btnOpenSar  = New-ActionBtn "تثبيت OpenAsar"     $BTN_OPENSAR ($startX + ($btnW+$gap)*3)

    # ═══ دوال مساعدة للواجهة ════════════════════════════════════════
    function Get-Target {
        if ($rbCustom.Checked) {
            $p = $txtCustom.Text.Trim()
            if (-not $p -or -not (Test-Path $p)) { throw "المسار المخصص غير صحيح أو غير موجود" }
            return $p
        }
        foreach ($rb in $radios) {
            if ($rb.Checked) { return $rb.Tag.Resources }
        }
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
        $progBar.Value = [Math]::Max(0, [Math]::Min(100, $Val))
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
            if ($i -lt $installs.Count) {
                $rb.Text = $installs[$i].Label
                $rb.Tag  = $installs[$i]
            }
            $i++
        }
    }

    # ── تحميل معلومات الإصدار في الخلفية ──────────────────────────
    $form.Add_Shown({
        # إصدار محلي
        $sel = $null
        foreach ($rb in $radios) { if ($rb.Checked) { $sel = $rb.Tag; break } }
        if ($sel) {
            $lblLocalVer.Text = "الإصدار المثبت محلياً: $(Get-LocalVersion $sel.Resources)"
        } else {
            $lblLocalVer.Text = "الإصدار المثبت محلياً: لا يوجد"
        }

        $lblLatestVer.Text = "آخر إصدار متاح: جارٍ الجلب..."
        [System.Windows.Forms.Application]::DoEvents()

        $latest = Get-LatestTag
        $lblLatestVer.Text = "آخر إصدار متاح: $latest"
    })

    # ═══ معالجات أحداث الأزرار ════════════════════════════════════════
    $btnInstall.Add_Click({
        try {
            $target = Get-Target
            if (-not (Confirm-DiscordStopped $target)) { return }
            Set-Busy $true
            Set-Progress 0
            Set-Status "جارٍ التثبيت..." $FG_WHITE
            Install-Mod $target { param($m) Set-Status $m $FG_WHITE } { param($p) Set-Progress $p }
            Set-Status "✔ تم التثبيت — شغّل Discord مرة أخرى" ([System.Drawing.Color]::FromArgb(87,242,135))
            Refresh-UI
        } catch {
            Set-Status "✖ خطأ: $_" ([System.Drawing.Color]::FromArgb(237,66,69))
            Set-Progress 0
        } finally { Set-Busy $false }
    })

    $btnRepair.Add_Click({
        try {
            $target = Get-Target
            if (-not (Confirm-DiscordStopped $target)) { return }
            Set-Busy $true
            Set-Progress 0
            Set-Status "جارٍ إعادة التثبيت..." $FG_WHITE
            Install-Mod $target { param($m) Set-Status $m $FG_WHITE } { param($p) Set-Progress $p }
            Set-Status "✔ تمت إعادة التثبيت — شغّل Discord مرة أخرى" ([System.Drawing.Color]::FromArgb(87,242,135))
            Refresh-UI
        } catch {
            Set-Status "✖ خطأ: $_" ([System.Drawing.Color]::FromArgb(237,66,69))
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
            Set-Busy $true
            Set-Progress 0
            Set-Status "جارٍ الإزالة..." $FG_WHITE
            Uninstall-Mod $target { param($m) Set-Status $m $FG_WHITE } { param($p) Set-Progress $p }
            Set-Status "✔ تمت الإزالة — شغّل Discord مرة أخرى" ([System.Drawing.Color]::FromArgb(87,242,135))
            Refresh-UI
        } catch {
            Set-Status "✖ خطأ: $_" ([System.Drawing.Color]::FromArgb(237,66,69))
            Set-Progress 0
        } finally { Set-Busy $false }
    })

    $btnOpenSar.Add_Click({
        try {
            $target = Get-Target
            if (-not (Confirm-DiscordStopped $target)) { return }
            Set-Busy $true
            Set-Progress 0
            Set-Status "جارٍ تثبيت OpenAsar..." $FG_WHITE
            Install-OpenAsar $target { param($m) Set-Status $m $FG_WHITE } { param($p) Set-Progress $p }
            Set-Status "✔ تم تثبيت OpenAsar — شغّل Discord مرة أخرى" ([System.Drawing.Color]::FromArgb(87,242,135))
        } catch {
            Set-Status "✖ خطأ: $_" ([System.Drawing.Color]::FromArgb(237,66,69))
            Set-Progress 0
        } finally { Set-Busy $false }
    })

    [void]$form.ShowDialog()
}

Show-Installer
