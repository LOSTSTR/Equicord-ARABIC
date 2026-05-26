// Esharq Installer v2 — Native .NET 4 WinForms (860×580)
// Build: csc /nologo /target:winexe /platform:x86 /optimize+
//        /win32manifest:Esharq.manifest /win32icon:icon.ico
//        /reference:System.Windows.Forms.dll /reference:System.Drawing.dll
//        /out:EsharqSetup.exe Esharq-Installer.cs

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;
using System.Net;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Threading;
using System.Windows.Forms;

[assembly: AssemblyTitle("Esharq Installer")]
[assembly: AssemblyDescription("Esharq Discord Mod Installer")]
[assembly: AssemblyCompany("LOSTSTR")]
[assembly: AssemblyProduct("Esharq")]
[assembly: AssemblyCopyright("Copyright © 2026 LOSTSTR — GPL-3.0")]
[assembly: AssemblyVersion("1.14.13.0")]
[assembly: AssemblyFileVersion("1.14.13.0")]

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
// Logic  (pure static, no UI dependency)
// ─────────────────────────────────────────────────────────────────────

static class Logic
{
    const string RELEASE_API  = "https://api.github.com/repos/LOSTSTR/Esharq/releases/latest";
    const string UA           = "Esharq-Installer/1.14.13.0 (+https://github.com/LOSTSTR/Esharq)";
    const string ASAR         = "desktop.asar";
    const string OPENASAR_URL = "https://github.com/GooseMod/OpenAsar/releases/download/nightly/app.asar";

    public static void InitNetwork()
    {
        ServicePointManager.SecurityProtocol =
            (SecurityProtocolType)3072 |
            (SecurityProtocolType)12288;
        ServicePointManager.DefaultConnectionLimit = 4;
    }

    public static string DataDir
    {
        get
        {
            var env = Environment.GetEnvironmentVariable("EQUICORD_USER_DATA_DIR");
            if (!string.IsNullOrEmpty(env)) return env;
            return Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
                "Esharq");
        }
    }

    public static string AsarTarget { get { return Path.Combine(DataDir, "equicord.asar"); } }

    public static bool IsInstalled { get { return File.Exists(AsarTarget); } }

    public static List<DiscordInstall> FindDiscord()
    {
        var result  = new List<DiscordInstall>();
        var local   = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
        var names   = new[] { "Stable", "PTB", "Canary", "Development" };
        var folders = new[] { "Discord", "DiscordPTB", "DiscordCanary", "DiscordDevelopment" };

        for (int i = 0; i < names.Length; i++)
        {
            var baseDir = Path.Combine(local, folders[i]);
            if (!Directory.Exists(baseDir)) continue;
            string[] appDirs;
            try { appDirs = Directory.GetDirectories(baseDir, "app-*"); }
            catch { continue; }
            if (appDirs.Length == 0) continue;
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
        return result;
    }

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
        req.Timeout           = 30000;
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
            var procName    = Path.GetFileName(discordRoot);
            foreach (var p in Process.GetProcessesByName(procName))
                try { p.Kill(); p.WaitForExit(3000); } catch { }
            Thread.Sleep(800);
        }
        catch { }
    }

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
// RoundButton
// ─────────────────────────────────────────────────────────────────────

sealed class RoundButton : Button
{
    int _r;
    public int Radius { get { return _r; } set { _r = value; Invalidate(); } }

    public RoundButton()
    {
        _r = 6;
        FlatStyle = FlatStyle.Flat;
        FlatAppearance.BorderSize = 0;
        Cursor = Cursors.Hand;
    }

    protected override void OnPaint(PaintEventArgs e)
    {
        var g    = e.Graphics;
        var rect = ClientRectangle;
        if (rect.Width < 4 || rect.Height < 4) { base.OnPaint(e); return; }

        g.SmoothingMode = SmoothingMode.AntiAlias;

        // Erase corners using parent color — FillRectangle is safer than g.Clear()
        Color parentBG = (Parent != null && Parent.BackColor != Color.Transparent)
            ? Parent.BackColor : BackColor;
        using (var b = new SolidBrush(parentBG))
            g.FillRectangle(b, rect);

        int d = Math.Max(2, Math.Min(_r * 2, Math.Min(rect.Width, rect.Height)));
        using (var gp = new GraphicsPath())
        {
            gp.AddArc(rect.Left,          rect.Top,            d, d, 180, 90);
            gp.AddArc(rect.Right  - d,    rect.Top,            d, d, 270, 90);
            gp.AddArc(rect.Right  - d,    rect.Bottom - d,     d, d,   0, 90);
            gp.AddArc(rect.Left,          rect.Bottom - d,     d, d,  90, 90);
            gp.CloseFigure();
            using (var b = new SolidBrush(BackColor)) g.FillPath(b, gp);
        }
        var sf = new StringFormat
        {
            Alignment     = StringAlignment.Center,
            LineAlignment = StringAlignment.Center,
        };
        using (var b = new SolidBrush(ForeColor))
            g.DrawString(Text, Font, b, (RectangleF)rect, sf);
    }
}

