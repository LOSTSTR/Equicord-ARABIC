/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُضيف صورة خلفية مخصصة للملف الشخصي عبر USRBG",
        "en": "Adds a custom profile background via USRBG."
    },
    "options": {
        "nitroFirst": {
            "ar": "البانر المستخدم عند توفّر بانر نيترو وبانر USRBG معاً",
            "en": "Display Nitro gradient theme over USRBG background."
        },
        "voiceBackground": {
            "ar": "استخدام بانرات USRBG كخلفيات للدردشة الصوتية",
            "en": "Use USRBG background in the voice channel panel."
        }
    }
});
