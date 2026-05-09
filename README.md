<div align="center">

# [<img src="./browser/icon.png" width="45" align="center" alt="Equicord-ARABIC">](https://github.com/LOSTSTR/Equicord-ARABIC) Equicord-ARABIC

### النسخة العربية المطورة من Equicord

**تجربة ديسكورد فائقة الأداء، بتخصيصات حصرية من تطوير LOSTSTR**

---

**Modified by [LOSTSTR](https://github.com/LOSTSTR) — Equicord-ARABIC**

[![GitHub Release](https://img.shields.io/github/v/release/LOSTSTR/Equicord-ARABIC?style=flat&color=5865F2&label=إصدار)](https://github.com/LOSTSTR/Equicord-ARABIC/releases/latest)
[![Tests](https://github.com/LOSTSTR/Equicord-ARABIC/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/LOSTSTR/Equicord-ARABIC/actions/workflows/test.yml)
[![Discord](https://img.shields.io/discord/QamdqDNEDa?color=5865F2&label=Discord&logo=discord&logoColor=white)](https://discord.gg/QamdqDNEDa)
[![License](https://img.shields.io/github/license/LOSTSTR/Equicord-ARABIC?color=green&label=رخصة)](LICENSE)

</div>

---

## 📖 عن المشروع

**Equicord-ARABIC** هي النسخة العربية المطورة من [Equicord](https://github.com/Equicord/Equicord)، وهو بدوره مشتق من [Vencord](https://github.com/Vendicated/Vencord).

تتميز هذه النسخة بـ:

- ⚡ **أداء فائق وسلاسة تامة** — تحسينات مخصصة لتجربة أسرع وأخف
- 🌐 **دعم كامل للغة العربية** — واجهة وتخصيصات موجهة للمجتمع العربي
- 🔧 **تخصيصات حصرية** — إضافات وتعديلات من تطوير LOSTSTR لا تجدها في غيرها
- 🧩 **أكثر من 300 إضافة** — جميع إضافات Equicord الأصلية مع إضافات عربية حصرية
- 🔄 **تحديثات مستمرة** — مزامنة دورية مع المصدر الأصلي مع تطبيق التحسينات

للتواصل والدعم، انضم إلى سيرفر الديسكورد: **[discord.gg/QamdqDNEDa](https://discord.gg/QamdqDNEDa)**

---

## 📥 التثبيت / الإلغاء

### Windows

| النوع | التحميل |
|-------|---------|
| GUI (واجهة رسومية) | [**تحميل Equicord-ARABIC.exe**](https://github.com/LOSTSTR/Equicord-ARABIC/releases/latest) |
| CLI (سطر أوامر) | [**تحميل CLI**](https://github.com/LOSTSTR/Equicord-ARABIC/releases/latest) |

### macOS

| النوع | التحميل |
|-------|---------|
| X64 GUI | [**تحميل (Intel)**](https://github.com/LOSTSTR/Equicord-ARABIC/releases/latest) |
| ARM64 GUI | [**تحميل (Apple Silicon)**](https://github.com/LOSTSTR/Equicord-ARABIC/releases/latest) |

### Linux

| النوع | التحميل |
|-------|---------|
| GUI | [**تحميل (X11)**](https://github.com/LOSTSTR/Equicord-ARABIC/releases/latest) |
| CLI | [**تحميل (CLI)**](https://github.com/LOSTSTR/Equicord-ARABIC/releases/latest) |

أو عبر سطر الأوامر:

```shell
sh -c "$(curl -sS https://raw.githubusercontent.com/LOSTSTR/Equicord-ARABIC/refs/heads/main/misc/install.sh)"
```

> تجد جميع الإصدارات في صفحة [**Releases**](https://github.com/LOSTSTR/Equicord-ARABIC/releases).

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

**Equicord-ARABIC** • Modified by [LOSTSTR](https://github.com/LOSTSTR) • [GPL-3.0 License](LICENSE)

[⬆ العودة للأعلى](#)

</div>
