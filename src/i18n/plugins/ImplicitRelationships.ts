/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُضيف قنوات DM غير الرسمية إلى قائمة الأصدقاء",
        "en": "Adds unofficial DM channels to the friends list."
    },
    "options": {
        "sortByAffinity": {
            "ar": "ترتيب العلاقات الضمنية بحسب درجة التقارب معك",
            "en": "Sort implicit relationships by affinity (how frequently you interact)."
        }
    }
});
