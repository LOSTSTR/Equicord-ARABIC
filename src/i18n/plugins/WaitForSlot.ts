/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "ينضم تلقائياً إلى قناة صوتية ممتلئة عند توفر مقعد.",
        "en": "Automatically joins a full voice channel when a slot becomes available."
    },
    "options": {
        "autoJoin": {
            "ar": "الانضمام للقناة فوراً عند توفر مقعد بدلاً من عرض إشعار",
            "en": "Join the channel immediately when a slot opens instead of showing a notification."
        },
        "notificationSound": {
            "ar": "تشغيل صوت عند توفر مقعد.",
            "en": "Play a sound when a slot becomes available."
        }
    }
});
