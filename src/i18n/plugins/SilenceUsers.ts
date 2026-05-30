/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يكتم تنبيهات @mention وعدادات شارات السيرفر من مستخدمين محددين. لا تتأثر الرسائل العادية والرسائل المباشرة.",
        "en": "Mutes @mention alerts and server badge counters from specified users. Normal messages and DMs are unaffected."
    },
    "options": {
        "mutedUserIds": {
            "ar": "معرّفات مستخدمي Discord مفصولة بفواصل لكتم إشعاراتهم وشاراتهم.",
            "en": "User IDs to silence."
        }
    }
});
