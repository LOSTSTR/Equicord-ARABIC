// Esharq Installer — Native C# WinForms — CrimsonNight Theme
// Copyright (c) 2026 LOSTSTR — GPL-3.0
// No ps2exe wrapper: compiled directly with csc.exe

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Text;
using System.IO;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading;
using System.Windows.Forms;

// ══════════════════════════════════════════════════════════════════════
// Custom Controls
// ══════════════════════════════════════════════════════════════════════

public class GradientLabel : Control
{
    public Color GradientStart { get; set; }
    public Color GradientEnd   { get; set; }

    public GradientLabel()
    {
        SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint |
                 ControlStyles.DoubleBuffer | ControlStyles.SupportsTransparentBackColor, true);
        BackColor = Color.Transparent;
    }

    protected override void OnPaint(PaintEventArgs e)
    {
        if (string.IsNullOrEmpty(Text)) return;
        var g = e.Graphics;
        g.SmoothingMode     = SmoothingMode.AntiAlias;
        g.TextRenderingHint = TextRenderingHint.AntiAlias;
        int[] alphas  = { 8, 18, 30, 44, 58 };
        int[] offsets = { 4,  3,  2,  1,  1 };
        var sf = new StringFormat();
        sf.Alignment     = StringAlignment.Center;
        sf.LineAlignment = StringAlignment.Center;
        for (int i = 0; i < alphas.Length; i++)
            using (var b = new SolidBrush(Color.FromArgb(alphas[i], 0, 0, 0)))
                g.DrawString(Text, Font, b, new RectangleF(offsets[i], offsets[i], Width, Height), sf);
        var rect = new RectangleF(0, 0, Width, Height);
        int w = Width == 0 ? 1 : Width, h = Height == 0 ? 1 : Height;
        using (var gb = new LinearGradientBrush(new Rectangle(0, 0, w, h), GradientStart, GradientEnd, LinearGradientMode.Horizontal))
            g.DrawString(Text, Font, gb, rect, sf);
    }

    protected override void OnResize(EventArgs e) { base.OnResize(e); Invalidate(); }
}

public class GlowButton : Button
{
    private bool _h, _dn;
    private int  _cr;
    public Color HoverColor  { get; set; }
    public Color GlowColor   { get; set; }
    public Color FormColor   { get; set; }
    public int   CornerRadius { get { return _cr; } set { _cr = value; } }

    public GlowButton()
    {
        _cr = 8;
        SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.DoubleBuffer, true);
        FlatStyle = FlatStyle.Flat;
        FlatAppearance.BorderSize = 0;
    }

    private GraphicsPath RndPath(Rectangle r)
    {
        int d = Math.Min(_cr * 2, Math.Min(r.Width, r.Height));
        var gp = new GraphicsPath();
        gp.AddArc(r.Left,       r.Top,        d, d, 180, 90);
        gp.AddArc(r.Right  - d, r.Top,        d, d, 270, 90);
        gp.AddArc(r.Right  - d, r.Bottom - d, d, d,   0, 90);
        gp.AddArc(r.Left,       r.Bottom - d, d, d,  90, 90);
        gp.CloseFigure();
        return gp;
    }

    protected override void OnPaint(PaintEventArgs pe)
    {
        var g = pe.Graphics;
        g.SmoothingMode = SmoothingMode.AntiAlias;
        g.Clear(FormColor == Color.Empty ? Color.FromArgb(11, 11, 16) : FormColor);
        var r = ClientRectangle;
        var col = _dn
            ? Color.FromArgb(Math.Max(0, GlowColor.R - 20), Math.Max(0, GlowColor.G - 20), Math.Max(0, GlowColor.B - 20))
            : _h ? HoverColor : BackColor;
        if (_h || _dn)
        {
            int[] a = { 8, 22, 42 }, pad = { 3, 2, 1 };
            for (int i = 0; i < 3; i++)
                using (var b = new SolidBrush(Color.FromArgb(a[i], GlowColor)))
                using (var p = RndPath(Rectangle.Inflate(r, pad[i], pad[i])))
                    g.FillPath(b, p);
        }
        using (var p = RndPath(r))
        using (var b = new SolidBrush(col))
            g.FillPath(b, p);
        var sf = new StringFormat();
        sf.Alignment = StringAlignment.Center; sf.LineAlignment = StringAlignment.Center;
        using (var b = new SolidBrush(ForeColor))
            g.DrawString(Text, Font, b, r, sf);
    }

    protected override void OnMouseEnter(EventArgs e)      { _h  = true;  Invalidate(); base.OnMouseEnter(e); }
    protected override void OnMouseLeave(EventArgs e)      { _h  = false; Invalidate(); base.OnMouseLeave(e); }
    protected override void OnMouseDown(MouseEventArgs e)  { _dn = true;  Invalidate(); base.OnMouseDown(e); }
    protected override void OnMouseUp(MouseEventArgs e)    { _dn = false; Invalidate(); base.OnMouseUp(e); }
}

