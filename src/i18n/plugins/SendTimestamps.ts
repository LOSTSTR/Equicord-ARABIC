/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُضيف أمر لإرسال طابع زمني منسّق",
        "en": "Adds a command to send a formatted timestamp."
    },
    "options": {
        "replaceMessageContents": {
            "ar": "استبدل الطوابع الزمنية في محتوى الرسائل",
            "en": "Replace message text timestamps with formatted Discord timestamps on send."
        }
    }
});
