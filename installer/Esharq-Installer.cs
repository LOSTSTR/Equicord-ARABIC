// Esharq Client Installer  v1.14.13.0
// Copyright (c) 2026 LoSTSR / NRaymond. All rights reserved.
// Build: see build.ps1

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Net;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Threading;
using System.Windows.Forms;

[assembly: AssemblyTitle("Esharq Client Installer")]
[assembly: AssemblyDescription("Official installer for Esharq — the community Discord client mod")]
[assembly: AssemblyCompany("Esharq Digital Branding")]
[assembly: AssemblyProduct("Esharq")]
[assembly: AssemblyCopyright("© 2026 LoSTSR / krym511. All rights reserved.")]
[assembly: AssemblyVersion("1.14.13.0")]
[assembly: AssemblyFileVersion("1.14.13.0")]
[assembly: AssemblyTrademark("Esharq")]

// ─────────────────────────────────────────────────────────────────────
// Data model
// ─────────────────────────────────────────────────────────────────────

sealed class DiscordInstall
{
    public string Name;
    public string ResourcesPath;
    public bool   IsPatched;
    public string DisplayPath;
}

// ─────────────────────────────────────────────────────────────────────
// Logic  (pure static — zero UI dependency)
// ─────────────────────────────────────────────────────────────────────

static class Logic
{
    const string RELEASE_API  = "https://api.github.com/repos/LOSTSTR/Esharq/releases/latest";
    const string UA           = "Esharq-Installer/1.14.13.0 (+https://github.com/LOSTSTR/Esharq)";
    const string ASAR         = "desktop.asar";
    const string OPENASAR_URL = "https://github.com/GooseMod/OpenAsar/releases/download/nightly/app.asar";

    public static void InitNetwork()
    {
        try
        {
            ServicePointManager.SecurityProtocol =
                (SecurityProtocolType)3072 |   // TLS 1.2
                (SecurityProtocolType)12288;   // TLS 1.3 (no-op on older .NET)
            ServicePointManager.DefaultConnectionLimit = 4;
        }
        catch { }
    }

    public static string DataDir
    {
        get
        {
            var env = Environment.GetEnvironmentVariable("EQUICORD_USER_DATA_DIR");
            if (!string.IsNullOrEmpty(env)) return env;
            var appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            if (string.IsNullOrEmpty(appData))
                appData = Path.Combine(
                    Environment.GetEnvironmentVariable("USERPROFILE") ?? @"C:\Users\Default",
                    "AppData", "Roaming");
            return Path.Combine(appData, "Esharq");
        }
    }

    public static string AsarTarget { get { return Path.Combine(DataDir, "equicord.asar"); } }

    public static bool IsInstalled { get { return File.Exists(AsarTarget); } }

    // ── Discord detection ────────────────────────────────────────────

    public static List<DiscordInstall> FindDiscord()
    {
        var result = new List<DiscordInstall>();

        // Explicit null guard — elevated process may see different LOCALAPPDATA
        var local = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
        if (string.IsNullOrEmpty(local))
        {
            var profile = Environment.GetEnvironmentVariable("USERPROFILE");
            if (!string.IsNullOrEmpty(profile))
                local = Path.Combine(profile, "AppData", "Local");
        }
        if (string.IsNullOrEmpty(local) || !Directory.Exists(local))
            return result;

        var names   = new[] { "Stable", "PTB", "Canary", "Development" };
        var folders = new[] { "Discord", "DiscordPTB", "DiscordCanary", "DiscordDevelopment" };

        for (int i = 0; i < names.Length; i++)
        {
            try
            {
                var baseDir = Path.Combine(local, folders[i]);
                if (!Directory.Exists(baseDir)) continue;

                string[] appDirs;
                try { appDirs = Directory.GetDirectories(baseDir, "app-*"); }
                catch { continue; }
                if (appDirs == null || appDirs.Length == 0) continue;

                Array.Sort(appDirs);
                var res = Path.Combine(appDirs[appDirs.Length - 1], "resources");
                if (!Directory.Exists(res)) continue;

                result.Add(new DiscordInstall
                {
                    Name          = names[i],
                    ResourcesPath = res,
                    IsPatched     = File.Exists(Path.Combine(res, ASAR)),
                    DisplayPath   = baseDir,
                });
            }
            catch { }
        }
        return result;
    }

    // ── Version helpers ──────────────────────────────────────────────

    public static string LatestTag()
    {
        try
        {
            using (var wc = MakeClient())
            {
                var json = wc.DownloadString(RELEASE_API);
                var m    = Regex.Match(json, "\"tag_name\"\\s*:\\s*\"([^\"]+)\"");
                return m.Success ? m.Groups[1].Value : "—";
            }
        }
        catch { return "—"; }
    }