public class CapsuleProgress : Control
{
    private int _val;
    public int Progress
    {
        get { return _val; }
        set { _val = Math.Max(0, Math.Min(100, value)); Invalidate(); }
    }
    public Color TrackColor { get; set; }
    public Color FillStart  { get; set; }
    public Color FillEnd    { get; set; }

    public CapsuleProgress()
    {
        SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.DoubleBuffer, true);
    }

    private GraphicsPath Capsule(RectangleF r)
    {
        var gp = new GraphicsPath();
        gp.AddArc(r.Left,          r.Top, r.Height, r.Height,  90, 180);
        gp.AddArc(r.Right - r.Height, r.Top, r.Height, r.Height, 270, 180);
        gp.CloseFigure();
        return gp;
    }

    protected override void OnPaint(PaintEventArgs e)
    {
        var g = e.Graphics;
        g.SmoothingMode = SmoothingMode.AntiAlias;
        using (var b = new SolidBrush(TrackColor))
        using (var p = Capsule(new RectangleF(0, 0, Width, Height)))
            g.FillPath(b, p);
        if (_val > 0)
        {
            float fw = Math.Max(Height, (Width - Height) * _val / 100f + Height);
            int ifw = (int)fw == 0 ? 1 : (int)fw;
            using (var gb = new LinearGradientBrush(new Rectangle(0, 0, ifw, Height == 0 ? 1 : Height), FillStart, FillEnd, LinearGradientMode.Horizontal))
            using (var p = Capsule(new RectangleF(0, 0, fw, Height)))
                g.FillPath(gb, p);
        }
    }
}

// ══════════════════════════════════════════════════════════════════════
// Data Model
// ══════════════════════════════════════════════════════════════════════

public class DiscordInstall
{
    public string Label;
    public string Name;
    public string ResourcesPath;
    public bool   IsPatched;
}

// ══════════════════════════════════════════════════════════════════════
// Installer Logic
// ══════════════════════════════════════════════════════════════════════

public static class Logic
{
    const string RELEASE_API   = "https://api.github.com/repos/LOSTSTR/Esharq/releases/latest";
    const string USER_AGENT    = "Esharq-Installer/2.0.0 (+https://github.com/LOSTSTR/Esharq)";
    const string ASAR_NAME     = "desktop.asar";
    const string OPENASAR_URL  = "https://github.com/GooseMod/OpenAsar/releases/download/nightly/app.asar";

