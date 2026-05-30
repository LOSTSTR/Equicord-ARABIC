/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يضيف زر Soggy إلى صندوق الأدوات",
        "en": "Adds a Soggy button to the toolbox."
    },
    "options": {
        "songVolume": {
            "ar": "مستوى صوت الأغنية. 0 للتعطيل",
            "en": "Volume of the Soggy song."
        },
        "boopVolume": {
            "ar": "مستوى صوت صوت النقر",
            "en": "Volume of the boop sound."
        },
        "tooltipText": {
            "ar": "النص المعروض عند التحويم فوق الزر",
            "en": "Tooltip text for the Soggy button."
        },
        "imageLink": {
            "ar": "رابط URL للصورة (الزر والنافذة المنبثقة)",
            "en": "URL of the Soggy image."
        },
        "songLink": {
            "ar": "رابط URL للأغنية المراد تشغيلها",
            "en": "URL of the Soggy song."
        },
        "boopLink": {
            "ar": "رابط URL لصوت النقر",
            "en": "URL of the boop sound."
        }
    }
});
