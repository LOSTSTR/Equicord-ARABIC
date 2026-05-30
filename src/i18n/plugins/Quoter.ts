/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يضيف إمكانية إنشاء صورة اقتباس ملهم من رسالة.",
        "en": "Adds the ability to generate an inspirational quote image from a message."
    },
    "options": {
        "quoteFont": {
            "ar": "خط نص الاقتباس (المؤلف/الاسم يستخدم دائماً M PLUS Rounded 1c)",
            "en": "Font for the quote text (author/name always uses M PLUS Rounded 1c)."
        },
        "watermark": {
            "ar": "نص العلامة المائية المخصصة (32 حرفاً كحد أقصى)",
            "en": "Custom watermark text (max 32 characters)."
        },
        "grayscale": {
            "ar": "تفعيل التدرج الرمادي افتراضياً",
            "en": "Enable grayscale by default"
        },
        "showWatermark": {
            "ar": "إظهار العلامة المائية افتراضياً",
            "en": "Show watermark by default"
        },
        "saveAsGif": {
            "ar": "الحفظ كـ GIF افتراضياً",
            "en": "Save as GIF by default"
        }
    }
});
