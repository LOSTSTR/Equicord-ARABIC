/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُضيف المزيد من ردود الفعل السريعة",
        "en": "Adds more quick reactions to the reaction picker."
    },
    "options": {
        "reactionCount": {
            "ar": "عدد التفاعلات السريعة (0-42)",
            "en": "Number of quick reactions to show."
        },
        "frequentEmojis": {
            "ar": "استخدام الإيموجي الأكثر استخداماً بدلاً من المفضلة",
            "en": "Show frequently used emoji first."
        },
        "rows": {
            "ar": "عدد صفوف التفاعلات السريعة للعرض",
            "en": "Number of rows in the reaction picker."
        },
        "columns": {
            "ar": "عدد أعمدة التفاعلات السريعة للعرض",
            "en": "Number of columns in the reaction picker."
        },
        "compactMode": {
            "ar": "تصغير الأزرار إلى 75% من حجمها الأصلي مع تكبير الإيموجي الداخلي إلى 125%. ستكون الإيموجي 93.75% من حجمها الأصلي. يُنصح بوجود 5 أعمدة على الأقل",
            "en": "Use compact mode for the reaction picker."
        },
        "scroll": {
            "ar": "تفعيل التمرير في قائمة الإيموجي",
            "en": "Allow scrolling through reactions."
        }
    }
});
