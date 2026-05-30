/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُتيح تكبير الصور بالسحب والتحريك",
        "en": "Allows zooming images by dragging and panning."
    },
    "options": {
        "saveZoomValues": {
            "ar": "حفظ قيم التكبير وحجم العدسة",
            "en": "Save zoom and lens size values between sessions."
        },
        "invertScroll": {
            "ar": "عكس اتجاه التمرير",
            "en": "Invert the scroll direction when zooming."
        },
        "nearestNeighbour": {
            "ar": "استخدام تقنية الاستيفاء بأقرب جار عند تحجيم الصور",
            "en": "Use nearest-neighbour (pixelated) rendering when zoomed in."
        },
        "square": {
            "ar": "جعل العدسة مربعة الشكل",
            "en": "Use a square zoom lens."
        },
        "zoom": {
            "ar": "مستوى تكبير العدسة",
            "en": "Zoom level."
        },
        "size": {
            "ar": "نصف القطر / حجم العدسة",
            "en": "Lens size."
        },
        "zoomSpeed": {
            "ar": "سرعة تغيير مستوى التكبير / حجم العدسة",
            "en": "How fast to zoom in and out."
        }
    }
});
