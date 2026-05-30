/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يضيف زر Husk (راجع الإعدادات لتغيير الإيموجي المستخدم)",
        "en": "Adds a Husk button to the toolbox (see settings to change the emoji)."
    },
    "options": {
        "findInServer": {
            "ar": "يبحث عن إيموجي بنفس الاسم في السيرفر قبل استخدام المعرّف من الإعدادات (مفيد بدون نيترو)",
            "en": "Server ID to find the emoji in."
        },
        "emojiName": {
            "ar": "اسم الإيموجي (الافتراضي من سيرفر Vencord: husk)",
            "en": "Emoji name to use."
        },
        "emojiID": {
            "ar": "معرّف الإيموجي (الافتراضي من سيرفر Vencord: 1026532993923293184)",
            "en": "Emoji ID to use."
        }
    }
});
