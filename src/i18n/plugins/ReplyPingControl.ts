/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "التحكم في استقبال إشعارات ردود الرسائل دائماً أو أبداً، مع ميزات القائمة البيضاء والسوداء",
        "en": "Control whether message reply pings are always on or always off, with whitelist and blacklist support."
    },
    "options": {
        "alwaysPingOnReply": {
            "ar": "يُنبّهك دائماً عند ردّ أحدهم على رسائلك",
            "en": "Always ping when replying."
        },
        "replyPingWhitelist": {
            "ar": "قائمة معرّفات المستخدمين مفصولة بفاصلة لاستقبال إشعارات الردود منهم دائماً",
            "en": "Users who always get pinged when you reply."
        },
        "replyPingBlacklist": {
            "ar": "قائمة معرّفات المستخدمين مفصولة بفاصلة لعدم استقبال إشعارات الردود منهم أبداً",
            "en": "Users who never get pinged when you reply."
        }
    }
});
