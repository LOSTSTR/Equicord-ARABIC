/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يعطّل القيود من جهة العميل عند إدارة صلاحيات القنوات.",
        "en": "Disables client-side permission checks when managing channel permissions."
    },
    "options": {
        "lockout": {
            "ar": "تجاوز حماية الإقفال من الصلاحيات (\"متأكد أنك لا تريد فعل هذا\")",
            "en": "Bypass the channel lockout check."
        },
        "onboarding": {
            "ar": "تجاوز متطلبات الإعداد الأولي (\"هذا التغيير سيجعل سيرفرك غير متوافق [...]\")",
            "en": "Bypass the onboarding requirement check."
        }
    }
});
