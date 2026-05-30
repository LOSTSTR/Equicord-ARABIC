/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "تعرض تلميحات لمؤشرات النبرة مثل /srs و/gen وغيرها في الرسائل المرسلة.",
        "en": "Shows tooltips for tone indicators like /srs, /gen, etc. on sent messages."
    },
    "options": {
        "prefix": {
            "ar": "الحرف/الأحرف البادئة لمؤشرات النبرة.",
            "en": "Prefix characters for tone indicators."
        },
        "customIndicators": {
            "ar": "مؤشرات نبرة مخصصة (التنسيق: jk=Joking; srs=Serious)",
            "en": "Custom tone indicators to add."
        }
    }
});
