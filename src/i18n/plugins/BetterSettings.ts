/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُحسّن واجهة إعدادات ديسكورد بتأثيرات بصرية",
        "en": "Improves the Discord settings UI with visual effects."
    },
    "options": {
        "disableFade": {
            "ar": "تعطيل تأثير الانتقال التدريجي",
            "en": "Disable the fade-in animation in the settings panel."
        },
        "organizeMenu": {
            "ar": "تنظيم قائمة سياق أيقونة الإعدادات في فئات",
            "en": "Organize the Vencord settings in the menu."
        },
        "eagerLoad": {
            "ar": "إزالة تأخير التحميل عند فتح القائمة لأول مرة",
            "en": "Load the settings panel eagerly to reduce lag."
        }
    }
});
