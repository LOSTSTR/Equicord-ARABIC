#Requires -Version 5.1
<#
.SYNOPSIS
    Esharq — مُرقِّع PowerShell (بدون واجهة رسومية)
.DESCRIPTION
    يثبّت Esharq على Discord دون الحاجة لأي واجهة رسومية.
    الاستخدام: install-windows.ps1 [-Uninstall] [-DiscordVariant <Stable|PTB|Canary|Development|All>]
    المستودع: https://github.com/LOSTSTR/Esharq
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
$REPO_NAME   = "Esharq"
$ASAR_NAME   = "desktop.asar"
$RELEASE_API = "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/releases/latest"
$USER_AGENT  = "Esharq-CLI/1.0 (+https://github.com/$REPO_OWNER/$REPO_NAME)"

$DataDir = if ($env:EQUICORD_USER_DATA_DIR) {
    $env:EQUICORD_USER_DATA_DIR
} else {
    $appData = if ($env:APPDATA) { $env:APPDATA } else { [System.Environment]::GetFolderPath("ApplicationData") }
    Join-Path $appData "Esharq"
}
$AsarTarget = Join-Path $DataDir "equicord.asar"

# ── إدارة عمليات Discord ────────────────────────────────────────────────
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

# ── كتابة شيم ASAR (Equilotl-style) ────────────────────────────────────
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

# ── واجهة الطرفية ──────────────────────────────────────────────────────
function Write-Banner {
    Write-Host ""
    Write-Host "  ╔══════════════════════════════════════════╗" -ForegroundColor Blue
    Write-Host "  ║        Esharq — مُرقِّع PowerShell        ║" -ForegroundColor Blue
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

            Write-Host "  ⏹  إيقاف $($inst.Name)..." -ForegroundColor Yellow
            Stop-DiscordProcesses $inst.Resources

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

            # كتابة شيم ASAR (Equilotl-style) يحمّل equicord.asar من DataDir
            Write-AppAsarShim -Path $appAsar -EquicordAsarPath $AsarTarget
            Write-Host "  ✔  تم الحقن في: $($inst.Name)" -ForegroundColor Green

            Write-Host "  ▶  إعادة تشغيل $($inst.Name)..." -ForegroundColor Cyan
            Start-DiscordProcess $inst.Resources
        }
    } finally {
        if (Test-Path $tmpAsar) { Remove-Item $tmpAsar -EA SilentlyContinue }
    }

    Write-Host ""
    Write-Host "  ╔══════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "  ║  ✅ تم التثبيت بنجاح!                   ║" -ForegroundColor Green
    Write-Host "  ║  Discord يُعاد تشغيله تلقائياً           ║" -ForegroundColor Green
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

        Write-Host "  ⏹  إيقاف $($inst.Name)..." -ForegroundColor Yellow
        Stop-DiscordProcesses $inst.Resources

        if (Test-Path $origAsar) {
            Write-Host "  ← استعادة: _app.asar → app.asar ($($inst.Name))" -ForegroundColor Cyan
            Copy-Item $origAsar $appAsar -Force
            Remove-Item $origAsar -Force
            Write-Host "  ✔  تمت الاستعادة في: $($inst.Name)" -ForegroundColor Green
        } else {
            Write-Host "  ℹ  لا يوجد _app.asar في: $($inst.Name) — ربما غير مثبَّت" -ForegroundColor Yellow
        }

        Write-Host "  ▶  إعادة تشغيل $($inst.Name)..." -ForegroundColor Cyan
        Start-DiscordProcess $inst.Resources
    }

    if (Test-Path $AsarTarget) {
        Remove-Item $AsarTarget -Force
        Write-Host "  ✔  تم حذف: $AsarTarget" -ForegroundColor Green
    }

    Write-Host ""
    Write-Host "  ✅ تمت إزالة Esharq. Discord يُعاد تشغيله تلقائياً." -ForegroundColor Green
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
