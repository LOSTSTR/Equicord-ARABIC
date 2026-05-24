// Esharq Installer — Native .NET 4.8 WinForms
// Copyright (c) 2026 LOSTSTR — GPL-3.0
// Build: csc.exe /target:winexe /win32manifest:Esharq.manifest /win32icon:icon.ico
//
// WHY native C# instead of ps2exe:
//   ps2exe embeds a known wrapper that AV vendors signature-match (convagent/msil).
//   A directly compiled WinForms EXE has no such signature.
//   requestedExecutionLevel=asInvoker avoids UAC-trigger heuristics.
//   Discord installs to %LOCALAPPDATA% — admin is never needed.

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

// Assembly metadata — important for SmartScreen reputation and AV trust scoring
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
    public string Label;
}

// ─────────────────────────────────────────────────────────────────────
// Installer logic  (pure static, no UI dependency)
// ─────────────────────────────────────────────────────────────────────

static class Logic
{
    const string RELEASE_API  = "https://api.github.com/repos/LOSTSTR/Esharq/releases/latest";
    const string UA           = "Esharq-Installer/1.14.13.0 (+https://github.com/LOSTSTR/Esharq)";
    const string ASAR         = "desktop.asar";
    const string OPENASAR_URL = "https://github.com/GooseMod/OpenAsar/releases/download/nightly/app.asar";

    // Called once at startup — sets TLS 1.2 globally
    public static void InitNetwork()
    {
        ServicePointManager.SecurityProtocol =
            (SecurityProtocolType)3072 |   // TLS 1.2
            (SecurityProtocolType)12288;   // TLS 1.3 (if available)
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

    // ── Discord detection ────────────────────────────────────────────

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

            bool patched = File.Exists(Path.Combine(res, ASAR));
            result.Add(new DiscordInstall
            {
                Name          = names[i],
                ResourcesPath = res,
                IsPatched     = patched,
                Label         = string.Format("{0} — {1}{2}",
                    names[i], baseDir, patched ? " [مُثبَّت]" : ""),
            });
        }
        return result;
    }

    // ── Version info ────────────────────────────────────────────────

    public static string LatestTag()
    {
        try
        {
            using (var wc = MakeClient())
            {
                var json = wc.DownloadString(RELEASE_API);
                var m    = Regex.Match(json, "\"tag_name\"\\s*:\\s*\"([^\"]+)\"");
                return m.Success ? m.Groups[1].Value : "غير متاح";
            }
        }
        catch { return "غير متاح"; }
    }

    public static string LocalVersion(string resourcesPath)
    {
        var f = Path.Combine(resourcesPath, ASAR);
        if (!File.Exists(f)) return "لا يوجد";
        try { return File.GetLastWriteTime(f).ToString("yyyy-MM-dd"); }
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

    // ── Process management ───────────────────────────────────────────

    public static void KillDiscord(string resourcesPath)
    {
        try
        {
            // Walk up: resources → app-x.x.x → Discord/DiscordPTB/...
            var discordRoot = Path.GetDirectoryName(Path.GetDirectoryName(resourcesPath));
            var procName    = Path.GetFileName(discordRoot);
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

        status(string.Format("تحميل {0} — {1} ({2:F1} MB)", ASAR, tag, sz / 1048576.0));
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

        status("نسخ الملف إلى مجلد الموارد...");
        progress(80);

        KillDiscord(res);
        File.Copy(tmp, Path.Combine(res, ASAR), true);
        File.Copy(tmp, AsarTarget, true);
        try { File.Delete(tmp); } catch { }

        progress(100);
        status("✔ تم التثبيت — أعد تشغيل Discord لتفعيل Esharq");
    }

    public static void Uninstall(string res, Action<string> status, Action<int> progress)
    {
        status("جارٍ الإزالة...");
        progress(30);

        KillDiscord(res);
        var f = Path.Combine(res, ASAR);
        if (File.Exists(f)) File.Delete(f);

        progress(80);
        if (File.Exists(AsarTarget)) File.Delete(AsarTarget);

        progress(100);
        status("✔ تمت الإزالة — أعد تشغيل Discord");
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

        status("نسخ OpenAsar...");
        progress(97);
        File.Copy(tmp, Path.Combine(res, "app.asar"), true);
        try { File.Delete(tmp); } catch { }

        progress(100);
        status("✔ تم تثبيت OpenAsar — أعد تشغيل Discord");
    }

    static WebClient MakeClient()
    {
        var wc = new WebClient();
        wc.Headers[HttpRequestHeader.UserAgent] = UA;
        return wc;
    }
}

// ─────────────────────────────────────────────────────────────────────
// RoundedButton — simple flat button with rounded corners
// (no suspicious custom rendering patterns — just basic GDI+)
// ─────────────────────────────────────────────────────────────────────

sealed class RoundButton : Button
{
    int _r;
    public int Radius { get { return _r; } set { _r = value; Invalidate(); } }

    public RoundButton() { _r = 6; FlatStyle = FlatStyle.Flat; FlatAppearance.BorderSize = 0; }

    protected override void OnPaint(PaintEventArgs e)
    {
        var g = e.Graphics;
        g.SmoothingMode = SmoothingMode.AntiAlias;
        g.Clear(Parent != null ? Parent.BackColor : BackColor);

        var r  = ClientRectangle;
        int d  = Math.Min(_r * 2, Math.Min(r.Width, r.Height));
        var gp = new GraphicsPath();
        gp.AddArc(r.Left, r.Top, d, d, 180, 90);
        gp.AddArc(r.Right - d, r.Top, d, d, 270, 90);
        gp.AddArc(r.Right - d, r.Bottom - d, d, d, 0, 90);
        gp.AddArc(r.Left, r.Bottom - d, d, d, 90, 90);
        gp.CloseFigure();

        using (var b = new SolidBrush(BackColor))   g.FillPath(b, gp);
        var sf = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center };
        using (var b = new SolidBrush(ForeColor))   g.DrawString(Text, Font, b, r, sf);
        gp.Dispose();
    }
}

