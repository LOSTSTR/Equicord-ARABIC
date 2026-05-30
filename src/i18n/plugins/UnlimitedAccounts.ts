/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يزيد الحد الأقصى لعدد الحسابات التي يمكنك إضافتها.",
        "en": "Increases the maximum number of accounts you can add."
    },
    "options": {
        "maxAccounts": {
            "ar": "عدد الحسابات القابلة للإضافة، أو 0 لإزالة الحد",
            "en": "Number of accounts that can be added, or 0 to remove the limit."
        }
    }
});
