/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُظهر المدة التي استغرقها تحميل الرسائل في القناة الحالية",
        "en": "Shows how long it took to load messages in the current channel."
    },
    "options": {
        "showIcon": {
            "ar": "إظهار أيقونة وقت التحميل في شريط الرسائل",
            "en": "Show a clock icon next to the timer."
        },
        "showMs": {
            "ar": "عرض الميلي ثانية في التوقيت",
            "en": "Show time in milliseconds."
        },
        "iconColor": {
            "ar": "لون الأيقونة (قيمة CSS للون)",
            "en": "Color of the timer icon."
        }
    }
});
