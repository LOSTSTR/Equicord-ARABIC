/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُصلح مشكلة انتهاء جلسة Spotify في المضمّنات",
        "en": "Fixes the Spotify session expiry issue in embeds."
    },
    "options": {
        "volume": {
            "ar": "نسبة الصوت لمشغلات Spotify. فوق 10% يكون الصوت عالياً جداً",
            "en": "The volume percentage for Spotify embeds."
        }
    }
});