// ─────────────────────────────────────────────────────────────────────
// Thin progress bar
// ─────────────────────────────────────────────────────────────────────

sealed class ThinProgress : Control
{
    int _val;
    public int Value
    {
        get { return _val; }
        set { _val = Math.Max(0, Math.Min(100, value)); Invalidate(); }
    }
    public Color FillColor { get; set; }

    public ThinProgress() { FillColor = Color.FromArgb(67, 181, 73); }

    protected override void OnPaint(PaintEventArgs e)
    {
        e.Graphics.Clear(BackColor);
        if (_val <= 0) return;
        float w = Width * _val / 100f;
        using (var b = new SolidBrush(FillColor))
            e.Graphics.FillRectangle(b, 0, 0, w, Height);
    }
}

// ─────────────────────────────────────────────────────────────────────
// Main installer form — Equilotl-style dark UI
// ─────────────────────────────────────────────────────────────────────

sealed class InstallerForm : Form
{
    // Palette (matches original Equilotl design)
    static readonly Color BG      = Color.FromArgb( 30,  31,  34);
    static readonly Color PANEL   = Color.FromArgb( 40,  41,  45);
    static readonly Color FG      = Color.FromArgb(220, 221, 222);
    static readonly Color MUTED   = Color.FromArgb(148, 155, 164);
    static readonly Color WARN_BG = Color.FromArgb(250, 210,  50);
    static readonly Color WARN_FG = Color.FromArgb( 20,  20,  20);
    static readonly Color GREEN   = Color.FromArgb( 67, 181,  73);
    static readonly Color BLUE    = Color.FromArgb( 88, 101, 242);
    static readonly Color RED     = Color.FromArgb(237,  66,  69);
    static readonly Color LINK    = Color.FromArgb(100, 149, 237);

    const string VER = "1.14.13.0";

    Label         _lblLocal, _lblLatest, _lblStatus;
    ThinProgress  _prog;
    List<RadioButton>     _radios   = new List<RadioButton>();
    List<DiscordInstall>  _installs = new List<DiscordInstall>();
    RadioButton   _rbCustom;
    TextBox       _txtCustom;
    RoundButton   _btnInstall, _btnRepair, _btnRemove, _btnOpenAsar;

    public InstallerForm()
    {
        SuspendLayout();
        Build();
        ResumeLayout(true);
    }

    // ── UI construction ──────────────────────────────────────────────

    void Build()
    {
        Text            = "Esharq";
        ClientSize      = new Size(1200, 700);
        MinimumSize     = new Size(1200, 722);
        MaximumSize     = new Size(1200, 722);
        BackColor       = BG;
        StartPosition   = FormStartPosition.CenterScreen;
        FormBorderStyle = FormBorderStyle.FixedSingle;
        MaximizeBox     = false;
        Font            = new Font("Segoe UI", 11f);

        try
        {
            var ico = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "icon.ico");
            if (File.Exists(ico)) Icon = new Icon(ico);
        }
        catch { }