// ─────────────────────────────────────────────────────────────────────
// ThinProgress
// ─────────────────────────────────────────────────────────────────────

sealed class ThinProgress : Control
{
    int   _val;
    Color _fill;

    public int Value
    {
        get { return _val; }
        set { _val = Math.Max(0, Math.Min(100, value)); Invalidate(); }
    }

    public Color FillColor
    {
        get { return _fill; }
        set { _fill = value; Invalidate(); }
    }

    public ThinProgress() { _fill = Color.FromArgb(59, 165, 93); }

    protected override void OnPaint(PaintEventArgs e)
    {
        if (Width <= 0 || Height <= 0) return;
        using (var b = new SolidBrush(BackColor))
            e.Graphics.FillRectangle(b, 0, 0, Width, Height);
        if (_val <= 0) return;
        float w = Width * _val / 100f;
        if (w < 1f) return;
        using (var b = new SolidBrush(_fill))
            e.Graphics.FillRectangle(b, 0, 0, w, Height);
    }
}

// ─────────────────────────────────────────────────────────────────────
// DiscordCard  — panel with rounded border, highlights when selected
// ─────────────────────────────────────────────────────────────────────

sealed class DiscordCard : Panel
{
    static readonly Color C_NORMAL   = Color.FromArgb(37,  43,  59);
    static readonly Color C_SELECTED = Color.FromArgb(88, 101, 242);
    static readonly Color C_DISABLED = Color.FromArgb(28,  32,  44);

    bool _selected;
    bool _available;

    public bool CardSelected
    {
        get { return _selected; }
        set { _selected = value; Invalidate(); }
    }

    public bool Available { get { return _available; } }

    public DiscordCard(bool available)
    {
        _available = available;
        _selected  = false;
        DoubleBuffered = true;
    }

    protected override void OnPaint(PaintEventArgs e)
    {
        base.OnPaint(e);
        if (Width < 20 || Height < 20) return;
        var g = e.Graphics;
        g.SmoothingMode = SmoothingMode.AntiAlias;
        var r   = new Rectangle(1, 1, Width - 2, Height - 2);
        int d   = Math.Min(14, Math.Min(r.Width / 2, r.Height / 2));
        if (d < 2) return;
        var col = !_available ? C_DISABLED : _selected ? C_SELECTED : C_NORMAL;
        using (var gp = new GraphicsPath())
        {
            gp.AddArc(r.Left,          r.Top,           d, d, 180, 90);
            gp.AddArc(r.Right - d,     r.Top,           d, d, 270, 90);
            gp.AddArc(r.Right - d,     r.Bottom - d,    d, d,   0, 90);
            gp.AddArc(r.Left,          r.Bottom - d,    d, d,  90, 90);
            gp.CloseFigure();
            using (var pen = new Pen(col, _selected ? 1.5f : 1f))
                g.DrawPath(pen, gp);
        }
    }
}

// ─────────────────────────────────────────────────────────────────────
// InstallerForm  — main window
//
// Layout (ClientSize = 860×580):
//   y=  0  Header panel         h=56
//   y= 56  Separator            h= 1
//   y= 72  Picker label
//   y=104  Discord cards        h=96  (two side-by-side)
//   y=216  Custom path row      h=28
//   y=258  Inline path info     h=36  (two lines)
//   y=304  Primary button       h=52
//   y=364  Progress bar         h= 4
//   y=372  Status label         h=20
//   y=402  Separator            h= 1
//   y=410  Support strip        h=36
//   y=452  Advanced panel       h=52  (hidden by default)
//   y=543  Footer separator     h= 1
//   y=544  Footer               h=36
// ─────────────────────────────────────────────────────────────────────