    public static string DataDir
    {
        get
        {
            var e = Environment.GetEnvironmentVariable("EQUICORD_USER_DATA_DIR");
            return string.IsNullOrEmpty(e)
                ? Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "Esharq")
                : e;
        }
    }
    public static string AsarTarget { get { return Path.Combine(DataDir, ASAR_NAME); } }

    public static List<DiscordInstall> GetInstalls()
    {
        var list  = new List<DiscordInstall>();
        var local = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
        string[] names = { "Stable", "PTB", "Canary", "Development" };
        string[] dirs  = { "Discord", "DiscordPTB", "DiscordCanary", "DiscordDevelopment" };
        for (int i = 0; i < names.Length; i++)
        {
            var baseDir = Path.Combine(local, dirs[i]);
            if (!Directory.Exists(baseDir)) continue;
            string[] appDirs;
            try { appDirs = Directory.GetDirectories(baseDir, "app-*"); }
            catch { continue; }
            if (appDirs.Length == 0) continue;
            Array.Sort(appDirs);
            var res = Path.Combine(appDirs[appDirs.Length - 1], "resources");
            if (!Directory.Exists(res)) continue;
            bool patched = File.Exists(Path.Combine(res, ASAR_NAME));
            list.Add(new DiscordInstall
            {
                Name          = names[i],
                ResourcesPath = res,
                IsPatched     = patched,
                Label         = string.Format("{0} — {1}{2}", names[i], baseDir, patched ? "  ✔ مُثبَّت" : ""),
            });
        }
        return list;
    }

    public static string GetLatestTag()
    {
        try
        {
            var req = CreateReq(RELEASE_API);
            using (var resp = req.GetResponse())
            using (var sr = new StreamReader(resp.GetResponseStream()))
            {
                var m = Regex.Match(sr.ReadToEnd(), "\"tag_name\"\\s*:\\s*\"([^\"]+)\"");
                return m.Success ? m.Groups[1].Value : "غير متاح";
            }
        }
        catch { return "غير متاح"; }
    }

    public static string GetAsarUrl(out string tag, out long size)
    {
        tag = ""; size = 0;
        try
        {
            var req = CreateReq(RELEASE_API);
            using (var resp = req.GetResponse())
            using (var sr = new StreamReader(resp.GetResponseStream()))
            {
                var json = sr.ReadToEnd();
                var tm = Regex.Match(json, "\"tag_name\"\\s*:\\s*\"([^\"]+)\"");
                if (tm.Success) tag = tm.Groups[1].Value;
                var am = Regex.Match(json, "\"assets\"\\s*:\\s*\\[([\\s\\S]+?)\\]");
                if (!am.Success) return null;
                foreach (Match bm in Regex.Matches(am.Groups[1].Value, "\\{[^{}]+\\}"))
                {
                    var nm = Regex.Match(bm.Value, "\"name\"\\s*:\\s*\"([^\"]+)\"");
                    if (!nm.Success || nm.Groups[1].Value != ASAR_NAME) continue;
                    var um = Regex.Match(bm.Value, "\"browser_download_url\"\\s*:\\s*\"([^\"]+)\"");
                    var sm = Regex.Match(bm.Value, "\"size\"\\s*:\\s*(\\d+)");
                    if (um.Success) { if (sm.Success) long.TryParse(sm.Groups[1].Value, out size); return um.Groups[1].Value; }
                }
            }
        }
        catch { }
        return null;
    }

    public static string GetLocalVer(string res)
    {
        var p = Path.Combine(res, ASAR_NAME);
        if (!File.Exists(p)) return "لا يوجد";
        try { return File.GetLastWriteTime(p).ToString("yyyy-MM-dd"); }
        catch { return "مثبَّت"; }
    }

    public static void Download(string url, string dest, Action<int, long, long> onProgress)
    {
        var req = CreateReq(url);
        using (var resp = req.GetResponse())
        using (var rs = resp.GetResponseStream())
        using (var fs = File.Create(dest))
        {
            long total = resp.ContentLength, done = 0;
            var buf = new byte[65536];
            int n;
            while ((n = rs.Read(buf, 0, buf.Length)) > 0)
            {
                fs.Write(buf, 0, n);
                done += n;
                if (total > 0 && onProgress != null)
                    onProgress((int)(done * 100 / total), done, total);
            }
        }
    }

    public static void StopDiscord(string res)
    {
        try
        {
            var name = Path.GetFileName(Path.GetDirectoryName(Path.GetDirectoryName(res)));
            foreach (var p in Process.GetProcessesByName(name))
                try { p.Kill(); } catch { }
            Thread.Sleep(1200);
        }
        catch { }
    }

    public static bool ConfirmStop(string res, IWin32Window owner)
    {
        try
        {
            var name = Path.GetFileName(Path.GetDirectoryName(Path.GetDirectoryName(res)));
            if (Process.GetProcessesByName(name).Length == 0) return true;
            var r = MessageBox.Show(owner,
                "Discord يعمل حالياً وسيتم إغلاقه تلقائياً لإتمام العملية.\nهل تريد المتابعة؟",
                "تنبيه — Discord قيد التشغيل",
                MessageBoxButtons.YesNo, MessageBoxIcon.Warning);
            if (r != DialogResult.Yes) return false;
            StopDiscord(res);
        }
        catch { }
        return true;
    }

    public static void Install(string res, Action<string> st, Action<int> pr)
    {
        st("جارٍ جلب معلومات آخر إصدار...");
        pr(5);
        string tag; long sz;
        var url = GetAsarUrl(out tag, out sz);
        if (string.IsNullOrEmpty(url)) throw new Exception("لم يُعثر على ملف " + ASAR_NAME);
        st(string.Format("تحميل {0} — {1} ({2:F1} MB)", ASAR_NAME, tag, sz / 1048576.0));
        pr(10);
        Directory.CreateDirectory(DataDir);
        var tmp = Path.Combine(Path.GetTempPath(), "esharq_" + Guid.NewGuid().ToString("N") + ".asar");
        Download(url, tmp, (p, dl, tot) =>
        {
            st(string.Format("تحميل: {0:F1}/{1:F1} MB  ({2}%)", dl / 1048576.0, tot / 1048576.0, p));
            pr(10 + (int)(p * 0.65));
        });
        st("نسخ الملف إلى مجلد الموارد...");
        pr(80);
        StopDiscord(res);
        File.Copy(tmp, Path.Combine(res, ASAR_NAME), true);
        File.Copy(tmp, AsarTarget, true);
        try { File.Delete(tmp); } catch { }
        pr(100);
        st("✔ تم التثبيت — أعد تشغيل Discord لتفعيل Esharq");
    }

    public static void Uninstall(string res, Action<string> st, Action<int> pr)
    {
        st("جارٍ الإزالة...");
        pr(50);
        var f = Path.Combine(res, ASAR_NAME);
        if (File.Exists(f)) File.Delete(f);
        if (File.Exists(AsarTarget)) File.Delete(AsarTarget);
        pr(100);
        st("✔ تمت الإزالة — أعد تشغيل Discord");
    }

    public static void InstallOpenAsar(string res, Action<string> st, Action<int> pr)
    {
        st("جارٍ إغلاق Discord...");
        pr(5);
        StopDiscord(res);
        st("جارٍ تنزيل OpenAsar...");
        pr(10);
        var tmp = Path.Combine(Path.GetTempPath(), "openasar_" + Guid.NewGuid().ToString("N") + ".asar");
        Download(OPENASAR_URL, tmp, (p, dl, tot) => pr(10 + (int)(p * 0.85)));
        st("نسخ OpenAsar...");
        pr(97);
        File.Copy(tmp, Path.Combine(res, "app.asar"), true);
        try { File.Delete(tmp); } catch { }
        pr(100);
        st("✔ تم تثبيت OpenAsar — أعد تشغيل Discord");
    }

    static HttpWebRequest CreateReq(string url)
    {
        ServicePointManager.SecurityProtocol = (System.Net.SecurityProtocolType)3072; // TLS 1.2
        var req = (HttpWebRequest)WebRequest.Create(url);
        req.UserAgent       = USER_AGENT;
        req.AllowAutoRedirect = true;
        return req;
    }
}

