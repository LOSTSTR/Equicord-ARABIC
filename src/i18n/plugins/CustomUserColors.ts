/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يتيح لك إضافة لون مخصص لأي مستخدم في أي مكان! يُنصح باستخدامه مع typingTweaks و roleColorEverywhere",
        "en": "Lets you assign a custom color to any user anywhere. Works great with TypingTweaks and RoleColorEverywhere."
    },
    "options": {
        "dmList": {
            "ar": "تلوين اسم المستخدمين ذوي الألوان المخصصة في قائمة الرسائل المباشرة",
            "en": "Apply custom colors in the DM list."
        },
        "colorInServers": {
            "ar": "تغيير ألوان الأسماء داخل السيرفرات",
            "en": "Apply custom colors in servers."
        }
    }
});
