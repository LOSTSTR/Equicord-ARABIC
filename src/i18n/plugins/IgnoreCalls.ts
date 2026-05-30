/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يتيح لك تجاهل المكالمات من مستخدمين محددين أو مجموعات الرسائل المباشرة.",
        "en": "Lets you ignore calls from specific users or group DMs."
    },
    "options": {
        "permanentlyIgnoredUsers": {
            "ar": "معرّفات المستخدمين (مفصولة بفاصلة ومسافة) الذين سيتم تجاهلهم دائماً",
            "en": "Users whose calls are permanently ignored."
        }
    }
});
