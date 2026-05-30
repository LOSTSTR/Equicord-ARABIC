/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يميّز الروابط في الرسائل التي تطابق أنماطك المخصصة.",
        "en": "Highlights URLs in messages that match your custom patterns."
    },
    "options": {
        "patterns": {
            "ar": "أنماط URL لتمييزها باستخدام نمط glob",
            "en": "URL patterns to highlight."
        },
        "boldUrls": {
            "ar": "جعل الروابط المميزة عريضة.",
            "en": "Bold matched URLs."
        },
        "highlightEmbeds": {
            "ar": "تمييز الروابط أيضاً في محتوى المعاينات المضمنة.",
            "en": "Also highlight embed URLs."
        }
    }
});