        // ── Title ─────────────────────────────────────────────────
        var title = new Label
        {
            Text      = "Esharq",
            Location  = new Point(0, 24),
            Size      = new Size(1200, 60),
            ForeColor = FG,
            BackColor = Color.Transparent,
            Font      = new Font("Segoe UI", 28f, FontStyle.Bold),
            TextAlign = ContentAlignment.MiddleCenter,
        };
        Controls.Add(title);

        // ── Info section ──────────────────────────────────────────
        int infoY = 90;

        var pathLbl = FL("📁  سيتم تنزيل Esharq إلى: " + Logic.AsarTarget, 48, infoY, MUTED, 10f);

        var btnDir = Btn("فتح المجلد", LINK, Color.White,
            new Point(pathLbl.Right + 10, infoY - 2), new Size(100, 26), 5);
        btnDir.Font = new Font("Segoe UI", 9f);
        btnDir.Click += (s, e) =>
        {
            Directory.CreateDirectory(Logic.DataDir);
            Process.Start("explorer.exe", Logic.DataDir);
        };

        FL("لتخصيص المسار: قم بتعيين متغير البيئة 'EQUICORD_USER_DATA_DIR' ثم أعد تشغيل المثبت",
            48, infoY + 28, MUTED, 10f);

        FL("إصدار المثبت: v" + VER, 48, infoY + 62, MUTED, 10f);

        _lblLocal  = FL("الإصدار المحلي: جارٍ الفحص...",   48, infoY + 90,  MUTED, 10f);
        _lblLatest = FL("آخر إصدار: جارٍ الجلب...",        48, infoY + 118, MUTED, 10f);

        // ── Warning box ───────────────────────────────────────────
        int warnY = 240;
        var warnPnl = new Panel
        {
            Location  = new Point(48, warnY),
            Size      = new Size(1104, 90),
            BackColor = WARN_BG,
        };
        Controls.Add(warnPnl);
        warnPnl.Controls.Add(new Label
        {
            Text      = "⚠  هام جداً  —  GitHub ومستودع LOSTSTR/Esharq هما المصدران الرسميان الوحيدان للحصول على Esharq.\r\nأي مصدر آخر يُعتبر ضاراً — احذف كل شيء وأجرِ فحصاً للبرامج الضارة وغيّر كلمة مرور Discord.",
            Location  = new Point(12, 10),
            Size      = new Size(1080, 70),
            ForeColor = WARN_FG,
            BackColor = Color.Transparent,
            Font      = new Font("Segoe UI", 11f),
        });

        // ── Discord version picker ────────────────────────────────
        int selY = warnY + 102;
        FL("الرجاء اختيار نسخة Discord للتعديل عليها", 48, selY, FG, 13f, FontStyle.Bold);

        _installs = Logic.FindDiscord();
        int ry = selY + 36;

        foreach (var inst in _installs)
        {
            var rb = new RadioButton
            {
                Text      = inst.Label,
                Tag       = inst,
                Location  = new Point(56, ry),
                AutoSize  = true,
                ForeColor = FG,
                BackColor = Color.Transparent,
                Font      = new Font("Segoe UI", 11f),
                Cursor    = Cursors.Hand,
            };
            Controls.Add(rb);
            _radios.Add(rb);
            ry += 30;
        }
        if (_radios.Count > 0)
            _radios[0].Checked = true;
        else
        {
            FL("⚠  لم يُعثر على أي نسخة من Discord مثبتة على هذا الجهاز", 56, ry, MUTED, 10f);
            ry += 28;
        }

        _rbCustom = new RadioButton
        {
            Text      = "مسار تثبيت مخصص",
            Location  = new Point(56, ry + 8),
            AutoSize  = true,
            ForeColor = FG,
            BackColor = Color.Transparent,
            Font      = new Font("Segoe UI", 11f),
            Cursor    = Cursors.Hand,
        };
        Controls.Add(_rbCustom);

        _txtCustom = new TextBox
        {
            Location    = new Point(48, ry + 44),
            Size        = new Size(1104, 34),
            BackColor   = PANEL,
            ForeColor   = MUTED,
            BorderStyle = BorderStyle.FixedSingle,
            Font        = new Font("Segoe UI", 11f),
            Text        = "المسار المخصص (مجلد resources الخاص بـ Discord)",
            Enabled     = false,
        };
        Controls.Add(_txtCustom);
        _rbCustom.CheckedChanged += (s, e) =>
        {
            _txtCustom.Enabled   = _rbCustom.Checked;
            _txtCustom.ForeColor = _rbCustom.Checked ? FG : MUTED;
        };

