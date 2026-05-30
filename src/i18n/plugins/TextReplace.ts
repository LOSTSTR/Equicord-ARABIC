/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يستبدل النص تلقائياً أثناء الكتابة باستخدام قواعد مخصصة",
        "en": "Automatically replaces text while typing using custom rules."
    },
    "options": {
        "stringRules": {
            "ar": "قواعد استبدال النص باستخدام مطابقة النص البسيط.",
            "en": "String replacement rules."
        },
        "regexRules": {
            "ar": "قواعد استبدال النص باستخدام التعبيرات النمطية.",
            "en": "Regex replacement rules."
        }
    }
});
