/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يعرض مؤشراً للرسائل التي استغرق إرسالها ≥n ثانية",
        "en": "Shows an indicator for messages that took ≥n seconds to send."
    },
    "options": {
        "latency": {
            "ar": "الحد الأدنى بالثواني لإظهار مؤشر التأخير",
            "en": "Minimum latency threshold to show an indicator (in seconds)."
        },
        "detectDiscordKotlin": {
            "ar": "الكشف عن عملاء Discord القديمة على أندرويد",
            "en": "Detect messages sent from the Discord Android app."
        },
        "showMillis": {
            "ar": "إظهار الميلي ثانية",
            "en": "Show milliseconds in the latency indicator."
        },
        "ignoreSelf": {
            "ar": "عدم إضافة المؤشر لرسائلك الخاصة",
            "en": "Do not show the indicator for your own messages."
        }
    }
});
