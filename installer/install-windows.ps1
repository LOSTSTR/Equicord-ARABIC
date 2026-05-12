#Requires -Version 5.1
<#
.SYNOPSIS
    Equicord-ARABIC — مُرقِّع PowerShell (بدون واجهة رسومية)
.DESCRIPTION
    يثبّت Equicord-ARABIC على Discord دون الحاجة لأي واجهة رسومية.
    الاستخدام: install-windows.ps1 [-Uninstall] [-DiscordVariant <Stable|PTB|Canary|Development|All>]
    المستودع: https://github.com/LOSTSTR/Equicord-ARABIC
    Copyright (c) 2026 LOSTSTR — GPL-3.0
#>
param(
    [switch]$Uninstall,
    [ValidateSet("Stable", "PTB", "Canary", "Development", "All")]
    [string]$DiscordVariant = "All"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$REPO_OWNER  = "LOSTSTR"
$REPO_NAME   = "Equicord-ARABIC"
$ASAR_NAME   = "desktop.asar"
$RELEASE_API = "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/releases/latest"
$USER_AGENT  = "EquicordArabic-CLI/1.0 (+https://github.com/$REPO_OWNER/$REPO_NAME)"

$DataDir = if ($env:EQUICORD_USER_DATA_DIR) {
    $env:EQUICORD_USER_DATA_DIR
} else {
    $appData = if ($env:APPDATA) { $env:APPDATA } else { [System.Environment]::GetFolderPath("ApplicationData") }
    Join-Path $appData "Equicord-ARABIC"
}
$AsarTarget = Join-Path $DataDir "equicord.asar"

# ── واجهة الطرفية ──────────────────────────────────────────────────────
function Write-Banner {
    Write-Host ""
    Write-Host "  ╔══════════════════════════════════════════╗" -ForegroundColor Blue
    Write-Host "  ║   Equicord-ARABIC — مُرقِّع PowerShell   ║" -ForegroundColor Blue
    Write-Host "  ║   النسخة العربية الرسمية من Equicord     ║" -ForegroundColor Blue
    Write-Host "  ╚══════════════════════════════════════════╝" -ForegroundColor Blue
    Write-Host ""
    Write-Host "  المستودع: https://github.com/$REPO_OWNER/$REPO_NAME" -ForegroundColor Cyan
    Write-Host "  مجلد البيانات: $DataDir" -ForegroundColor Cyan
    Write-Host ""
}

# ── اكتشاف نسخ Discord ────────────────────────────────────────────────
function Get-DiscordInstalls {
    $variants = @(
        @{ Name = "Stable";      Dir = "Discord" }
        @{ Name = "PTB";         Dir = "DiscordPTB" }
        @{ Name = "Canary";      Dir = "DiscordCanary" }
        @{ Name = "Development"; Dir = "DiscordDevelopment" }
    )
    $found = [System.Collections.Generic.List[hashtable]]::new()
    $localApp = if ($env:LOCALAPPDATA) { $env:LOCALAPPDATA } else {
        [System.Environment]::GetFolderPath("LocalApplicationData")
    }
    foreach ($v in $variants) {
        if ($DiscordVariant -ne "All" -and $v.Name -ne $DiscordVariant) { continue }
        $base = Join-Path $localApp $v.Dir
        if (-not (Test-Path $base)) { continue }
        $appDir = Get-ChildItem $base -Directory -Filter "app-*" -EA SilentlyContinue |
                  Sort-Object Name -Descending | Select-Object -First 1
        if (-not $appDir) { continue }
        $res = Join-Path $appDir.FullName "resources"
        if (-not (Test-Path $res)) { continue }
        $found.Add(@{
            Name      = $v.Name
            Resources = $res
            Patched   = (Test-Path (Join-Path $res "_app.asar"))
        })
    }
    return $found
}

# ── GitHub Release ─────────────────────────────────────────────────────
function Get-AsarDownloadUrl {
    Write-Host "  ⬇  جارٍ الاستعلام عن أحدث إصدار..." -ForegroundColor Cyan
    $release = Invoke-RestMethod $RELEASE_API -Headers @{ "User-Agent" = $USER_AGENT } -EA Stop
    $asset   = $release.assets | Where-Object { $_.name -eq $ASAR_NAME } | Select-Object -First 1
    if (-not $asset) { throw "لم يُعثر على $ASAR_NAME في الإصدار $($release.tag_name)" }
    $mb = [math]::Round($asset.size / 1MB, 1)
    Write-Host "  ✔  الإصدار: $($release.tag_name)  |  الحجم: $mb MB" -ForegroundColor Green
    return $asset.browser_download_url
}

# ── تحميل مع شريط تقدم ──────────────────────────────────────────────
function Invoke-AsarDownload([string]$Url, [string]$Dest) {
    $req = [System.Net.HttpWebRequest]::Create($Url)
    $req.UserAgent      = $USER_AGENT
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
            if ($total -gt 0) {
                $pct    = [int](($done / $total) * 100)
                $filled = [int]($pct / 5)
                $bar    = ("█" * $filled).PadRight(20, "░")
                Write-Host "`r  [$bar] $pct%  ($([math]::Round($done/1MB,1))/$([math]::Round($total/1MB,1)) MB)  " -NoNewline -ForegroundColor Cyan
            }
        }
    } finally {
        $fs.Dispose()
        $sr.Dispose()
        $resp.Dispose()
    }
    Write-Host ""
}