sealed class InstallerForm : Form
{
    // Palette
    static readonly Color BG          = Color.FromArgb( 15,  17,  23);
    static readonly Color SURFACE     = Color.FromArgb( 23,  27,  36);
    static readonly Color SURFACE2    = Color.FromArgb( 29,  34,  49);
    static readonly Color BORDER      = Color.FromArgb( 37,  43,  59);
    static readonly Color ACCENT      = Color.FromArgb( 88, 101, 242);
    static readonly Color SUCCESS     = Color.FromArgb( 59, 165,  93);
    static readonly Color DANGER      = Color.FromArgb(237,  66,  69);
    static readonly Color TEXT_PRI    = Color.FromArgb(242, 243, 245);
    static readonly Color TEXT_SEC    = Color.FromArgb(185, 187, 190);
    static readonly Color TEXT_MUTED  = Color.FromArgb(114, 118, 125);

    const string DISCORD_URL = "https://discord.gg/QamdqDNEDa";
    const string GITHUB_URL  = "https://github.com/LOSTSTR/Esharq";
    const string VER         = "1.14.13.0";

    // State
    Label                _lblStatus, _lblPath, _lblLocalVer, _lblLatestVer;
    ThinProgress         _prog;
    RoundButton          _btnPrimary, _btnRepair, _btnOpenAsar;
    Button               _btnRemove, _btnToggleAdv;
    Panel                _pnlAdvanced;
    bool                 _advExpanded;
    List<DiscordCard>    _cards    = new List<DiscordCard>();
    List<RadioButton>    _radios   = new List<RadioButton>();
    List<DiscordInstall> _installs = new List<DiscordInstall>();
    RadioButton          _rbCustom;
    TextBox              _txtCustom;

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
        DoubleBuffered  = true;
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
        var hdr = new Panel
        {
            Location  = new Point(0, 0),
            Size      = new Size(860, 56),
            BackColor = SURFACE,
        };
        Controls.Add(hdr);

        // Logo glyph
        hdr.Controls.Add(Lbl("✦", 22, 15, ACCENT, 14f, FontStyle.Bold, hdr));

        // App name
        hdr.Controls.Add(Lbl("Esharq", 44, 15, TEXT_PRI, 14f, FontStyle.Bold, hdr));

        // Version
        hdr.Controls.Add(Lbl("v" + VER, 116, 21, TEXT_MUTED, 9f, FontStyle.Regular, hdr));

        // Discord support link (Variation A — ambient header link)
        var lnkDis = MakeLink("💬 دعم", 654, 19, 9f, hdr);
        lnkDis.LinkClicked += (s, e) => TryOpen(DISCORD_URL);
        hdr.Controls.Add(lnkDis);

        hdr.Controls.Add(Lbl("·", 700, 19, TEXT_MUTED, 9f, FontStyle.Regular, hdr));

        var lnkGit = MakeLink("GitHub", 712, 19, 9f, hdr);
        lnkGit.LinkClicked += (s, e) => TryOpen(GITHUB_URL);
        hdr.Controls.Add(lnkGit);

