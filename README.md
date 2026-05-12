<div align="center">

# [<img src="./browser/icon.png" width="45" align="center" alt="Equicord-ARABIC">](https://github.com/LOSTSTR/Equicord-ARABIC) Equicord-ARABIC

### النسخة العربية المطورة من Equicord

**تجربة ديسكورد فائقة الأداء، بتخصيصات حصرية من تطوير**
**LOSTSTR و krym511 و 𝚁𝙰𝚈𝙼𝙾𝙽𝙳♞ و Abo Ahmed و S99**

---

[![GitHub Release](https://img.shields.io/github/v/release/LOSTSTR/Equicord-ARABIC?style=flat&color=5865F2&label=إصدار)](https://github.com/LOSTSTR/Equicord-ARABIC/releases/latest)
[![Tests](https://github.com/LOSTSTR/Equicord-ARABIC/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/LOSTSTR/Equicord-ARABIC/actions/workflows/test.yml)
[![Discord](https://img.shields.io/badge/Discord-5865F2?style=flat&logo=discord&logoColor=white)](https://discord.gg/QamdqDNEDa)
[![License](https://img.shields.io/github/license/LOSTSTR/Equicord-ARABIC?color=green&label=رخصة)](LICENSE)
[![Security Verified](https://img.shields.io/badge/security-verified-brightgreen?style=flat&logo=shield&logoColor=white)](https://github.com/LOSTSTR/Equicord-ARABIC)

</div>

---

## 📖 عن المشروع

**Equicord-ARABIC** هي النسخة العربية المطورة من [Equicord](https://github.com/Equicord/Equicord)، وهو بدوره مشتق من [Vencord](https://github.com/Vendicated/Vencord).

تتميز هذه النسخة بـ:

- ⚡ **أداء فائق وسلاسة تامة** — تحسينات مخصصة لتجربة أسرع وأخف
- 🌐 **تعريب شامل** — جميع أوصاف الإضافات (300+) مترجمة للعربية
- 🔧 **تخصيصات حصرية** — إضافات وتعديلات من تطوير الفريق لا تجدها في غيرها
- 🧩 **أكثر من 300 إضافة** — جميع إضافات Equicord الأصلية مع إضافات عربية حصرية
- 🔒 **أمان مُحقَّق** — فحص أمني شامل وصفر ثغرات في التبعيات
- 🔄 **تحديثات مستمرة** — مزامنة دورية مع المصدر الأصلي مع تطبيق التحسينات

للتواصل والدعم، انضم إلى سيرفر الديسكورد: **[discord.gg/QamdqDNEDa](https://discord.gg/QamdqDNEDa)**

---

## 👥 فريق المشروع

| العضو | الدور |
|-------|-------|
| **LOSTSTR** | مطور رئيسي — بناء المشروع وإدارته |
| **krym511** | داعم رئيسي — دعم ومساهمة في التطوير |
| **𝚁𝙰𝚈𝙼𝙾𝙽𝙳♞** | مساهم في التطوير |
| **Abo Ahmed** | مساهم في التطوير |
| **S99** | مساهم في التطوير |

---

## 📥 التثبيت

### المنصات المدعومة

| المنصة | الطريقة | التحميل |
|--------|---------|---------|
| 🪟 **Windows** | واجهة رسومية (GUI) | [![Windows Setup](https://img.shields.io/badge/Windows-Setup.exe-0078D4?style=flat&logo=windows&logoColor=white)](https://github.com/LOSTSTR/Equicord-ARABIC/releases/latest/download/EquicordArabicSetup.exe) |
| 🍎 **macOS** | Apple Silicon & Intel | [![macOS Script](https://img.shields.io/badge/macOS-Shell_Script-000000?style=flat&logo=apple&logoColor=white)](https://github.com/LOSTSTR/Equicord-ARABIC/releases/latest/download/install-macos.sh) |
| 🐧 **Linux** | سكريبت تلقائي (CLI) | [![Linux Script](https://img.shields.io/badge/Linux-Shell_Script-FCC624?style=flat&logo=linux&logoColor=black)](https://github.com/LOSTSTR/Equicord-ARABIC/releases/latest/download/install-linux.sh) |

> تجد جميع الإصدارات في صفحة [**Releases**](https://github.com/LOSTSTR/Equicord-ARABIC/releases).

---

### 🪟 Windows

حمّل **EquicordArabicSetup.exe** وشغّله — يكتشف Discord تلقائياً ويثبّت التعديل.

### 🍎 macOS — Apple Silicon & Intel

```bash
curl -fsSL https://github.com/LOSTSTR/Equicord-ARABIC/releases/latest/download/install-macos.sh | bash
```

يكتشف السكريبت نوع المعالج (ARM64 / Intel) تلقائياً ويدعم جميع إصدارات Discord (Stable، PTB، Canary).

### 🐧 Linux

```bash
curl -fsSL https://github.com/LOSTSTR/Equicord-ARABIC/releases/latest/download/install-linux.sh | bash
```

---

## 🛠️ البناء من المصدر (Devbuild)

### المتطلبات

- [Git](https://git-scm.com/download)
- [Node.JS LTS](https://nodejs.dev/en/)

### الخطوات

**1. تثبيت pnpm**

> قد يحتاج هذا الأمر صلاحيات المدير (admin/root). أغلق الطرفية وأعد فتحها بعد التثبيت.

```shell
npm i -g pnpm
```

> ⚠️ **مهم:** لا تستخدم طرفية المدير في الخطوات التالية، فقد يؤدي ذلك إلى تلف تثبيت Discord.

**2. استنساخ المستودع**

```shell
git clone https://github.com/LOSTSTR/Equicord-ARABIC
cd Equicord-ARABIC
```

**3. تثبيت التبعيات**

```shell
pnpm install --frozen-lockfile
```

**4. بناء المشروع**

```shell
pnpm build
```

**5. حقن Equicord-ARABIC في Discord**

```shell
pnpm inject
```

**6. بناء نسخة الويب (اختياري)**

```shell
pnpm buildWeb
```

بعد البناء، ابحث عن ملف ZIP في مجلد `dist` وثبّت الامتداد في متصفحك.

> ملاحظة: امتداد Firefox يتطلب [Firefox for Developers](https://www.mozilla.org/en-US/firefox/developer/).

---

## 💝 شكر خاص

<div align="center">

### شكر خاص لـ krym511

شكراً جزيلاً لـ **krym511** على دعمه المتواصل لهذا المشروع منذ البداية.
دعمه وإيمانه بهذا المشروع كان له دور كبير في استمراره وتطوره.
هذا المشروع لم يكن ليصل لما وصل إليه بدونك، شكراً يا صديق. 🙌

</div>

---

## ❤️ دعم المشروع

إذا أعجبك المشروع وأفادك، يمكنك دعمنا بـ:

- ⭐ **Star** للمستودع على GitHub
- 📢 مشاركة المشروع مع أصدقائك
- 💬 الانضمام لسيرفر الديسكورد والمساهمة في التطوير: **[discord.gg/QamdqDNEDa](https://discord.gg/QamdqDNEDa)**
- 🐛 الإبلاغ عن أي مشكلة أو اقتراح عبر [Issues](https://github.com/LOSTSTR/Equicord-ARABIC/issues)

دعمكم هو ما يجعلنا نستمر في تطوير وتحسين هذا المشروع! 💪

---

## 🙏 شكر وتقدير

- [Vendicated](https://github.com/Vendicated) — لإنشاء [Vencord](https://github.com/Vendicated/Vencord)
- [Equicord Team](https://github.com/Equicord) — لبناء [Equicord](https://github.com/Equicord/Equicord) فوق Vencord
- [verticalsync](https://github.com/verticalsync) — لإنشاء [Suncord](https://github.com/verticalsync/Suncord)

---

## 📊 Star History

<a href="https://star-history.com/#LOSTSTR/Equicord-ARABIC&Timeline">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=LOSTSTR/Equicord-ARABIC&type=Timeline&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=LOSTSTR/Equicord-ARABIC&type=Timeline" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=LOSTSTR/Equicord-ARABIC&type=Timeline" />
  </picture>
</a>

---

## ⚠️ إخلاء المسؤولية

Discord هي علامة تجارية مسجلة لشركة Discord Inc.، ولا يُعدّ هذا المشروع تابعاً لها أو معتمداً منها.

<details>
<summary>استخدام Equicord-ARABIC ينتهك شروط خدمة Discord</summary>

تعديلات العميل (Client modifications) تتعارض مع شروط خدمة Discord.

غير أن Discord لا تتخذ إجراءات صارمة ضد مستخدمي تعديلات العميل في الغالب، ولا توجد حالات موثقة لحظر حسابات بسبب ذلك طالما لا تُستخدم إضافات ذات سلوك مسيء.

إذا كان حسابك بالغ الأهمية بالنسبة لك، فالأفضل تجنب جميع تعديلات العميل احتياطاً.

</details>

---

<div align="center">

**Equicord-ARABIC** • Made with ❤️ by LOSTSTR & Team • [GPL-3.0 License](LICENSE)

[⬆ العودة للأعلى](#)

</div>
