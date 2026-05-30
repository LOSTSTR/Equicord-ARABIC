/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُظهر القنوات المخفية مع الإشارة إلى عدم إمكانية الوصول",
        "en": "Shows hidden channels with an indicator that they cannot be accessed."
    },
    "options": {
        "channelStyle": {
            "ar": "أسلوب عرض القنوات المخفية.",
            "en": "Visual style for hidden channels."
        },
        "showMode": {
            "ar": "الوضع المستخدم لعرض القنوات المخفية.",
            "en": "What to show for hidden channels."
        },
        "defaultAllowedUsersAndRolesDropdownState": {
            "ar": "ما إذا كانت القائمة المنسدلة للمستخدمين والأدوار المسموح لهم في القنوات المخفية مفتوحة افتراضياً",
            "en": "Default state of the allowed users/roles dropdown."
        }
    }
});
