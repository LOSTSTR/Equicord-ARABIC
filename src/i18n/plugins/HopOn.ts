/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "اقفز! يفتح رابطاً قابلاً للإعداد عند تطابق رسالة مع تعبير منتظم مخصص في القناة الحالية.",
        "en": "Hop on! Opens a configurable link whenever a message in the current channel matches a custom regex."
    },
    "options": {
        "regex": {
            "ar": "نمط Regex الذي يُشغّل الأداة عند تطابقه",
            "en": "Regular expression to match against messages."
        },
        "url": {
            "ar": "الرابط الذي يُفتح",
            "en": "URL to open when a message matches."
        }
    }
});
