/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يضيف اختصاراً قابلاً للتخصيص لتبديل تشغيل الكاميرا.",
        "en": "Adds a customizable shortcut to toggle the camera."
    },
    "options": {
        "keyBind": {
            "ar": "المفتاح لتبديل الكاميرا عند الضغط عليه.",
            "en": "Key to toggle the camera when pressed."
        },
        "reqCtrl": {
            "ar": "يتطلب الضغط على مفتاح Ctrl.",
            "en": "Require holding the Ctrl key."
        },
        "reqShift": {
            "ar": "يتطلب الضغط على مفتاح Shift.",
            "en": "Require holding the Shift key."
        },
        "reqAlt": {
            "ar": "يتطلب الضغط على مفتاح Alt.",
            "en": "Require holding the Alt key."
        }
    }
});
