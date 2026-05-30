/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يقسّم الرسائل الطويلة لأجزاء متعددة لتناسب حد رسائل ديسكورد.",
        "en": "Splits long messages into multiple parts to fit Discord's message limit."
    },
    "options": {
        "maxLength": {
            "ar": "الحد الأقصى لطول الرسالة قبل التقسيم. اضبطه على 0 للكشف التلقائي.",
            "en": "Maximum message length before splitting. Set to 0 for auto-detection."
        },
        "disableFileConversion": {
            "ar": "عند التفعيل، يعطّل تحويل الملفات للرسائل الطويلة.",
            "en": "When enabled, disables file conversion for long messages."
        },
        "sendDelay": {
            "ar": "التأخير بين كل جزء بالثواني.",
            "en": "Delay between each part in seconds."
        },
        "hardSplit": {
            "ar": "عند التفعيل، يقسم عند آخر حرف بدلاً من آخر مسافة/سطر جديد.",
            "en": "When enabled, splits at the last character instead of the last space/newline."
        },
        "splitInSlowmode": {
            "ar": "هل يجب تقسيم الرسائل إذا كان الوضع البطيء مفعّلاً في القناة؟",
            "en": "Whether to split messages if slowmode is enabled in the channel."
        },
        "slowmodeMax": {
            "ar": "الحد الأقصى لوقت الوضع البطيء عند التقسيم فيه.",
            "en": "Maximum slowmode delay when splitting in slowmode."
        }
    }
});
