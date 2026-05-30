/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُتيح ضبط مهلة مخصصة لتغيير الحالة إلى غير نشط",
        "en": "Allows setting a custom timeout for switching to idle status."
    },
    "options": {
        "idleTimeout": {
            "ar": "الدقائق قبل أن يتحول Discord إلى وضع الخمول (0 لتعطيل الخمول التلقائي)",
            "en": "Time before switching to idle status (in minutes). Set to 0 to use Discord's default."
        },
        "remainInIdle": {
            "ar": "عند العودة إلى Discord، ابقَ في وضع الخمول حتى تؤكد رغبتك في الظهور متصلاً",
            "en": "Stay in idle status when coming back to Discord after becoming idle."
        }
    }
});