// ══════════════════════════════════════════════════════════════════════
// Main Form
// ══════════════════════════════════════════════════════════════════════

public class InstallerForm : Form
{
    const string VER         = "2.0.0";
    const string SUPPORT_URL = "https://discord.gg/QamdqDNEDa";
    const string GITHUB_URL  = "https://github.com/LOSTSTR/Esharq";

    // CrimsonNight palette
    static readonly Color BG_DARK     = Color.FromArgb( 11,  11,  16);
    static readonly Color BG_PANEL    = Color.FromArgb( 22,  22,  32);
    static readonly Color BG_HEADER   = Color.FromArgb( 15,   5,  10);
    static readonly Color ACCENT      = Color.FromArgb(224,  34,  68);
    static readonly Color ACCENT2     = Color.FromArgb(192,  38, 211);
    static readonly Color ACCENT3     = Color.FromArgb(235,  69, 158);
    static readonly Color FG_WHITE    = Color.FromArgb(220, 200, 205);
    static readonly Color FG_MUTED    = Color.FromArgb(120,  90,  98);
    static readonly Color FG_DIM      = Color.FromArgb( 60,  35,  42);
    static readonly Color WARN_BG     = Color.FromArgb( 28,   8,  12);
    static readonly Color WARN_FG     = Color.FromArgb(220, 100, 120);
    static readonly Color WARN_BORDER = Color.FromArgb(100,  20,  35);
    static readonly Color BTN_INSTALL = Color.FromArgb(224,  34,  68);
    static readonly Color BTN_DARK    = Color.FromArgb( 30,  30,  46);
    static readonly Color BTN_DISCORD = Color.FromArgb( 88, 101, 242);
    static readonly Color SUCCESS_CLR = Color.FromArgb( 87, 242, 135);
    static readonly Color ERROR_CLR   = Color.FromArgb(237,  66,  69);

    Label         _lblLocalVer, _lblLatestVer, _lblStatus;
    CapsuleProgress _progBar;
    List<RadioButton> _radios = new List<RadioButton>();
    List<DiscordInstall> _installs;
    RadioButton   _rbCustom;
    TextBox       _txtCustom;
    GlowButton    _btnInstall, _btnRepair, _btnRemove, _btnOpenSar;
    Panel         _header;

    const int PAD  = 48;
    const int BODY = 92;

