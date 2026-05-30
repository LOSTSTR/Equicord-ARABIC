/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يرسل إشعاراً إذا تطابقت رسالة ما مع كلمات مفتاحية أو تعابير نمطية محددة",
        "en": "Sends a notification if a message matches specified keywords or regex patterns."
    },
    "options": {
        "ignoreBots": {
            "ar": "تجاهل رسائل البوتات",
            "en": "Ignore messages from bots."
        },
        "amountToKeep": {
            "ar": "عدد الرسائل التي يجب الاحتفاظ بها في السجل",
            "en": "Number of matched messages to keep in the list."
        },
        "keywords": {
            "ar": "إدارة الكلمات المفتاحية",
            "en": "Keywords or regex patterns to watch for."
        }
    }
});
