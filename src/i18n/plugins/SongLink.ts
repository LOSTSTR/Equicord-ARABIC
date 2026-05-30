/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يضيف أزرار خدمات البث أسفل روابط الأغاني",
        "en": "Adds streaming service buttons below song links."
    },
    "options": {
        "servicesSettings": {
            "ar": "إعدادات الخدمات",
            "en": "Which streaming services to show buttons for."
        },
        "userCountry": {
            "ar": "الدولة المستخدمة للبحث (رمز دولة مؤلف من حرفين)",
            "en": "Your country for regional availability."
        },
        "includeMetadata": {
            "ar": "تضمين عنوان المقطوعة واسم الفنان كعنوان رئيسي.",
            "en": "Include song metadata in the link."
        }
    }
});