    public InstallerForm()
    {
        SuspendLayout();
        BuildUI();
        ResumeLayout(true);
    }

    void BuildUI()
    {
        Text            = "Esharq";
        ClientSize      = new Size(1200, 700);
        MinimumSize     = new Size(1200, 722);
        MaximumSize     = new Size(1200, 722);
        StartPosition   = FormStartPosition.CenterScreen;
        BackColor       = BG_DARK;
        FormBorderStyle = FormBorderStyle.FixedSingle;
        MaximizeBox     = false;
        Font            = new Font("Segoe UI", 11f);
        try
        {
            var ico = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "icon.ico");
            if (File.Exists(ico)) Icon = new Icon(ico);
        }
        catch { }

        // ── Accent bar (4px top gradient) ─────────────────────────
        var bar = new Panel { Location = Point.Empty, Size = new Size(1200, 4) };
        bar.Paint += (s, e) =>
        {
            using (var gr = new LinearGradientBrush(bar.ClientRectangle, ACCENT, ACCENT3, LinearGradientMode.Horizontal))
                e.Graphics.FillRectangle(gr, bar.ClientRectangle);
        };
        Controls.Add(bar);

        // ── Header ─────────────────────────────────────────────────
        _header = new Panel { Location = new Point(0, 4), Size = new Size(1200, 86), BackColor = BG_HEADER };
        _header.Paint += (s, e) =>
        {
            var g = e.Graphics;
            var pts = new PointF[] { new PointF(1140,0), new PointF(1200,0), new PointF(1200,86), new PointF(1140,86) };
            using (var pgb = new PathGradientBrush(pts))
            {
                pgb.CenterPoint    = new PointF(1200, 0);
                pgb.CenterColor    = Color.FromArgb(40, 224, 34, 68);
                pgb.SurroundColors = new Color[] { Color.FromArgb(0, 224, 34, 68) };
                g.FillRectangle(pgb, 1060, 0, 140, 86);
            }
            using (var pen = new Pen(Color.FromArgb(60, 224, 34, 68), 1))
                g.DrawLine(pen, 0, 85, 1200, 85);
        };
        Controls.Add(_header);

        var title = new GradientLabel
        {
            Text          = "Esharq",
            GradientStart = ACCENT,
            GradientEnd   = ACCENT2,
            Location      = new Point(0, 0),
            Size          = new Size(400, 86),
            Font          = new Font("Segoe UI", 30f, FontStyle.Bold),
            BackColor     = Color.Transparent,
        };
        _header.Controls.Add(title);

        _lblLocalVer  = HdrLbl("الإصدار المحلي: جارٍ الفحص...", 14, FG_MUTED);
        _lblLatestVer = HdrLbl("آخر إصدار: جارٍ الجلب...",     36, FG_MUTED);
        var lblInst   = HdrLbl("إصدار المثبت: v" + VER,               58, FG_DIM);

        // ── Body ───────────────────────────────────────────────────
        int infoY = BODY + 6;
        var pathLbl = BodyLbl("📁  سيتم تنزيل Esharq إلى: " + Logic.AsarTarget,
            PAD, infoY, FG_MUTED, 10f);

        var btnDir = GBtn("فتح المجلد",
            Color.FromArgb(40,15,22), ACCENT, ACCENT,
            new Point(pathLbl.Right + 12, infoY - 2), new Size(110, 28), 6);
        btnDir.Font = new Font("Segoe UI", 9f);
        btnDir.Click += (s, e) => { Directory.CreateDirectory(Logic.DataDir); Process.Start("explorer.exe", Logic.DataDir); };

        BodyLbl("لتخصيص المسار: قم بتعيين متغير البيئة 'EQUICORD_USER_DATA_DIR' ثم أعد تشغيل المثبت",
            PAD, infoY + 30, FG_DIM, 10f);

        // Discord join button
        var btnDsc = GBtn(
            "🎮  انضم إلى سيرفر الدعم العربي على Discord",
            BTN_DISCORD, Color.FromArgb(110,125,255), BTN_DISCORD,
            new Point(PAD, infoY + 58), new Size(500, 38), 10);
        btnDsc.ForeColor = Color.White;
        btnDsc.Font = new Font("Segoe UI", 11f, FontStyle.Bold);
        btnDsc.Click += (s, e) => Process.Start(SUPPORT_URL);

