/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يتيح لك تحديد كلمات تُطمَس تلقائياً. التمرير فوق المحتوى المطموس أو النقر عليه يكشفه.",
        "en": "Lets you specify words that are automatically blurred. Hover or click blurred content to reveal it."
    },
    "options": {
        "onClick": {
            "ar": "إظهار المحتوى المطموس عند النقر بدلاً من التمرير",
            "en": "Action when clicking on blurred content."
        }
    }
});