# ── التثبيت ────────────────────────────────────────────────────────────
function Install-Equicord([System.Collections.Generic.List[hashtable]]$Installs) {
    Write-Host "  🔧 وضع التثبيت / التحديث" -ForegroundColor Cyan
    Write-Host ""

    $url     = Get-AsarDownloadUrl
    $tmpAsar = [System.IO.Path]::GetTempFileName() + ".asar"

    try {
        Write-Host "  ⬇  جارٍ التحميل..." -ForegroundColor Cyan
        Invoke-AsarDownload $url $tmpAsar

        # حفظ نسخة في DataDir للمحدِّث التلقائي
        New-Item -ItemType Directory -Path $DataDir -Force | Out-Null
        Copy-Item $tmpAsar $AsarTarget -Force
        Write-Host "  ✔  تم الحفظ في: $AsarTarget" -ForegroundColor Green
        Write-Host ""

        foreach ($inst in $Installs) {
            $appAsar  = Join-Path $inst.Resources "app.asar"
            $origAsar = Join-Path $inst.Resources "_app.asar"

            Write-Host "  🔍 $($inst.Name): $($inst.Resources)" -ForegroundColor Cyan

            # احتفظ بنسخة احتياطية من app.asar الأصلي إن لم تكن موجودة
            if (-not (Test-Path $origAsar)) {
                if (Test-Path $appAsar) {
                    Write-Host "  ← نسخ احتياطي: app.asar → _app.asar" -ForegroundColor Yellow
                    Copy-Item $appAsar $origAsar -Force
                } else {
                    Write-Host "  ✖  لم يُعثر على app.asar في: $($inst.Resources)" -ForegroundColor Red
                    continue
                }
            } else {
                Write-Host "  ℹ  _app.asar موجود — تحديث app.asar فقط" -ForegroundColor Yellow
            }

            # استبدال app.asar بـ Equicord
            Copy-Item $tmpAsar $appAsar -Force
            Write-Host "  ✔  تم الحقن في: $($inst.Name)" -ForegroundColor Green
        }
    } finally {
        if (Test-Path $tmpAsar) { Remove-Item $tmpAsar -EA SilentlyContinue }
    }

    Write-Host ""
    Write-Host "  ╔══════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "  ║  ✅ تم التثبيت بنجاح!                   ║" -ForegroundColor Green
    Write-Host "  ║  أعد تشغيل Discord لتفعيل Equicord-ARABIC ║" -ForegroundColor Green
    Write-Host "  ╚══════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
}

# ── الإزالة ────────────────────────────────────────────────────────────
function Uninstall-Equicord([System.Collections.Generic.List[hashtable]]$Installs) {
    Write-Host "  🗑  وضع الإزالة" -ForegroundColor Yellow
    Write-Host ""

    foreach ($inst in $Installs) {
        $appAsar  = Join-Path $inst.Resources "app.asar"
        $origAsar = Join-Path $inst.Resources "_app.asar"

        if (Test-Path $origAsar) {
            Write-Host "  ← استعادة: _app.asar → app.asar ($($inst.Name))" -ForegroundColor Cyan
            Copy-Item $origAsar $appAsar -Force
            Remove-Item $origAsar -Force
            Write-Host "  ✔  تمت الاستعادة في: $($inst.Name)" -ForegroundColor Green
        } else {
            Write-Host "  ℹ  لا يوجد _app.asar في: $($inst.Name) — ربما غير مثبَّت" -ForegroundColor Yellow
        }
    }

    if (Test-Path $AsarTarget) {
        Remove-Item $AsarTarget -Force
        Write-Host "  ✔  تم حذف: $AsarTarget" -ForegroundColor Green
    }

    Write-Host ""
    Write-Host "  ✅ تمت إزالة Equicord-ARABIC. أعد تشغيل Discord." -ForegroundColor Green
    Write-Host ""
}

# ── النقطة الرئيسية ────────────────────────────────────────────────────
Write-Banner

$installs = Get-DiscordInstalls

if ($installs.Count -eq 0) {
    Write-Host "  ✖  لم يُعثر على أي إصدار من Discord مثبت." -ForegroundColor Red
    if ($DiscordVariant -ne "All") {
        Write-Host "     (تم البحث عن إصدار '$DiscordVariant' فقط)" -ForegroundColor Yellow
    }
    Write-Host "     يرجى تثبيت Discord من: https://discord.com/download" -ForegroundColor Yellow
    exit 1
}

Write-Host "  تم العثور على الإصدارات التالية:" -ForegroundColor White
foreach ($inst in $installs) {
    $status = if ($inst.Patched) { "[مُثبَّت ✔]" } else { "[غير مُثبَّت]" }
    $color  = if ($inst.Patched) { "Green" } else { "Yellow" }
    Write-Host "    • $($inst.Name)  $status" -ForegroundColor $color
}
Write-Host ""

if ($Uninstall) {
    Uninstall-Equicord $installs
} else {
    Install-Equicord $installs
}