        // Warning box
        int warnY = BODY + 108;
        var wp = new Panel { Location = new Point(PAD, warnY), Size = new Size(1104, 78), BackColor = WARN_BG };
        wp.Paint += (s, e) =>
        {
            using (var pen = new Pen(WARN_BORDER, 1))
                e.Graphics.DrawRectangle(pen, 0, 0, wp.Width - 1, wp.Height - 1);
            e.Graphics.FillRectangle(Brushes.Firebrick, wp.Width - 4, 0, 4, wp.Height);
        };
        Controls.Add(wp);
        wp.Controls.Add(new Label
        {
            Text      = "⚠  هام جداً  —  GitHub ومستودع LOSTSTR/Esharq هما المصدران الرسميان الوحيدان للحصول على Esharq.\r\nأي مصدر آخر يُعتبر ضاراً — احذف كل شيء وأجرِ فحصاً للبرامج الضارة وغيّر كلمة مرور Discord.",
            Location  = new Point(14, 10),
            Size      = new Size(1076, 58),
            ForeColor = WARN_FG,
            BackColor = Color.Transparent,
            Font      = new Font("Segoe UI", 11f),
        });

        // Discord version picker
        int selY = warnY + 88;
        BodyLbl("الرجاء اختيار نسخة Discord للتعديل عليها", PAD, selY, FG_WHITE, 13f, FontStyle.Bold);

        _installs = Logic.GetInstalls();
        int ry = selY + 36;
        foreach (var inst in _installs)
        {
            var rb = new RadioButton
            {
                Text      = inst.Label,
                Tag       = inst,
                Location  = new Point(56, ry),
                AutoSize  = true,
                ForeColor = FG_WHITE,
                BackColor = Color.Transparent,
                Font      = new Font("Segoe UI", 11f),
                Cursor    = Cursors.Hand,
            };
            Controls.Add(rb);
            _radios.Add(rb);
            ry += 30;
        }
        if (_radios.Count > 0) _radios[0].Checked = true;
        else { BodyLbl("⚠  لم يُعثر على أي نسخة من Discord", 56, ry, FG_MUTED, 10f); ry += 28; }

        _rbCustom = new RadioButton
        {
            Text = "مسار تثبيت مخصص",
            Location = new Point(56, ry + 8), AutoSize = true,
            ForeColor = FG_WHITE, BackColor = Color.Transparent,
            Font = new Font("Segoe UI", 11f), Cursor = Cursors.Hand,
        };
        Controls.Add(_rbCustom);

        _txtCustom = new TextBox
        {
            Location = new Point(PAD, ry + 44), Size = new Size(1104, 36),
            BackColor = BG_PANEL, ForeColor = FG_DIM,
            BorderStyle = BorderStyle.FixedSingle, Font = new Font("Segoe UI", 11f),
            Text = "المسار المخصص (مجلد resources الخاص بـ Discord)", Enabled = false,
        };
        Controls.Add(_txtCustom);
        _rbCustom.CheckedChanged += (s, e) =>
        {
            _txtCustom.Enabled = _rbCustom.Checked;
            _txtCustom.ForeColor = _rbCustom.Checked ? FG_WHITE : FG_DIM;
        };

        // Status & progress
        int stY = 572;
        _lblStatus = new Label
        {
            Text = "اختر نسخة Discord ثم اضغط على أحد الأزرار",
            Location = new Point(PAD, stY), Size = new Size(1104, 26),
            ForeColor = FG_MUTED, BackColor = Color.Transparent, Font = new Font("Segoe UI", 10f),
        };
        Controls.Add(_lblStatus);

        _progBar = new CapsuleProgress
        {
            Location = new Point(PAD, stY + 30), Size = new Size(1104, 6),
            TrackColor = Color.FromArgb(30, 10, 15), FillStart = ACCENT, FillEnd = ACCENT2,
        };
        Controls.Add(_progBar);

        Controls.Add(new Panel { Location = new Point(PAD, stY + 42), Size = new Size(1104, 1), BackColor = Color.FromArgb(40,15,22) });

        // Action buttons
        int bY = 614, bW = 264, bH = 50, bg = 8;
        _btnInstall = GBtn("تثبيت",      BTN_INSTALL, ACCENT,    ACCENT,    new Point(PAD, bY), new Size(bW, bH), 10);
        _btnInstall.ForeColor = Color.White; _btnInstall.Font = new Font("Segoe UI", 12f, FontStyle.Bold);

        _btnRepair  = GBtn("إعادة التثبيت / الإصلاح", BTN_DARK, ACCENT, ACCENT, new Point(PAD + bW + bg, bY), new Size(bW, bH), 10);
        _btnRepair.ForeColor  = Color.FromArgb(150,120,130); _btnRepair.Font  = new Font("Segoe UI", 12f, FontStyle.Bold);

