/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يعرض أيقونة الجهاز المستخدم بجانب اسم المستخدم",
        "en": "Shows an icon indicating the device the user is on next to their name."
    },
    "options": {
        "list": {
            "ar": "إظهار الأيقونات في قائمة الأعضاء",
            "en": "Show platform indicators in the member list."
        },
        "profiles": {
            "ar": "إظهار المؤشرات في ملفات المستخدمين الشخصية",
            "en": "Show platform indicators in profiles."
        },
        "messages": {
            "ar": "إظهار المؤشرات داخل الرسائل",
            "en": "Show platform indicators next to usernames in messages."
        },
        "colorMobileIndicator": {
            "ar": "جعل مؤشر الجوال يطابق لون حالة المستخدم.",
            "en": "Color the mobile indicator."
        },
        "showBots": {
            "ar": "إظهار مؤشرات المنصة على البوتات",
            "en": "Show platform indicators for bots."
        },
        "ConsoleIcon": {
            "ar": "أيقونة وحدة التحكم المستخدمة",
            "en": "Console icon used for console platform indicator."
        }
    }
});