    public static string LocalVersion()
    {
        if (!IsInstalled) return "—";
        try { return File.GetLastWriteTime(AsarTarget).ToString("yyyy-MM-dd"); }
        catch { return "مثبَّت"; }
    }

    // ── Download helpers ─────────────────────────────────────────────

    static string GetAsarUrl(out string tag, out long size)
    {
        tag = ""; size = 0;
        using (var wc = MakeClient())
        {
            var json = wc.DownloadString(RELEASE_API);
            var tm   = Regex.Match(json, "\"tag_name\"\\s*:\\s*\"([^\"]+)\"");
            if (tm.Success) tag = tm.Groups[1].Value;
            var am = Regex.Match(json, "\"assets\"\\s*:\\s*\\[([\\s\\S]+?)\\]");
            if (!am.Success) return null;
            foreach (Match bm in Regex.Matches(am.Groups[1].Value, "\\{[^{}]+\\}"))
            {
                var nm = Regex.Match(bm.Value, "\"name\"\\s*:\\s*\"([^\"]+)\"");
                if (!nm.Success || nm.Groups[1].Value != ASAR) continue;
                var um = Regex.Match(bm.Value, "\"browser_download_url\"\\s*:\\s*\"([^\"]+)\"");
                var sm = Regex.Match(bm.Value, "\"size\"\\s*:\\s*(\\d+)");
                if (um.Success)
                {
                    if (sm.Success) long.TryParse(sm.Groups[1].Value, out size);
                    return um.Groups[1].Value;
                }
            }
        }
        return null;
    }

    static void Download(string url, string dest, Action<int, long, long> onProgress)
    {
        var req = (HttpWebRequest)WebRequest.Create(url);
        req.UserAgent       = UA;
        req.AllowAutoRedirect = true;
        req.Timeout           = 60000;
        using (var resp = (HttpWebResponse)req.GetResponse())
        using (var rs   = resp.GetResponseStream())
        using (var fs   = File.Create(dest))
        {
            long total = resp.ContentLength, done = 0;
            var  buf   = new byte[81920];
            int  n;
            while ((n = rs.Read(buf, 0, buf.Length)) > 0)
            {
                fs.Write(buf, 0, n);
                done += n;
                if (total > 0 && onProgress != null)
                    onProgress((int)(done * 100 / total), done, total);
            }
        }
    }

    public static void KillDiscord(string resourcesPath)
    {
        try
        {
            var discordRoot = Path.GetDirectoryName(Path.GetDirectoryName(resourcesPath));
            if (string.IsNullOrEmpty(discordRoot)) return;
            var procName = Path.GetFileName(discordRoot);
            if (string.IsNullOrEmpty(procName)) return;
            foreach (var p in Process.GetProcessesByName(procName))
                try { p.Kill(); p.WaitForExit(3000); } catch { }
            Thread.Sleep(800);
        }
        catch { }
    }

    // ── Install operations ───────────────────────────────────────────

    public static void Install(string res, Action<string> status, Action<int> progress)
    {
        status("جارٍ جلب معلومات آخر إصدار...");
        progress(5);
        string tag; long sz;
        var url = GetAsarUrl(out tag, out sz);
        if (string.IsNullOrEmpty(url))
            throw new Exception("لم يُعثر على ملف " + ASAR + " في أحدث إصدار");

        status(string.Format("تحميل {0}  ({1:F1} MB)...", tag, sz / 1048576.0));
        progress(10);

        Directory.CreateDirectory(DataDir);
        var tmp = Path.Combine(Path.GetTempPath(),
            "esharq_" + Guid.NewGuid().ToString("N") + ".asar");

        Download(url, tmp, (pct, dl, tot) =>
        {
            status(string.Format("تحميل: {0:F1}/{1:F1} MB  ({2}%)",
                dl / 1048576.0, tot / 1048576.0, pct));
            progress(10 + (int)(pct * 0.65));
        });

        status("تطبيق التعديل على Discord...");
        progress(80);
        KillDiscord(res);
        File.Copy(tmp, Path.Combine(res, ASAR), true);
        File.Copy(tmp, AsarTarget, true);
        try { File.Delete(tmp); } catch { }

        progress(100);
        status("✓ تم التثبيت — أعد تشغيل Discord لتفعيل Esharq");
    }

    public static void Uninstall(string res, Action<string> status, Action<int> progress)
    {
        status("جارٍ إزالة Esharq...");
        progress(20);
        KillDiscord(res);
        progress(50);
        var f = Path.Combine(res, ASAR);
        if (File.Exists(f)) File.Delete(f);
        progress(80);
        if (File.Exists(AsarTarget)) File.Delete(AsarTarget);
        progress(100);
        status("✓ تمت الإزالة — أعد تشغيل Discord");
    }

