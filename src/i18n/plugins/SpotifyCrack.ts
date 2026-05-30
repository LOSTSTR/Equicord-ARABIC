/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُحسّن تجربة استخدام Spotify مع ديسكورد",
        "en": "Improves the Spotify experience in Discord."
    },
    "options": {
        "noSpotifyAutoPause": {
            "ar": "تعطيل الإيقاف المؤقت التلقائي لـ Spotify",
            "en": "Disable Spotify auto-pause when playing audio in Discord."
        },
        "keepSpotifyActivityOnIdle": {
            "ar": "الإبقاء على نشاط Spotify أثناء التوقف",
            "en": "Keep the Spotify activity visible when idle."
        }
    }
});
