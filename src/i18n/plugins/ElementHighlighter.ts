/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "تمييز عناصر الواجهة وفحصها بسهولة.",
        "en": "Easily highlight and inspect UI elements."
    },
    "options": {
        "keybind": {
            "ar": "تفعيل/تعطيل أداة التمييز",
            "en": "Enable/disable the highlighter tool."
        },
        "showClasses": {
            "ar": "عرض أسماء فئات CSS للعنصر في التلميح",
            "en": "Show the element's CSS class names in the tooltip."
        },
        "showId": {
            "ar": "عرض خاصية ID للعنصر في التلميح",
            "en": "Show the element's ID attribute in the tooltip."
        },
        "showFont": {
            "ar": "عرض عائلة الخط وحجمه المحسوب",
            "en": "Show the computed font family and size."
        },
        "showPadding": {
            "ar": "عرض قيم الحشو للعنصر",
            "en": "Show the element's padding values."
        },
        "showMargin": {
            "ar": "عرض قيم الهامش للعنصر",
            "en": "Show the element's margin values."
        },
        "showBorderRadius": {
            "ar": "عرض قيم نصف قطر حدود العنصر",
            "en": "Show the element's border-radius values."
        },
        "showPosition": {
            "ar": "عرض نوع موضع CSS ومؤشر Z للعنصر",
            "en": "Show the CSS position type and Z-index of the element."
        },
        "showDisplay": {
            "ar": "عرض نوع العرض مع خصائص flex أو grid للعنصر",
            "en": "Show the display type with flex or grid properties."
        }
    }
});