        // ── Status & progress bar ─────────────────────────────────
        int stY = 572;
        _lblStatus = new Label
        {
            Text      = "اختر نسخة Discord ثم اضغط على أحد الأزرار",
            Location  = new Point(48, stY),
            Size      = new Size(1104, 26),
            ForeColor = MUTED,
            BackColor = Color.Transparent,
            Font      = new Font("Segoe UI", 10f),
        };
        Controls.Add(_lblStatus);

        _prog = new ThinProgress
        {
            Location  = new Point(48, stY + 30),
            Size      = new Size(1104, 4),
            BackColor = PANEL,
            FillColor = GREEN,
        };
        Controls.Add(_prog);

        // separator
        Controls.Add(new Panel { Location = new Point(48, stY + 40), Size = new Size(1104, 1), BackColor = PANEL });

        // ── Action buttons ────────────────────────────────────────
        int bY = 614, bW = 264, bH = 50, gap = 8;

        _btnInstall = Btn("تثبيت", GREEN,  Color.White,              new Point(48, bY),                new Size(bW, bH), 8);
        _btnRepair  = Btn("إعادة التثبيت / الإصلاح", BLUE, Color.White, new Point(48 + bW + gap, bY),   new Size(bW, bH), 8);
        _btnRemove  = Btn("إزالة التثبيت",  RED,   Color.White,      new Point(48 + (bW+gap)*2, bY),  new Size(bW, bH), 8);
        _btnOpenAsar= Btn("تثبيت OpenAsar", GREEN, Color.White,       new Point(48 + (bW+gap)*3, bY),  new Size(bW, bH), 8);

        foreach (var b in new[] { _btnInstall, _btnRepair, _btnRemove, _btnOpenAsar })
            b.Font = new Font("Segoe UI", 12f, FontStyle.Bold);

        // ── Footer ────────────────────────────────────────────────
        var ft = new Panel { Location = new Point(0, 668), Size = new Size(1200, 32), BackColor = PANEL };
        Controls.Add(ft);
        ft.Controls.Add(new Label
        {
            Text      = "LOSTSTR • krym511 • RAYMOND♮ • Abo Ahmed • S99 • iosiph • .fmo   —   Esharq 2026 • GPL-3.0",
            Location  = new Point(12, 0),
            Size      = new Size(680, 32),
            ForeColor = MUTED,
            BackColor = Color.Transparent,
            Font      = new Font("Segoe UI", 9f),
            TextAlign = ContentAlignment.MiddleLeft,
        });
        var discordLink = new LinkLabel
        {
            Text            = "⚠ هام — للدعم الفني انضم للديسكورد",
            Location        = new Point(692, 0),
            Size            = new Size(230, 32),
            ForeColor       = WARN_BG,
            BackColor       = Color.Transparent,
            Font            = new Font("Segoe UI", 9f, FontStyle.Bold),
            TextAlign       = ContentAlignment.MiddleCenter,
            LinkColor       = WARN_BG,
            ActiveLinkColor = Color.White,
            LinkBehavior    = LinkBehavior.HoverUnderline,
        };
        discordLink.LinkClicked += (s, e) => TryOpen("https://discord.gg/QamdqDNEDa");
        ft.Controls.Add(discordLink);
        var ftLink = new LinkLabel
        {
            Text            = "LOSTSTR/Esharq on GitHub",
            Location        = new Point(924, 0),
            Size            = new Size(264, 32),
            ForeColor       = LINK,
            BackColor       = Color.Transparent,
            Font            = new Font("Segoe UI", 9f),
            TextAlign       = ContentAlignment.MiddleRight,
            LinkColor       = LINK,
            ActiveLinkColor = Color.White,
            LinkBehavior    = LinkBehavior.HoverUnderline,
        };
        ftLink.LinkClicked += (s, e) => TryOpen("https://github.com/LOSTSTR/Esharq");
        ft.Controls.Add(ftLink);

