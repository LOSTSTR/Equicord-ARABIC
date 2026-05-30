/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يضيف مؤثرات صوتية من OperaGX أو osu! عند الكتابة على لوحة المفاتيح.",
        "en": "Adds OperaGX or osu! sound effects when typing on the keyboard."
    },
    "options": {
        "volume": {
            "ar": "مستوى صوت أصوات لوحة المفاتيح",
            "en": "Keyboard sounds volume level."
        },
        "soundPack": {
            "ar": "حزمة الصوت المستخدمة.",
            "en": "Sound pack to use."
        }
    }
});
