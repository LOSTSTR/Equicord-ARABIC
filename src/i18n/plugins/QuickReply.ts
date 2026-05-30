/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُتيح الرد السريع بالضغط على R دون فتح قائمة",
        "en": "Allows quick replies by pressing R without opening a menu."
    },
    "options": {
        "shouldMention": {
            "ar": "الإشارة (@) في الرد بشكل افتراضي",
            "en": "Whether to mention the user when replying."
        },
        "ignoreBlockedAndIgnored": {
            "ar": "تجاهل رسائل المستخدمين المحجوبين/المتجاهلين عند التنقل",
            "en": "Skip blocked and ignored users when cycling through messages to reply."
        }
    }
});