        // Events
        _btnInstall.Click  += OnInstall;
        _btnRepair.Click   += OnRepair;
        _btnRemove.Click   += OnRemove;
        _btnOpenAsar.Click += OnOpenAsar;
        Shown += OnShown;
    }

    // ── Shown: async version fetch ───────────────────────────────────

    void OnShown(object sender, EventArgs e)
    {
        var sel = Selected();
        _lblLocal.Text = "الإصدار المحلي: " +
            (sel != null ? Logic.LocalVersion(sel.ResourcesPath) : "لا يوجد");

        var t = new Thread(() =>
        {
            var tag = Logic.LatestTag();
            SafeInvoke(() => _lblLatest.Text = "آخر إصدار: " + tag);
        });
        t.IsBackground = true;
        t.Start();
    }

    // ── Button handlers ──────────────────────────────────────────────

    void OnInstall(object sender, EventArgs e)
    {
        string target; if (!TryGetTarget(out target)) return;
        if (!ConfirmKill(target)) return;
        RunAsync(() => Logic.Install(target, s => Msg(s), v => Prog(v)));
    }

    void OnRepair(object sender, EventArgs e)
    {
        string target; if (!TryGetTarget(out target)) return;
        if (!ConfirmKill(target)) return;
        RunAsync(() => Logic.Install(target, s => Msg(s), v => Prog(v)));
    }

    void OnRemove(object sender, EventArgs e)
    {
        string target; if (!TryGetTarget(out target)) return;
        var r = MessageBox.Show(this,
            "هل تريد إزالة Esharq بالكامل؟",
            "تأكيد الإزالة", MessageBoxButtons.YesNo, MessageBoxIcon.Question);
        if (r != DialogResult.Yes) return;
        if (!ConfirmKill(target)) return;
        RunAsync(() => Logic.Uninstall(target, s => Msg(s), v => Prog(v)));
    }

    void OnOpenAsar(object sender, EventArgs e)
    {
        string target; if (!TryGetTarget(out target)) return;
        if (!ConfirmKill(target)) return;
        RunAsync(() => Logic.InstallOpenAsar(target, s => Msg(s), v => Prog(v)));
    }

    // ── Helpers ──────────────────────────────────────────────────────

    DiscordInstall Selected()
    {
        foreach (var rb in _radios) if (rb.Checked) return rb.Tag as DiscordInstall;
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
                path = p; return true;
            }
            var inst = Selected();
            if (inst == null) throw new Exception("لم تختر أي نسخة من Discord");
            path = inst.ResourcesPath; return true;
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
                "Discord يعمل حالياً وسيتم إغلاقه تلقائياً.\nهل تريد المتابعة؟",
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
                    RefreshInstalls();
                });
            }
        });
        t.IsBackground = true;
        t.Start();
    }

    void RefreshInstalls()
    {
        _installs = Logic.FindDiscord();
        for (int i = 0; i < _radios.Count && i < _installs.Count; i++)
        { _radios[i].Text = _installs[i].Label; _radios[i].Tag = _installs[i]; }
        var sel = Selected();
        _lblLocal.Text = "الإصدار المحلي: " +
            (sel != null ? Logic.LocalVersion(sel.ResourcesPath) : "لا يوجد");
    }

    void Msg(string text, Color? col = null)
    {
        SafeInvoke(() =>
        {
            _lblStatus.ForeColor = col ?? FG;
            _lblStatus.Text = text;
            Application.DoEvents();
        });
    }

    void Prog(int v)
    {
        SafeInvoke(() => { _prog.Value = v; Application.DoEvents(); });
    }

    void Busy(bool on)
    {
        _btnInstall.Enabled = _btnRepair.Enabled =
        _btnRemove.Enabled  = _btnOpenAsar.Enabled = !on;
        UseWaitCursor = on;
    }

    void SafeInvoke(Action a)
    {
        if (IsDisposed) return;
        try { if (InvokeRequired) Invoke(a); else a(); }
        catch { }
    }

    static void TryOpen(string url)
    {
        try { Process.Start(new ProcessStartInfo(url) { UseShellExecute = true }); } catch { }
    }

    // ── Control factory helpers ──────────────────────────────────────

    Label FL(string text, int x, int y, Color col, float fs = 11f, FontStyle st = FontStyle.Regular)
    {
        var l = new Label
        {
            Text = text, Location = new Point(x, y), ForeColor = col,
            BackColor = Color.Transparent, Font = new Font("Segoe UI", fs, st), AutoSize = true,
        };
        Controls.Add(l);
        return l;
    }

    RoundButton Btn(string text, Color bg, Color fg, Point loc, Size sz, int r)
    {
        var b = new RoundButton
        {
            Text = text, Location = loc, Size = sz, BackColor = bg, ForeColor = fg,
            Radius = r, Cursor = Cursors.Hand,
        };
        Controls.Add(b);
        return b;
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
