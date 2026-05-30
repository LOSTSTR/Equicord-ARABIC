/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُخفي رسائل المستخدمين المحجوبين كلياً",
        "en": "Hides messages from blocked users completely."
    },
    "options": {
        "alsoHideIgnoredUsers": {
            "ar": "إخفاء رسائل المستخدمين المتجاهلين أيضاً.",
            "en": "Also hide messages from ignored users."
        },
        "disableNotifications": {
            "ar": "إخفاء إشعارات الرسائل الجديدة من المستخدمين المحجوبين. يكون دائماً مفعلاً إذا كان 'إخفاء المستخدمين افتراضياً' مفعلاً وكان المستخدم غير مستثنى في 'المستخدمون المستثنون'.",
            "en": "Disable notifications from blocked users."
        },
        "allowAutoModMessages": {
            "ar": "السماح للرسائل المرسلة بواسطة AutoMod بتجاوز الفلتر.",
            "en": "Allow AutoMod messages even from blocked users."
        },
        "hideBlockedUserReplies": {
            "ar": "إخفاء الردود على المستخدمين المحجوبين.",
            "en": "Hide reply chains that reference a blocked user's message."
        },
        "defaultHideUsers": {
            "ar": "إذا كان مفعلاً، ستُخفى رسائل المستخدمين المحجوبين بالكامل وستُطوى رسائل معرّفات المستخدمين في قائمة الاستثناءات (السلوك الافتراضي لـ Discord). إذا كان معطلاً، ستُطوى رسائل المستخدمين المحجوبين وستُخفى رسائل معرّفات المستخدمين في القائمة بالكامل.",
            "en": "Hide blocked users from the member list by default."
        },
        "overrideUsers": {
            "ar": "قائمة معرّفات المستخدمين المفصولة بفواصل التي ستُخفى أو تُطوى بدلاً من السلوك الافتراضي المحدد أعلاه.",
            "en": "User IDs to always show even if blocked."
        }
    }
});