        // Separator
        Controls.Add(new Panel
        {
            Location  = new Point(0, 56),
            Size      = new Size(860, 1),
            BackColor = BORDER,
        });
    }

    // ── Discord version picker (y=72..244) ───────────────────────────

    void BuildDiscordPicker()
    {
        Controls.Add(Lbl("اختر نسخة Discord للتعديل عليها",
            24, 72, TEXT_SEC, 11f, FontStyle.Bold));

        _installs = Logic.FindDiscord();

        // Pad to 2 slots for card display
        var display = new List<DiscordInstall>(_installs);
        while (display.Count < 2) display.Add(null);

        int cardW = 400, cardH = 96, cardY = 104;
        int[] xs  = { 24, 436 };
        var fallbackNames = new[] { "Discord Stable", "PTB / Canary" };

        for (int i = 0; i < 2; i++)
        {
            var   inst  = display[i];
            bool  avail = inst != null;
            int   xi    = xs[i];

            var card = new DiscordCard(avail)
            {
                Location  = new Point(xi, cardY),
                Size      = new Size(cardW, cardH),
                BackColor = avail ? SURFACE : Color.FromArgb(19, 22, 31),
                Cursor    = avail ? Cursors.Hand : Cursors.Default,
            };

            var rb = new RadioButton
            {
                Text      = avail ? inst.Name : fallbackNames[i],
                Location  = new Point(14, 12),
                AutoSize  = true,
                ForeColor = avail ? TEXT_PRI   : TEXT_MUTED,
                BackColor = Color.Transparent,
                Font      = new Font("Segoe UI", 11f, FontStyle.Bold),
                Enabled   = avail,
                Tag       = inst,
            };
            card.Controls.Add(rb);
            _radios.Add(rb);

            if (avail)
            {
                var short_ = inst.DisplayPath.Length > 50
                    ? "..." + inst.DisplayPath.Substring(inst.DisplayPath.Length - 47)
                    : inst.DisplayPath;
                card.Controls.Add(Lbl(short_, 36, 38, TEXT_MUTED, 9f,
                    FontStyle.Regular, card, cardW - 52, 18));

                var statusText = inst.IsPatched ? "✓ Esharq مُثبَّت" : "✓ الأكثر استقراراً";
                var statusCol  = inst.IsPatched ? SUCCESS : TEXT_MUTED;
                card.Controls.Add(Lbl(statusText, 36, 60, statusCol, 9f,
                    FontStyle.Regular, card));
            }
            else
            {
                card.Controls.Add(Lbl("غير مثبَّتة على هذا الجهاز",
                    36, 38, TEXT_MUTED, 9f, FontStyle.Regular, card));
            }

            // Clicking anywhere on the card selects the radio
            int ci = i;
            EventHandler selectCard = (s, e) =>
            {
                if (!_cards[ci].Available) return;
                _radios[ci].Checked = true;
            };
            card.Click += selectCard;
            foreach (Control c in card.Controls) c.Click += selectCard;

            int ji = i;
            rb.CheckedChanged += (s, e) =>
            {
                for (int k = 0; k < _cards.Count; k++)
                    _cards[k].CardSelected = _radios[k].Checked;
                if (rb.Checked && _rbCustom != null) _rbCustom.Checked = false;
                UpdatePrimaryButton();
            };

            Controls.Add(card);
            _cards.Add(card);
        }

        // Select first available card
        for (int i = 0; i < _radios.Count; i++)
        {
            if (_radios[i].Enabled)
            {
                _radios[i].Checked     = true;
                _cards[i].CardSelected = true;
                break;
            }
        }

        // Custom path row (y=216)
        int customY = cardY + cardH + 16;

        _rbCustom = new RadioButton
        {
            Text      = "مسار تثبيت مخصص",
            Location  = new Point(28, customY + 4),
            AutoSize  = true,
            ForeColor = TEXT_SEC,
            BackColor = Color.Transparent,
            Font      = new Font("Segoe UI", 10f),
            Cursor    = Cursors.Hand,
        };
        Controls.Add(_rbCustom);

        _txtCustom = new TextBox
        {
            Location    = new Point(204, customY),
            Size        = new Size(540, 28),
            BackColor   = SURFACE,
            ForeColor   = TEXT_MUTED,
            BorderStyle = BorderStyle.FixedSingle,
            Font        = new Font("Segoe UI", 9f),
            Text        = "مجلد resources الخاص بـ Discord",
            Enabled     = false,
        };
        Controls.Add(_txtCustom);

        var btnBrowse = new Button
        {
            Text      = "استعراض",
            Location  = new Point(752, customY),
            Size      = new Size(84, 28),
            BackColor = SURFACE2,
            ForeColor = TEXT_SEC,
            FlatStyle = FlatStyle.Flat,
            Font      = new Font("Segoe UI", 9f),
            Enabled   = false,
            Cursor    = Cursors.Hand,
        };
        btnBrowse.FlatAppearance.BorderColor = BORDER;
        Controls.Add(btnBrowse);

        _rbCustom.CheckedChanged += (s, e) =>
        {
            bool on = _rbCustom.Checked;
            _txtCustom.Enabled   = on;
            _txtCustom.ForeColor = on ? TEXT_PRI : TEXT_MUTED;
            btnBrowse.Enabled    = on;
            if (on)
            {
                for (int i = 0; i < _cards.Count; i++)
                {
                    _radios[i].Checked     = false;
                    _cards[i].CardSelected = false;
                }
            }
            UpdatePrimaryButton();
        };

        btnBrowse.Click += (s, e) =>
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

    // ── Inline path row (y=258..294) ─────────────────────────────────

    void BuildPathRow()
    {
        const int y = 258;

        Controls.Add(Lbl("📦", 24, y, TEXT_MUTED, 9f));

        _lblPath = Lbl("يُثبَّت في: " + ShortenPath(Logic.AsarTarget),
            44, y, TEXT_MUTED, 9f);
        Controls.Add(_lblPath);

        var lnkOpen = MakeLink("فتح ↗", 752, y, 9f);
        lnkOpen.LinkClicked += (s, e) =>
        {
            Directory.CreateDirectory(Logic.DataDir);
            Process.Start("explorer.exe", Logic.DataDir);
        };
        Controls.Add(lnkOpen);

        _lblLocalVer = Lbl("الإصدار المحلي: —", 44, y + 20, TEXT_MUTED, 9f);
        Controls.Add(_lblLocalVer);

        _lblLatestVer = Lbl("·  آخر إصدار: جارٍ الجلب...", 200, y + 20, TEXT_MUTED, 9f);
        Controls.Add(_lblLatestVer);
    }

    // ── Primary action + progress (y=304..392) ───────────────────────

    void BuildPrimaryAction()
    {
        _btnPrimary = new RoundButton
        {
            Text      = "تثبيت Esharq",
            Location  = new Point(24, 304),
            Size      = new Size(812, 52),
            BackColor = SUCCESS,
            ForeColor = Color.White,
            Radius    = 8,
            Font      = new Font("Segoe UI", 13f, FontStyle.Bold),
        };
        _btnPrimary.Click += OnPrimaryClick;
        Controls.Add(_btnPrimary);

        _prog = new ThinProgress
        {
            Location  = new Point(24, 364),
            Size      = new Size(812, 4),
            BackColor = SURFACE,
            FillColor = SUCCESS,
        };
        Controls.Add(_prog);

        _lblStatus = new Label
        {
            Text      = "اختر نسخة Discord ثم اضغط تثبيت",
            Location  = new Point(24, 372),
            Size      = new Size(812, 20),
            ForeColor = TEXT_MUTED,
            BackColor = Color.Transparent,
            Font      = new Font("Segoe UI", 9f),
        };
        Controls.Add(_lblStatus);
    }

    // ── Support strip + advanced toggle (y=402..446) ─────────────────

    void BuildSupportStrip()
    {
        // Horizontal divider
        Controls.Add(new Panel
        {
            Location  = new Point(24, 402),
            Size      = new Size(812, 1),
            BackColor = BORDER,
        });

        // Strip container (Variation B — left-border contextual)
        var strip = new Panel
        {
            Location  = new Point(24, 410),
            Size      = new Size(812, 36),
            BackColor = BG,
        };
        Controls.Add(strip);

        // 3px left accent border
        strip.Controls.Add(new Panel
        {
            Location  = new Point(0, 0),
            Size      = new Size(3, 36),
            BackColor = ACCENT,
        });

        var lnkSupport = MakeLink("واجهت مشكلة؟  انضم للدعم على Discord  ↗", 12, 9, 9f, strip);
        lnkSupport.LinkClicked += (s, e) => TryOpen(DISCORD_URL);
        strip.Controls.Add(lnkSupport);

        // Advanced toggle (right-aligned in strip)
        _btnToggleAdv = new Button
        {
            Text      = "خيارات متقدمة  ▾",
            Location  = new Point(626, 5),
            Size      = new Size(182, 26),
            BackColor = BG,
            ForeColor = TEXT_MUTED,
            FlatStyle = FlatStyle.Flat,
            Font      = new Font("Segoe UI", 9f),
            Cursor    = Cursors.Hand,
        };
        _btnToggleAdv.FlatAppearance.BorderSize = 0;
        _btnToggleAdv.Click += ToggleAdvanced;
        strip.Controls.Add(_btnToggleAdv);
    }

    // ── Advanced panel (y=452, hidden by default) ─────────────────────

    void BuildAdvancedPanel()
    {
        _pnlAdvanced = new Panel
        {
            Location  = new Point(24, 452),
            Size      = new Size(812, 52),
            BackColor = BG,
            Visible   = false,
        };
        Controls.Add(_pnlAdvanced);

        _btnRepair = new RoundButton
        {
            Text      = "↺  إصلاح / إعادة التثبيت",
            Location  = new Point(0, 0),
            Size      = new Size(264, 44),
            BackColor = SURFACE2,
            ForeColor = TEXT_SEC,
            Radius    = 6,
            Font      = new Font("Segoe UI", 10f),
        };
        _btnRepair.FlatAppearance.BorderColor = BORDER;
        _btnRepair.FlatAppearance.BorderSize  = 1;
        _btnRepair.Click += OnRepair;
        _pnlAdvanced.Controls.Add(_btnRepair);

        _btnOpenAsar = new RoundButton
        {
            Text      = "⚙  تثبيت OpenAsar",
            Location  = new Point(276, 0),
            Size      = new Size(264, 44),
            BackColor = SURFACE2,
            ForeColor = TEXT_SEC,
            Radius    = 6,
            Font      = new Font("Segoe UI", 10f),
        };
        _btnOpenAsar.FlatAppearance.BorderColor = BORDER;
        _btnOpenAsar.FlatAppearance.BorderSize  = 1;
        _btnOpenAsar.Click += OnOpenAsar;
        _pnlAdvanced.Controls.Add(_btnOpenAsar);

        // Danger — text-only, no fill
        _btnRemove = new Button
        {
            Text      = "إزالة التثبيت",
            Location  = new Point(588, 9),
            Size      = new Size(224, 28),
            BackColor = BG,
            ForeColor = DANGER,
            FlatStyle = FlatStyle.Flat,
            Font      = new Font("Segoe UI", 9f),
            Cursor    = Cursors.Hand,
            TextAlign = ContentAlignment.MiddleRight,
        };
        _btnRemove.FlatAppearance.BorderSize = 0;
        _btnRemove.Click += OnRemove;
        _pnlAdvanced.Controls.Add(_btnRemove);
    }

    // ── Footer (y=543..580) ───────────────────────────────────────────

    void BuildFooter()
    {
        Controls.Add(new Panel
        {
            Location  = new Point(0, 543),
            Size      = new Size(860, 1),
            BackColor = BORDER,
        });

        var ft = new Panel
        {
            Location  = new Point(0, 544),
            Size      = new Size(860, 36),
            BackColor = SURFACE,
        };
        Controls.Add(ft);

        ft.Controls.Add(Lbl(
            "⚠ التحميل الرسمي فقط من LOSTSTR/Esharq على GitHub  ·  GPL-3.0",
            20, 0, TEXT_MUTED, 8.5f, FontStyle.Regular, ft, 600, 36));

        ft.Controls.Add(Lbl("Esharq 2026  ·  LOSTSTR",
            636, 0, TEXT_MUTED, 8.5f, FontStyle.Regular, ft, 204, 36,
            ContentAlignment.MiddleRight));
    }

    // ── State-aware button ────────────────────────────────────────────

    void UpdatePrimaryButton()
    {
        if (Logic.IsInstalled)
        {
            _btnPrimary.Text      = "تحديث / إعادة تثبيت Esharq";
            _btnPrimary.BackColor = ACCENT;
        }
        else
        {
            _btnPrimary.Text      = "تثبيت Esharq";
            _btnPrimary.BackColor = SUCCESS;
        }
        _btnPrimary.Invalidate();
    }

    // ── Advanced toggle ───────────────────────────────────────────────

    void ToggleAdvanced(object sender, EventArgs e)
    {
        _advExpanded           = !_advExpanded;
        _pnlAdvanced.Visible   = _advExpanded;
        _btnToggleAdv.Text     = _advExpanded ? "خيارات متقدمة  ▲" : "خيارات متقدمة  ▾";
    }

    // ── Shown ─────────────────────────────────────────────────────────

    void OnShown(object sender, EventArgs e)
    {
        UpdatePrimaryButton();
        _lblLocalVer.Text  = "الإصدار المحلي: " + Logic.LocalVersion();

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
        if (!TryGetTarget(out target)) return;
        if (!ConfirmKill(target)) return;
        RunAsync(() => Logic.Install(target, s => Msg(s), v => Prog(v)));
    }

    void OnRepair(object sender, EventArgs e)
    {
        string target;
        if (!TryGetTarget(out target)) return;
        if (!ConfirmKill(target)) return;
        RunAsync(() => Logic.Install(target, s => Msg(s), v => Prog(v)));
    }

    void OnRemove(object sender, EventArgs e)
    {
        string target;
        if (!TryGetTarget(out target)) return;
        var r = MessageBox.Show(this,
            "هل تريد إزالة Esharq بالكامل؟",
            "تأكيد الإزالة", MessageBoxButtons.YesNo, MessageBoxIcon.Question);
        if (r != DialogResult.Yes) return;
        if (!ConfirmKill(target)) return;
        RunAsync(() => Logic.Uninstall(target, s => Msg(s), v => Prog(v)));
    }

    void OnOpenAsar(object sender, EventArgs e)
    {
        string target;
        if (!TryGetTarget(out target)) return;
        if (!ConfirmKill(target)) return;
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
            if (_rbCustom.Checked)
            {
                var p = _txtCustom.Text.Trim();
                if (string.IsNullOrEmpty(p) || !Directory.Exists(p))
                    throw new Exception("المسار المخصص غير صحيح أو غير موجود");
                path = p;
                return true;
            }
            var inst = SelectedInstall();
            if (inst == null)
                throw new Exception("الرجاء اختيار نسخة Discord أولاً");
            path = inst.ResourcesPath;
            return true;
        }
        catch (Exception ex) { Msg("✖ " + ex.Message); return false; }
    }

    bool ConfirmKill(string resourcesPath)
    {
        try
        {
            var root = Path.GetDirectoryName(Path.GetDirectoryName(resourcesPath));
            var name = Path.GetFileName(root);
            if (Process.GetProcessesByName(name).Length == 0) return true;
            var r = MessageBox.Show(this,
                "Discord يعمل حالياً وسيتم إغلاقه.\nهل تريد المتابعة؟",
                "تنبيه", MessageBoxButtons.YesNo, MessageBoxIcon.Warning);
            return r == DialogResult.Yes;
        }
        catch { return true; }
    }

    void RunAsync(Action op)
    {
        Busy(true); Prog(0);
        var t = new Thread(() =>
        {
            try { op(); }
            catch (Exception ex) { Msg("✖ خطأ: " + ex.Message); Prog(0); }
            finally
            {
                if (!IsDisposed) SafeInvoke(() =>
                {
                    Busy(false);
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
        SafeInvoke(() => { _lblStatus.Text = text; Application.DoEvents(); });
    }

    void Prog(int v)
    {
        SafeInvoke(() => { _prog.Value = v; Application.DoEvents(); });
    }

    void Busy(bool on)
    {
        _btnPrimary.Enabled  = !on;
        _btnRepair.Enabled   = !on;
        _btnOpenAsar.Enabled = !on;
        _btnRemove.Enabled   = !on;
        UseWaitCursor        = on;
    }

    void SafeInvoke(Action a)
    {
        if (IsDisposed) return;
        try { if (InvokeRequired) Invoke(a); else a(); }
        catch { }
    }

    static string ShortenPath(string path)
    {
        var roaming = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
        if (path.StartsWith(roaming, StringComparison.OrdinalIgnoreCase))
            return "Roaming" + path.Substring(roaming.Length);
        return path.Length > 60 ? "..." + path.Substring(path.Length - 57) : path;
    }

    static void TryOpen(string url)
    {
        try { Process.Start(new ProcessStartInfo(url) { UseShellExecute = true }); }
        catch { }
    }

    // ── Control factory helpers ───────────────────────────────────────

    static Label Lbl(string text, int x, int y, Color col, float fs,
        FontStyle st = FontStyle.Regular, Control parent = null,
        int w = 0, int h = 0, ContentAlignment align = ContentAlignment.TopLeft)
    {
        var l = new Label
        {
            Text      = text,
            Location  = new Point(x, y),
            ForeColor = col,
            BackColor = Color.Transparent,
            Font      = new Font("Segoe UI", fs, st),
            TextAlign = align,
        };
        if (w > 0 && h > 0) { l.Size = new Size(w, h); }
        else                 { l.AutoSize = true; }
        if (parent != null) parent.Controls.Add(l);
        return l;
    }

    static LinkLabel MakeLink(string text, int x, int y, float fs,
        Control parent = null)
    {
        var l = new LinkLabel
        {
            Text            = text,
            Location        = new Point(x, y),
            AutoSize        = true,
            ForeColor       = Color.FromArgb(114, 118, 125),
            BackColor       = Color.Transparent,
            Font            = new Font("Segoe UI", fs),
            LinkColor       = Color.FromArgb(114, 118, 125),
            ActiveLinkColor = Color.FromArgb(88, 101, 242),
            LinkBehavior    = LinkBehavior.HoverUnderline,
        };
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
        try { SetProcessDPIAware(); } catch { }
        Logic.InitNetwork();
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        Application.Run(new InstallerForm());
    }
}
