/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يعرض مستودعات GitHub العامة للمستخدم في ملفه الشخصي",
        "en": "Displays a user's public GitHub repositories on their profile."
    },
    "options": {
        "showStars": {
            "ar": "يعرض عدد نجوم المستودع",
            "en": "Show the star count for each repository."
        },
        "showLanguage": {
            "ar": "إظهار لغة المستودع",
            "en": "Show the programming language of each repository."
        }
    }
});
