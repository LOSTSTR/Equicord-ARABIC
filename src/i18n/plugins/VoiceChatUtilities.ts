/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يتيح لك هذا الإضافة تنفيذ إجراءات متعددة على قناة كاملة (نقل، كتم، قطع الاتصال، إلخ) (من تطوير dutake في الأصل)",
        "en": "Lets you perform bulk actions on a whole voice channel (move, mute, disconnect, etc.)."
    },
    "options": {
        "waitAfter": {
            "ar": "عدد إجراءات API قبل الانتظار (لتجنب تجاوز حد الطلبات)",
            "en": "Wait after each action."
        },
        "waitSeconds": {
            "ar": "وقت الانتظار بين كل إجراء (بالثواني)",
            "en": "Seconds to wait between actions."
        }
    }
});