        _btnRemove  = GBtn("إزالة التثبيت", BTN_DARK, ERROR_CLR, ERROR_CLR, new Point(PAD + (bW+bg)*2, bY), new Size(bW, bH), 10);
        _btnRemove.ForeColor  = Color.FromArgb(150,120,130); _btnRemove.Font  = new Font("Segoe UI", 12f, FontStyle.Bold);

        _btnOpenSar = GBtn("تثبيت OpenAsar", BTN_DARK, ACCENT,    ACCENT,    new Point(PAD + (bW+bg)*3, bY), new Size(bW, bH), 10);
        _btnOpenSar.ForeColor = Color.FromArgb(150,120,130); _btnOpenSar.Font = new Font("Segoe UI", 12f, FontStyle.Bold);

        // Footer
        var ft = new Panel { Location = new Point(0, 668), Size = new Size(1200, 32), BackColor = Color.FromArgb(8,5,8) };
        ft.Paint += (s, e) =>
        {
            using (var pen = new Pen(Color.FromArgb(40,15,22), 1))
                e.Graphics.DrawLine(pen, 0, 0, ft.Width, 0);
        };
        Controls.Add(ft);
        ft.Controls.Add(new Label
        {
            Text = "LOSTSTR • krym511 • 𝙁𝘰𝙈𝘼𝘾𝘽𝘳♞ • Abo Ahmed • S99 • iosiph • .fmo   —   Esharq 2026 • GPL-3.0",
            Location = new Point(12, 0), Size = new Size(800, 32),
            ForeColor = Color.FromArgb(55,30,38), BackColor = Color.Transparent, Font = new Font("Segoe UI", 9f),
            TextAlign = ContentAlignment.MiddleLeft,
        });
        var ftLink = new LinkLabel
        {
            Text = "LOSTSTR/Esharq", Location = new Point(900, 0), Size = new Size(280, 32),
            ForeColor = Color.FromArgb(100,30,50), BackColor = Color.Transparent, Font = new Font("Segoe UI", 9f),
            TextAlign = ContentAlignment.MiddleRight, LinkColor = Color.FromArgb(120,40,60),
            ActiveLinkColor = ACCENT, LinkBehavior = LinkBehavior.HoverUnderline,
        };
        ftLink.LinkClicked += (s, e) => Process.Start(GITHUB_URL);
        ft.Controls.Add(ftLink);

