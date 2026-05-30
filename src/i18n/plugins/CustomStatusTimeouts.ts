/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يضيف إعدادات مسبقة قابلة للتخصيص لمدة انتهاء الحالة في قائمة الحضور",
        "en": "Adds customizable presets for status expiry duration in the presence menu."
    },
    "options": {
        "showForeverOnTop": {
            "ar": "عرض خيار 'للأبد' في أعلى القائمة بدلاً من الأسفل.",
            "en": "Show the 'Forever' option at the top of the list."
        },
        "extraSeconds": {
            "ar": "ثوانٍ إضافية للإضافة، مفصولة بفواصل (مثل: 5, 10, 30)",
            "en": "Additional seconds presets."
        },
        "extraMinutes": {
            "ar": "دقائق إضافية للإضافة، مفصولة بفواصل (مثل: 5, 10, 30)",
            "en": "Additional minutes presets."
        },
        "extraHours": {
            "ar": "ساعات إضافية للإضافة، مفصولة بفواصل (مثل: 2, 4, 6, 12)",
            "en": "Additional hours presets."
        },
        "extraDays": {
            "ar": "أيام إضافية للإضافة، مفصولة بفواصل (مثل: 1, 2)",
            "en": "Additional days presets."
        }
    }
});
