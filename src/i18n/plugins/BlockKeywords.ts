/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يحجب الرسائل التي تحتوي على كلمات مفتاحية محددة، كما لو كان المُرسِل محظوراً.",
        "en": "Hides messages containing user-specified keywords, as if the sender were blocked."
    },
    "options": {
        "blockedWords": {
            "ar": "قائمة كلمات محظورة مفصولة بفواصل",
            "en": "Comma-separated list of blocked keywords."
        },
        "useRegex": {
            "ar": "استخدام تعبيرات منتظمة للتحقق من محتوى الرسالة (متقدم)",
            "en": "Treat each value as a regular expression when checking message content (advanced)."
        },
        "regexHelper": {
            "ar": "اختبر تعبيراتك المنتظمة على نص تجريبي",
            "en": "Test your regular expressions against a sample input"
        },
        "caseSensitive": {
            "ar": "تفعيل التمييز بين الأحرف الكبيرة والصغيرة",
            "en": "Whether the search is case-sensitive."
        },
        "ignoreBlockedMessages": {
            "ar": "تجاهل شريط الرسائل الجديدة بالكامل",
            "en": "Completely ignore the new-message bar."
        }
    }
});
