/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُتيح تخصيص الإعدادات الافتراضية لقنوات المنتدى",
        "en": "Allows customizing the default settings for forum channels."
    },
    "options": {
        "defaultLayout": {
            "ar": "التخطيط الافتراضي للمنتدى",
            "en": "Default layout for forum channels."
        },
        "defaultSortOrder": {
            "ar": "ترتيب الفرز الافتراضي للمنتدى",
            "en": "Default sort order for forum channels."
        }
    }
});
