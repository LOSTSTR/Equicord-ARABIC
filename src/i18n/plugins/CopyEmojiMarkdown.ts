/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُضيف خيار نسخ صيغة الإيموجي الخام",
        "en": "Adds an option to copy the raw emoji format."
    },
    "options": {
        "copyUnicode": {
            "ar": "ينسخ حرف الـ unicode الخام بدلًا من :name: للإيموجي الافتراضية (👽)",
            "en": "Copy the raw Unicode character instead of the emoji markup for standard emoji."
        }
    }
});
