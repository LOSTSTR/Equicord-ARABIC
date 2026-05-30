/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُرسل إشعارات عند إرسال مستخدمين مختارين رسالة",
        "en": "Sends notifications when selected users send a message."
    },
    "options": {
        "users": {
            "ar": "قائمة معرّفات المستخدمين مفصولة بفاصلة للحصول على إشعارات رسائلهم",
            "en": "Users to notify when they send a message."
        }
    }
});
