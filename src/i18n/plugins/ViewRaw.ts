/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يعرض الكود الخام للرسائل والمضمّنات",
        "en": "Shows the raw code of messages and embeds."
    },
    "options": {
        "clickMethod": {
            "ar": "تغيير الزر لعرض المحتوى/البيانات الخام لأي رسالة.",
            "en": "Change the button interaction method for viewing raw message content."
        },
        "messageContextMenu": {
            "ar": "إظهار في قائمة سياق الرسالة",
            "en": "Show in the message context menu."
        }
    }
});
