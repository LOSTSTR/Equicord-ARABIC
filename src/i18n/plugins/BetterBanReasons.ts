/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "أنشئ أسباباً مخصصة لاستخدامها في نافذة الحظر، أو اعرض حقل نص افتراضياً بدلاً من الخيارات",
        "en": "Create custom preset reasons for the ban dialog, or show a plain text field instead."
    },
    "options": {
        "reasons": {
            "ar": "أسباب الحظر المخصصة الخاصة بك",
            "en": "Your custom ban reasons."
        },
        "isTextInputDefault": {
            "ar": "يعرض حقل نص بدلاً من قائمة الاختيار افتراضياً (مكافئ للنقر على \"أخرى\")",
            "en": "Show a text input field instead of the selection list by default (equivalent to clicking 'Other')."
        }
    }
});