    public static void InstallOpenAsar(string res, Action<string> status, Action<int> progress)
    {
        status("جارٍ إغلاق Discord...");
        progress(5);
        KillDiscord(res);
        status("جارٍ تنزيل OpenAsar...");
        progress(10);
        var tmp = Path.Combine(Path.GetTempPath(),
            "openasar_" + Guid.NewGuid().ToString("N") + ".asar");
        Download(OPENASAR_URL, tmp, (p, dl, tot) => progress(10 + (int)(p * 0.85)));
        status("تطبيق OpenAsar...");
        progress(97);
        File.Copy(tmp, Path.Combine(res, "app.asar"), true);
        try { File.Delete(tmp); } catch { }
        progress(100);
        status("✓ تم تثبيت OpenAsar — أعد تشغيل Discord");
    }

    static WebClient MakeClient()
    {
        var wc = new WebClient();
        wc.Headers[HttpRequestHeader.UserAgent] = UA;
        return wc;
    }
}

// ─────────────────────────────────────────────────────────────────────
// InstallerForm
//
// Crash-safe design rules enforced throughout:
//   • NO custom OnPaint overrides — zero GraphicsPath in any paint path
//   • NO Color.Transparent on Panel or Button — GDI null-brush crash on LTSC
//   • Card "borders" are nested panels (outer=border color, inner=surface)
//   • Progress is a resizing Panel, not a custom control
//   • All Label backgrounds use explicit solid colors
//   • All threading through SafeInvoke — no Application.DoEvents inside Invoke
//   • _suppressEvents flag prevents radio/custom-path event cascade
//
// Layout (ClientSize 860 × 580):
//   y=  0  Header            h=56
//   y= 56  Separator         h= 1
//   y= 68  Picker label
//   y= 92  Cards row         h=96
//   y=200  Custom path row   h=30
//   y=244  Path info (2 ln)  h=40
//   y=294  Primary button    h=52
//   y=354  Progress track    h= 4
//   y=362  Status label      h=20
//   y=392  Separator         h= 1
//   y=398  Support strip     h=36
//   y=440  Advanced panel    h=52  ← hidden by default
//   y=540  Footer separator  h= 1
//   y=541  Footer            h=39
// ─────────────────────────────────────────────────────────────────────

sealed class InstallerForm : Form
{
    // ── macOS Dark palette ───────────────────────────────────────────
    static readonly Color BG         = Color.FromArgb( 14,  15,  17);
    static readonly Color SURFACE    = Color.FromArgb( 24,  25,  28);
    static readonly Color SURFACE2   = Color.FromArgb( 34,  36,  42);
    static readonly Color BORDER_N   = Color.FromArgb( 46,  48,  53);
    static readonly Color ACCENT     = Color.FromArgb( 91, 110, 245);
    static readonly Color SUCCESS    = Color.FromArgb( 48, 209,  88);
    static readonly Color DANGER     = Color.FromArgb(255,  69,  58);
    static readonly Color TEXT_PRI   = Color.FromArgb(245, 245, 247);
    static readonly Color TEXT_SEC   = Color.FromArgb(142, 142, 147);
    static readonly Color TEXT_MUTED = Color.FromArgb( 72,  73,  74);

    const string DISCORD_URL = "https://discord.gg/kDJYqWX3S3";
    const string GITHUB_URL  = "https://github.com/LOSTSTR/Esharq";
    const string VER         = "1.14.13.0";

    // Controls
    Label      _lblStatus, _lblPath, _lblLocalVer, _lblLatestVer;
    Panel      _progFill;
    Button     _btnPrimary, _btnRepair, _btnOpenAsar, _btnRemove, _btnToggleAdv;
    Panel      _pnlAdvanced;
    bool       _advExpanded;

    List<Panel>          _cardBorders = new List<Panel>();
    List<RadioButton>    _radios      = new List<RadioButton>();
    List<DiscordInstall> _installs    = new List<DiscordInstall>();

    RadioButton _rbCustom;
    TextBox     _txtCustom;
    Button      _btnBrowse;
    bool        _suppressEvents;

    public InstallerForm()
    {
        SuspendLayout();
        SetupWindow();
        BuildHeader();
        BuildDiscordPicker();
        BuildPathRow();
        BuildPrimaryAction();
        BuildSupportStrip();
        BuildAdvancedPanel();
        BuildFooter();
        Shown += OnShown;
        ResumeLayout(true);
    }

    // ── Window ───────────────────────────────────────────────────────

