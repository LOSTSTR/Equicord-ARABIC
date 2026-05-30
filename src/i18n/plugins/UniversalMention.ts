/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "إشارة إلى أي مستخدم بغض النظر عن صلاحيات الوصول للقناة.",
        "en": "Mention any user regardless of channel access permissions."
    },
    "options": {
        "globalMention": {
            "ar": "منشن المستخدمين من أي سيرفر وليس السيرفر الحالي فقط",
            "en": "Mention users from any server, not just the current one."
        },
        "onlyDMUsers": {
            "ar": "إظهار المستخدمين الذين تبادلت معهم رسائل مباشرة فقط",
            "en": "Only show users you have exchanged direct messages with."
        }
    }
});
