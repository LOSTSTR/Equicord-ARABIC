/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُخفي رسائل السجل غير المفيدة من الكونسول",
        "en": "Hides useless log messages from the console."
    },
    "options": {
        "disableLoggers": {
            "ar": "يعطّل نظام تسجيل الرسائل في Discord",
            "en": "Disable Discord's internal loggers entirely."
        },
        "disableSpotifyLogger": {
            "ar": "تعطيل مسجل Spotify الذي يُسرّب معلومات الحساب ورمز الوصول",
            "en": "Disable Spotify's internal logger."
        },
        "whitelistedLoggers": {
            "ar": "قائمة مسجلات مفصولة بفاصلة منقوطة (;) للسماح بها حتى لو كانت الأخرى مخفية",
            "en": "Loggers to always show even when others are hidden."
        }
    }
});
