/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يحوّل الوحدات المترية إلى الوحدات الإمبراطورية والعكس",
        "en": "Converts metric units to imperial and vice versa."
    },
    "options": {
        "myUnits": {
            "ar": "الوحدات التي تستخدمها وتريد التحويل إليها. الافتراضي: النظام الإمبراطوري",
            "en": "The unit system you use and want conversions shown in."
        }
    }
});
