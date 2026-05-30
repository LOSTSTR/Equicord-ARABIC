/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يعرض عدد الأعضاء في الخادم والقناة",
        "en": "Shows the member count of a server and channel."
    },
    "options": {
        "toolTip": {
            "ar": "عرض عدد الأعضاء في تلميح السيرفر",
            "en": "Show member count in the channel tooltip."
        },
        "memberList": {
            "ar": "إظهار عدد الأعضاء في قائمة الأعضاء",
            "en": "Show member count in the member list."
        },
        "voiceActivity": {
            "ar": "إظهار نشاط الصوت مع عدد الأعضاء في قائمة الأعضاء",
            "en": "Show voice activity counts."
        }
    }
});