    void SetupWindow()
    {
        Text            = "Esharq";
        ClientSize      = new Size(860, 580);
        BackColor       = BG;
        StartPosition   = FormStartPosition.CenterScreen;
        FormBorderStyle = FormBorderStyle.FixedSingle;
        MaximizeBox     = false;
        Font            = new Font("Segoe UI", 10f);

        try
        {
            var ico = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "icon.ico");
            if (File.Exists(ico)) Icon = new Icon(ico);
        }
        catch { }
    }

    // ── Header (y=0..56) ─────────────────────────────────────────────

    void BuildHeader()
    {
        var hdr = MakePanel(0, 0, 860, 56, SURFACE);
        Controls.Add(hdr);

        hdr.Controls.Add(MakeLabel("✦", 22, 17, ACCENT, 14f, FontStyle.Bold, hdr));
        hdr.Controls.Add(MakeLabel("Esharq", 44, 17, TEXT_PRI, 14f, FontStyle.Bold, hdr));
        hdr.Controls.Add(MakeLabel("v" + VER, 118, 23, TEXT_MUTED, 9f, FontStyle.Regular, hdr));

        // Ambient Discord support link (Variation A — header right)
        var lnkDis = MakeLink("💬 دعم", 654, 19, 9f, hdr, DISCORD_URL);
        hdr.Controls.Add(lnkDis);
        hdr.Controls.Add(MakeLabel("·", 702, 19, TEXT_MUTED, 9f, FontStyle.Regular, hdr));
        var lnkGit = MakeLink("GitHub", 714, 19, 9f, hdr, GITHUB_URL);
        hdr.Controls.Add(lnkGit);

        // Bottom border
        Controls.Add(MakePanel(0, 56, 860, 1, BORDER_N));
    }

    // ── Discord version picker (y=68..230) ───────────────────────────

    void BuildDiscordPicker()
    {
        Controls.Add(MakeLabel("اختر نسخة Discord للتعديل عليها",
            24, 68, TEXT_SEC, 11f, FontStyle.Bold));

        _installs = Logic.FindDiscord();
        var display = new List<DiscordInstall>(_installs);
        while (display.Count < 2) display.Add(null);

        int[] xs = { 24, 436 };
        int cardW = 400, cardH = 96, cardY = 92;
        string[] fallbackNames = { "Discord Stable", "PTB / Canary" };

        for (int i = 0; i < 2; i++)
        {
            DiscordInstall inst  = display[i];
            bool           avail = inst != null;
            int            xi    = xs[i];

            // Outer panel = visible border (1px)
            Color outerColor = avail ? BORDER_N : Color.FromArgb(35, 37, 42);
            Panel outer = MakePanel(xi, cardY, cardW, cardH, outerColor);
            Controls.Add(outer);
            _cardBorders.Add(outer);

            // Inner panel = card surface
            Color innerColor = avail ? SURFACE : Color.FromArgb(20, 21, 24);
            Panel inner = MakePanel(1, 1, cardW - 2, cardH - 2, innerColor);
            outer.Controls.Add(inner);

            // Radio
            var rb = new RadioButton
            {
                Text                = avail ? inst.Name : fallbackNames[i],
                Location            = new Point(12, 10),
                AutoSize            = true,
                ForeColor           = avail ? TEXT_PRI : TEXT_MUTED,
                BackColor           = innerColor,
                UseVisualStyleBackColor = false,
                Font                = new Font("Segoe UI", 11f, FontStyle.Bold),
                Enabled             = avail,
                Tag                 = inst,
            };
            inner.Controls.Add(rb);
            _radios.Add(rb);

            if (avail)
            {
                string sp = inst.DisplayPath.Length > 50
                    ? "..." + inst.DisplayPath.Substring(inst.DisplayPath.Length - 47)
                    : inst.DisplayPath;
                inner.Controls.Add(MakeLabel(sp, 34, 36, TEXT_MUTED, 9f,
                    FontStyle.Regular, inner, cardW - 50, 18));
                var statusCol  = inst.IsPatched ? SUCCESS : TEXT_MUTED;
                var statusText = inst.IsPatched ? "✓ Esharq مُثبَّت" : "✓ متاح للتثبيت";
                inner.Controls.Add(MakeLabel(statusText, 34, 58, statusCol, 9f,
                    FontStyle.Regular, inner));
            }
            else
            {
                inner.Controls.Add(MakeLabel("غير مثبَّتة على هذا الجهاز",
                    34, 36, TEXT_MUTED, 9f, FontStyle.Regular, inner));
            }

            // Click anywhere on card → select (captured index)
            int ci = i;
            EventHandler select = (s, e) =>
            {
                if (!avail || _suppressEvents) return;
                _radios[ci].Checked = true;
            };
            outer.Click += select;
            inner.Click += select;
            foreach (Control c in inner.Controls) c.Click += select;

            // CheckedChanged
            int ii = i;
            rb.CheckedChanged += (s, e) =>
            {
                if (_suppressEvents || !rb.Checked) return;
                _suppressEvents = true;
                try
                {
                    for (int k = 0; k < _cardBorders.Count; k++)
                        _cardBorders[k].BackColor = (k == ii) ? ACCENT : BORDER_N;
                    if (_rbCustom != null) _rbCustom.Checked = false;
                    SetCustomPathEnabled(false);
                }
                finally { _suppressEvents = false; }
                UpdatePrimaryButton();
            };
        }

        // Auto-select first available without triggering event cascade
        for (int i = 0; i < _radios.Count; i++)
        {
            if (_radios[i].Enabled)
            {
                _suppressEvents = true;
                _radios[i].Checked     = true;
                _cardBorders[i].BackColor = ACCENT;
                _suppressEvents = false;
                break;
            }
        }

        // Custom path row (y=200)
        int cy = cardY + cardH + 8;

        _rbCustom = new RadioButton
        {
            Text                = "مسار تثبيت مخصص",
            Location            = new Point(28, cy + 4),
            AutoSize            = true,
            ForeColor           = TEXT_SEC,
            BackColor           = BG,
            UseVisualStyleBackColor = false,
            Font                = new Font("Segoe UI", 10f),
        };
        Controls.Add(_rbCustom);

        _txtCustom = new TextBox
        {
            Location    = new Point(204, cy),
            Size        = new Size(540, 28),
            BackColor   = SURFACE2,
            ForeColor   = TEXT_MUTED,
            BorderStyle = BorderStyle.FixedSingle,
            Font        = new Font("Segoe UI", 9f),
            Text        = "مجلد resources الخاص بـ Discord",
            Enabled     = false,
        };
        Controls.Add(_txtCustom);

        _btnBrowse = MakeFlatBtn("استعراض", 752, cy, 84, 28, SURFACE2, TEXT_SEC);
        _btnBrowse.FlatAppearance.BorderColor = BORDER_N;
        _btnBrowse.FlatAppearance.BorderSize  = 1;
        _btnBrowse.Enabled = false;
        Controls.Add(_btnBrowse);

        _rbCustom.CheckedChanged += (s, e) =>
        {
            if (_suppressEvents) return;
            _suppressEvents = true;
            try
            {
                if (_rbCustom.Checked)
                {
                    foreach (var r in _radios) r.Checked = false;
                    foreach (var b in _cardBorders) b.BackColor = BORDER_N;
                }
                SetCustomPathEnabled(_rbCustom.Checked);
            }
            finally { _suppressEvents = false; }
            UpdatePrimaryButton();
        };

        _btnBrowse.Click += (s, e) =>
        {
            using (var dlg = new FolderBrowserDialog())
            {
                dlg.Description = "اختر مجلد resources الخاص بـ Discord";
                if (dlg.ShowDialog(this) == DialogResult.OK)
                {
                    _txtCustom.Text      = dlg.SelectedPath;
                    _txtCustom.ForeColor = TEXT_PRI;
                }
            }
        };
    }

    void SetCustomPathEnabled(bool on)
    {
        if (_txtCustom  == null) return;
        _txtCustom.Enabled   = on;
        _txtCustom.ForeColor = on ? TEXT_PRI : TEXT_MUTED;
        if (_btnBrowse != null) _btnBrowse.Enabled = on;
    }

    // ── Inline path row (y=244..284) ─────────────────────────────────

    void BuildPathRow()
    {
        Controls.Add(MakeLabel("📦", 24, 244, TEXT_MUTED, 9f));

        _lblPath = MakeLabel("يُثبَّت في:  " + ShortenPath(Logic.AsarTarget),
            44, 244, TEXT_MUTED, 9f);
        Controls.Add(_lblPath);

        var lnkOpen = MakeLink("فتح ↗", 754, 244, 9f, null, null);
        lnkOpen.LinkClicked += (s, e) =>
        {
            try { Directory.CreateDirectory(Logic.DataDir); Process.Start("explorer.exe", Logic.DataDir); }
            catch { }
        };
        Controls.Add(lnkOpen);

        _lblLocalVer  = MakeLabel("الإصدار المحلي: —", 44, 266, TEXT_MUTED, 9f);
        Controls.Add(_lblLocalVer);

        _lblLatestVer = MakeLabel("·  آخر إصدار: جارٍ الجلب...", 204, 266, TEXT_MUTED, 9f);
        Controls.Add(_lblLatestVer);
    }

    // ── Primary action + progress (y=294..382) ───────────────────────

    void BuildPrimaryAction()
    {
        _btnPrimary = MakeFlatBtn("تثبيت Esharq", 24, 294, 812, 52, SUCCESS, Color.White);
        _btnPrimary.Font = new Font("Segoe UI", 13f, FontStyle.Bold);
        _btnPrimary.Click += OnPrimaryClick;
        Controls.Add(_btnPrimary);

        // Progress: track panel + resizing fill sub-panel (zero GDI, zero crash risk)
        var progTrack = MakePanel(24, 354, 812, 4, SURFACE2);
        Controls.Add(progTrack);
        _progFill = MakePanel(0, 0, 0, 4, SUCCESS);
        progTrack.Controls.Add(_progFill);

        _lblStatus = new Label
        {
            Text      = "اختر نسخة Discord ثم اضغط تثبيت",
            Location  = new Point(24, 362),
            Size      = new Size(812, 20),
            ForeColor = TEXT_MUTED,
            BackColor = BG,
            Font      = new Font("Segoe UI", 9f),
        };
        Controls.Add(_lblStatus);
    }

    // ── Support strip (y=392..434) ────────────────────────────────────

    void BuildSupportStrip()
    {
        Controls.Add(MakePanel(24, 392, 812, 1, BORDER_N));

        // Container with explicit BG color (NOT transparent — avoids GDI null brush on LTSC)
        var strip = MakePanel(24, 398, 812, 36, BG);
        Controls.Add(strip);

        // Left accent border (3px)
        strip.Controls.Add(MakePanel(0, 0, 3, 36, ACCENT));

        // Contextual support text (Variation B)
        const string supportText =
            "للجلب الفوري والدعم الفني، الرجاء الانضمام لخادم الديسكورد الرسمي";
        var lnkSupport = MakeLink(supportText + "  ↗", 12, 9, 9f, strip, DISCORD_URL);
        strip.Controls.Add(lnkSupport);

        // Advanced toggle
        _btnToggleAdv = MakeFlatBtn("خيارات متقدمة  ▾", 628, 5, 180, 26, BG, TEXT_MUTED);
        _btnToggleAdv.FlatAppearance.BorderSize = 0;
        _btnToggleAdv.Click += ToggleAdvanced;
        strip.Controls.Add(_btnToggleAdv);
    }

    // ── Advanced panel (y=440, hidden) ────────────────────────────────

    void BuildAdvancedPanel()
    {
        _pnlAdvanced = MakePanel(24, 440, 812, 52, BG);
        _pnlAdvanced.Visible = false;
        Controls.Add(_pnlAdvanced);

        _btnRepair = MakeFlatBtn("↺  إصلاح / إعادة التثبيت",
            0, 0, 264, 44, SURFACE2, TEXT_SEC);
        _btnRepair.FlatAppearance.BorderColor = BORDER_N;
        _btnRepair.FlatAppearance.BorderSize  = 1;
        _btnRepair.Click += OnRepair;
        _pnlAdvanced.Controls.Add(_btnRepair);

        _btnOpenAsar = MakeFlatBtn("⚙  تثبيت OpenAsar",
            276, 0, 264, 44, SURFACE2, TEXT_SEC);
        _btnOpenAsar.FlatAppearance.BorderColor = BORDER_N;
        _btnOpenAsar.FlatAppearance.BorderSize  = 1;
        _btnOpenAsar.Click += OnOpenAsar;
        _pnlAdvanced.Controls.Add(_btnOpenAsar);

        // Destructive — text only, no fill, no border
        _btnRemove = MakeFlatBtn("إزالة التثبيت", 590, 13, 222, 26, BG, DANGER);
        _btnRemove.FlatAppearance.BorderSize = 0;
        _btnRemove.TextAlign = ContentAlignment.MiddleRight;
        _btnRemove.Click += OnRemove;
        _pnlAdvanced.Controls.Add(_btnRemove);
    }

    // ── Footer (y=540..580) ───────────────────────────────────────────

    void BuildFooter()
    {
        Controls.Add(MakePanel(0, 540, 860, 1, BORDER_N));

        var ft = MakePanel(0, 541, 860, 39, SURFACE);
        Controls.Add(ft);

        ft.Controls.Add(MakeLabel(
            "⚠ التحميل الرسمي فقط من LOSTSTR/Esharq على GitHub  ·  GPL-3.0",
            20, 0, TEXT_MUTED, 8.5f, FontStyle.Regular, ft, 580, 39,
            ContentAlignment.MiddleLeft));

        ft.Controls.Add(MakeLabel(
            "© 2026 LoSTSR / NRaymond",
            610, 0, TEXT_MUTED, 8.5f, FontStyle.Regular, ft, 230, 39,
            ContentAlignment.MiddleRight));
    }

    // ── State-aware primary button ────────────────────────────────────

    void UpdatePrimaryButton()
    {
        if (_btnPrimary == null) return;
        if (Logic.IsInstalled)
        {
            _btnPrimary.Text      = "تحديث / إعادة تثبيت Esharq";
            _btnPrimary.BackColor = ACCENT;
            _btnPrimary.FlatAppearance.MouseOverBackColor =
                Color.FromArgb(110, 128, 250);
        }
        else
        {
            _btnPrimary.Text      = "تثبيت Esharq";
            _btnPrimary.BackColor = SUCCESS;
            _btnPrimary.FlatAppearance.MouseOverBackColor =
                Color.FromArgb(68, 225, 108);
        }
    }

    // ── Advanced toggle ───────────────────────────────────────────────

    void ToggleAdvanced(object sender, EventArgs e)
    {
        _advExpanded         = !_advExpanded;
        _pnlAdvanced.Visible = _advExpanded;
        _btnToggleAdv.Text   = _advExpanded ? "خيارات متقدمة  ▲" : "خيارات متقدمة  ▾";
    }

    // ── OnShown ───────────────────────────────────────────────────────

    void OnShown(object sender, EventArgs e)
    {
        UpdatePrimaryButton();
        _lblLocalVer.Text = "الإصدار المحلي: " + Logic.LocalVersion();

        var t = new Thread(() =>
        {
            var tag = Logic.LatestTag();
            SafeInvoke(() => _lblLatestVer.Text = "·  آخر إصدار: " + tag);
        });
        t.IsBackground = true;
        t.Start();
    }

    // ── Button handlers ───────────────────────────────────────────────

    void OnPrimaryClick(object sender, EventArgs e)
    {
        string target;
        if (!TryGetTarget(out target) || !ConfirmKill(target)) return;
        RunAsync(() => Logic.Install(target, s => Msg(s), v => Prog(v)));
    }

    void OnRepair(object sender, EventArgs e)
    {
        string target;
        if (!TryGetTarget(out target) || !ConfirmKill(target)) return;
        RunAsync(() => Logic.Install(target, s => Msg(s), v => Prog(v)));
    }

    void OnRemove(object sender, EventArgs e)
    {
        string target;
        if (!TryGetTarget(out target)) return;
        if (MessageBox.Show(this, "هل تريد إزالة Esharq بالكامل؟",
                "تأكيد", MessageBoxButtons.YesNo, MessageBoxIcon.Question)
            != DialogResult.Yes) return;
        if (!ConfirmKill(target)) return;
        RunAsync(() => Logic.Uninstall(target, s => Msg(s), v => Prog(v)));
    }

    void OnOpenAsar(object sender, EventArgs e)
    {
        string target;
        if (!TryGetTarget(out target) || !ConfirmKill(target)) return;
        RunAsync(() => Logic.InstallOpenAsar(target, s => Msg(s), v => Prog(v)));
    }

    // ── Helpers ───────────────────────────────────────────────────────

    DiscordInstall SelectedInstall()
    {
        for (int i = 0; i < _radios.Count; i++)
            if (_radios[i].Checked) return _radios[i].Tag as DiscordInstall;
        return null;
    }

    bool TryGetTarget(out string path)
    {
        path = null;
        try
        {
            if (_rbCustom != null && _rbCustom.Checked)
            {
                var p = (_txtCustom != null ? _txtCustom.Text : "").Trim();
                if (string.IsNullOrEmpty(p) || !Directory.Exists(p))
                    throw new Exception("المسار المخصص غير صحيح أو غير موجود");
                path = p; return true;
            }
            var inst = SelectedInstall();
            if (inst == null) throw new Exception("الرجاء اختيار نسخة Discord أولاً");
            path = inst.ResourcesPath; return true;
        }
        catch (Exception ex) { Msg("✖ " + ex.Message); return false; }
    }

    bool ConfirmKill(string resourcesPath)
    {
        try
        {
            var root = Path.GetDirectoryName(Path.GetDirectoryName(resourcesPath));
            if (string.IsNullOrEmpty(root)) return true;
            var name = Path.GetFileName(root);
            if (string.IsNullOrEmpty(name)) return true;
            if (Process.GetProcessesByName(name).Length == 0) return true;
            return MessageBox.Show(this,
                "Discord يعمل حالياً وسيتم إغلاقه.\nهل تريد المتابعة؟",
                "تنبيه", MessageBoxButtons.YesNo, MessageBoxIcon.Warning)
                == DialogResult.Yes;
        }
        catch { return true; }
    }

    void RunAsync(Action op)
    {
        SetBusy(true); Prog(0);
        var t = new Thread(() =>
        {
            try { op(); }
            catch (Exception ex) { Msg("✖ خطأ: " + ex.Message); Prog(0); }
            finally
            {
                if (!IsDisposed) SafeInvoke(() =>
                {
                    SetBusy(false);
                    UpdatePrimaryButton();
                    _lblLocalVer.Text = "الإصدار المحلي: " + Logic.LocalVersion();
                });
            }
        });
        t.IsBackground = true;
        t.Start();
    }

    void Msg(string text)
    {
        SafeInvoke(() => _lblStatus.Text = text);
    }

    void Prog(int v)
    {
        SafeInvoke(() =>
        {
            int w = (int)(812 * Math.Max(0, Math.Min(100, v)) / 100.0);
            if (_progFill != null) _progFill.Width = w;
        });
    }

    void SetBusy(bool on)
    {
        if (_btnPrimary  != null) _btnPrimary.Enabled  = !on;
        if (_btnRepair   != null) _btnRepair.Enabled   = !on;
        if (_btnOpenAsar != null) _btnOpenAsar.Enabled = !on;
        if (_btnRemove   != null) _btnRemove.Enabled   = !on;
        UseWaitCursor = on;
    }

    void SafeInvoke(Action a)
    {
        if (IsDisposed) return;
        try { if (InvokeRequired) Invoke(a); else a(); }
        catch { }
    }

    static string ShortenPath(string path)
    {
        try
        {
            var roaming = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            if (!string.IsNullOrEmpty(roaming) &&
                path.StartsWith(roaming, StringComparison.OrdinalIgnoreCase))
                return "Roaming" + path.Substring(roaming.Length);
        }
        catch { }
        return path.Length > 60 ? "..." + path.Substring(path.Length - 57) : path;
    }

    static void TryOpen(string url)
    {
        if (string.IsNullOrEmpty(url)) return;
        try { Process.Start(new ProcessStartInfo(url) { UseShellExecute = true }); }
        catch { }
    }

    // ── Control factories ─────────────────────────────────────────────
    // All use explicit solid BackColor — never Color.Transparent on panels or buttons

    static Panel MakePanel(int x, int y, int w, int h, Color bg)
    {
        return new Panel { Location = new Point(x, y), Size = new Size(w, h), BackColor = bg };
    }

    static Label MakeLabel(string text, int x, int y, Color col,
        float fs = 10f, FontStyle st = FontStyle.Regular,
        Control parent = null, int w = 0, int h = 0,
        ContentAlignment align = ContentAlignment.TopLeft)
    {
        var l = new Label
        {
            Text      = text,
            Location  = new Point(x, y),
            ForeColor = col,
            BackColor = Color.Transparent,   // safe on Label — only unsafe on Panel/Button
            Font      = new Font("Segoe UI", fs, st),
            TextAlign = align,
        };
        if (w > 0 && h > 0) l.Size = new Size(w, h);
        else l.AutoSize = true;
        if (parent != null) parent.Controls.Add(l);
        return l;
    }

    static Button MakeFlatBtn(string text, int x, int y, int w, int h, Color bg, Color fg)
    {
        var b = new Button
        {
            Text      = text,
            Location  = new Point(x, y),
            Size      = new Size(w, h),
            BackColor = bg,
            ForeColor = fg,
            FlatStyle = FlatStyle.Flat,
            Font      = new Font("Segoe UI", 10f),
            Cursor    = Cursors.Hand,
        };
        b.FlatAppearance.BorderSize = 0;
        b.FlatAppearance.MouseOverBackColor = ControlPaint.Light(bg, 0.1f);
        return b;
    }

    static LinkLabel MakeLink(string text, int x, int y, float fs,
        Control parent, string url)
    {
        var l = new LinkLabel
        {
            Text            = text,
            Location        = new Point(x, y),
            AutoSize        = true,
            ForeColor       = Color.FromArgb(114, 118, 125),
            BackColor       = Color.Transparent,   // safe on Label
            Font            = new Font("Segoe UI", fs),
            LinkColor       = Color.FromArgb(114, 118, 125),
            ActiveLinkColor = Color.FromArgb(91, 110, 245),
            LinkBehavior    = LinkBehavior.HoverUnderline,
        };
        if (!string.IsNullOrEmpty(url))
            l.LinkClicked += (s, e) => TryOpen(url);
        if (parent != null) parent.Controls.Add(l);
        return l;
    }
}

// ─────────────────────────────────────────────────────────────────────
// Entry point
// ─────────────────────────────────────────────────────────────────────

static class Program
{
    [System.Runtime.InteropServices.DllImport("user32.dll")]
    static extern bool SetProcessDPIAware();

    [STAThread]
    static void Main()
    {
        // Catch any managed UI-thread exception and show it instead of crashing
        Application.SetUnhandledExceptionMode(UnhandledExceptionMode.CatchException);
        Application.ThreadException += (s, ex) =>
        {
            try
            {
                File.WriteAllText(
                    Path.Combine(Path.GetTempPath(), "esharq_crash.txt"),
                    ex.Exception.ToString());
            }
            catch { }
            MessageBox.Show("خطأ:\n" + ex.Exception.Message,
                "Esharq", MessageBoxButtons.OK, MessageBoxIcon.Error);
        };

        try { SetProcessDPIAware(); } catch { }

        Logic.InitNetwork();
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        Application.Run(new InstallerForm());
    }
}
