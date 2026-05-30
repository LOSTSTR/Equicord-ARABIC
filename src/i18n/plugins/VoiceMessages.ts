/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يتيح إرسال رسائل صوتية كما في الجوال. انقر بالزر الأيمن على زر الرفع واختر إرسال رسالة صوتية.",
        "en": "Adds the ability to send voice messages in any channel."
    },
    "options": {
        "noiseSuppression": {
            "ar": "إلغاء الضوضاء",
            "en": "Enable noise suppression for voice messages."
        },
        "echoCancellation": {
            "ar": "إلغاء الصدى",
            "en": "Enable echo cancellation for voice messages."
        }
    }
});
