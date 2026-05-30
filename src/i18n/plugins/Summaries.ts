/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُتيح مشاهدة ملخصات المحادثات الطويلة",
        "en": "Allows viewing conversation summaries for long threads."
    },
    "options": {
        "summaryExpiryThresholdDays": {
            "ar": "المدة بالأيام قبل حذف الملخص. ملاحظة: يُحتفظ بـ 50 ملخصاً كحد أقصى لكل قناة",
            "en": "Number of days after which a summary expires and is hidden."
        }
    }
});