        // Events
        _btnInstall.Click  += OnInstall;
        _btnRepair.Click   += OnRepair;
        _btnRemove.Click   += OnRemove;
        _btnOpenSar.Click  += OnOpenAsar;
        Shown += OnShown;
    }

    void OnShown(object sender, EventArgs e)
    {
        var sel = Selected();
        _lblLocalVer.Text = "الإصدار المحلي: " +
            (sel != null ? Logic.GetLocalVer(sel.ResourcesPath) : "لا يوجد");
        var t = new Thread(() =>
        {
            var tag = Logic.GetLatestTag();
            if (!IsDisposed) try { Invoke(new Action(() =>
            {
                if (!IsDisposed) _lblLatestVer.Text = "آخر إصدار: " + tag;
            })); } catch { }
        });
        t.IsBackground = true; t.Start();
    }

    DiscordInstall Selected()
    {
        foreach (var rb in _radios) if (rb.Checked) return rb.Tag as DiscordInstall;
        return null;
    }

    string GetTarget()
    {
        if (_rbCustom.Checked)
        {
            var p = _txtCustom.Text.Trim();
            if (string.IsNullOrEmpty(p) || !Directory.Exists(p))
                throw new Exception("المسار المخصص غير صحيح أو غير موجود");
            return p;
        }
        var inst = Selected();
        if (inst == null) throw new Exception("لم تختر أي نسخة من Discord");
        return inst.ResourcesPath;
    }

    void Status(string msg, Color col)
    {
        if (InvokeRequired) { Invoke(new Action(() => Status(msg, col))); return; }
        _lblStatus.ForeColor = col; _lblStatus.Text = msg;
        Application.DoEvents();
    }

    void Progress(int v)
    {
        if (InvokeRequired) { Invoke(new Action(() => Progress(v))); return; }
        _progBar.Progress = v; Application.DoEvents();
    }

    void Busy(bool on)
    {
        _btnInstall.Enabled = _btnRepair.Enabled = _btnRemove.Enabled = _btnOpenSar.Enabled = !on;
        UseWaitCursor = on;
    }

    void RefreshUI()
    {
        _installs = Logic.GetInstalls();
        for (int i = 0; i < _radios.Count && i < _installs.Count; i++)
        { _radios[i].Text = _installs[i].Label; _radios[i].Tag = _installs[i]; }
    }

    void RunOp(Action op)
    {
        Busy(true); Progress(0);
        var t = new Thread(() =>
        {
            try { op(); }
            catch (Exception ex) { Status("✖ خطأ: " + ex.Message, ERROR_CLR); Progress(0); }
            finally { if (!IsDisposed) try { Invoke(new Action(() => { Busy(false); RefreshUI(); })); } catch { } }
        });
        t.IsBackground = true; t.Start();
    }

    void OnInstall(object sender, EventArgs e)
    {
        string target; try { target = GetTarget(); } catch (Exception ex) { Status("✖ " + ex.Message, ERROR_CLR); return; }
        if (!Logic.ConfirmStop(target, this)) return;
        RunOp(() => Logic.Install(target, m => Status(m, FG_WHITE), p => Progress(p)));
    }

    void OnRepair(object sender, EventArgs e)
    {
        string target; try { target = GetTarget(); } catch (Exception ex) { Status("✖ " + ex.Message, ERROR_CLR); return; }
        if (!Logic.ConfirmStop(target, this)) return;
        RunOp(() =>
        {
            Logic.Install(target, m => Status(m, FG_WHITE), p => Progress(p));
            Status("✔ تمت إعادة التثبيت — شغّل Discord مرة أخرى", SUCCESS_CLR);
        });
    }

    void OnRemove(object sender, EventArgs e)
    {
        string target; try { target = GetTarget(); } catch (Exception ex) { Status("✖ " + ex.Message, ERROR_CLR); return; }
        var ans = MessageBox.Show(this,
            "هل تريد إزالة Esharq بالكامل؟",
            "تأكيد الإزالة", MessageBoxButtons.YesNo, MessageBoxIcon.Question);
        if (ans != DialogResult.Yes) return;
        if (!Logic.ConfirmStop(target, this)) return;
        RunOp(() => Logic.Uninstall(target, m => Status(m, FG_WHITE), p => Progress(p)));
    }

    void OnOpenAsar(object sender, EventArgs e)
    {
        string target; try { target = GetTarget(); } catch (Exception ex) { Status("✖ " + ex.Message, ERROR_CLR); return; }
        if (!Logic.ConfirmStop(target, this)) return;
        RunOp(() => Logic.InstallOpenAsar(target, m => Status(m, FG_WHITE), p => Progress(p)));
    }

    // ── Helpers ───────────────────────────────────────────────────────
    Label HdrLbl(string text, int y, Color col)
    {
        var l = new Label
        {
            Text = text, Location = new Point(560, y), Size = new Size(620, 22),
            ForeColor = col, BackColor = Color.Transparent, Font = new Font("Segoe UI", 10f),
            TextAlign = ContentAlignment.MiddleRight,
        };
        _header.Controls.Add(l);
        return l;
    }

    Label BodyLbl(string text, int x, int y, Color col, float fs = 11f, FontStyle st = FontStyle.Regular)
    {
        var l = new Label
        {
            Text = text, Location = new Point(x, y), ForeColor = col,
            BackColor = Color.Transparent, Font = new Font("Segoe UI", fs, st), AutoSize = true,
        };
        Controls.Add(l);
        return l;
    }

    GlowButton GBtn(string text, Color bg, Color glow, Color hover, Point loc, Size sz, int cr)
    {
        var b = new GlowButton
        {
            Text = text, Location = loc, Size = sz, BackColor = bg,
            HoverColor   = Color.FromArgb(Math.Min(255,bg.R+20), Math.Min(255,bg.G+20), Math.Min(255,bg.B+20)),
            GlowColor    = glow,
            FormColor    = BG_DARK,
            CornerRadius = cr,
            Cursor       = Cursors.Hand,
        };
        Controls.Add(b);
        return b;
    }
}

// ══════════════════════════════════════════════════════════════════════
// Entry Point
// ══════════════════════════════════════════════════════════════════════

static class Program
{
    [System.Runtime.InteropServices.DllImport("user32.dll")]
    static extern bool SetProcessDPIAware();

    [STAThread]
    static void Main()
    {
        try { SetProcessDPIAware(); } catch { }
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        Application.Run(new InstallerForm());
    }
}
