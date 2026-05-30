/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُظهر معاينة آخر رسالة والطابع الزمني في قائمة الرسائل المباشرة.",
        "en": "Shows a preview of the last message and timestamp in the DM list."
    },
    "options": {
        "hideMuted": {
            "ar": "إخفاء معاينات الرسائل والتواريخ للمحادثات والمجموعات المكتومة",
            "en": "Hide message preview for muted DMs."
        }
    }
});
