/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "إشعارات قابلة للتخصيص مع تنسيق محسّن للإشارات",
        "en": "Customizable notifications with improved mention formatting."
    },
    "options": {
        "friends": {
            "ar": "يُنبّهك عندما يرسل أصدقاؤك رسائل في السيرفرات",
            "en": "Notify for messages from friends."
        },
        "mentions": {
            "ar": "إشعار عند ذكرك مباشرةً بعلامة @",
            "en": "Notify for mentions."
        },
        "dms": {
            "ar": "إشعار عند استقبال رسائل مباشرة (DMs)",
            "en": "Notify for direct messages."
        },
        "showInActive": {
            "ar": "إظهار الإشعارات حتى للقناة النشطة حالياً",
            "en": "Show notifications even when the channel is active."
        },
        "ignoreMuted": {
            "ar": "تجاهل الإشعارات من السيرفرات والقنوات والمستخدمين المكتومين",
            "en": "Ignore notifications from muted channels/servers."
        }
    }
});
