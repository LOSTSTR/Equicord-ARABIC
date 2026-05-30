/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يغيّر الحرف الأول من كل جملة في مدخلات الرسائل إلى حرف كبير",
        "en": "Capitalizes the first letter of each sentence in the message input."
    },
    "options": {
        "blockedWords": {
            "ar": "كلمات لا تُكبَّر (افصل بينها بفاصلة)",
            "en": "Words that should not be capitalized (comma-separated)."
        }
    }
});
