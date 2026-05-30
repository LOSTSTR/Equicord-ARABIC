/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يضيف تلميحاً بمعاينة الرسالة عند المرور على روابط الرسائل والردود والرسائل المُعادة توجيهها.",
        "en": "Adds a message preview tooltip when hovering over message links, replies, and forwarded messages."
    },
    "options": {
        "onLink": {
            "ar": "إظهار تلميح عند المرور على روابط الرسائل",
            "en": "Show tooltip when hovering over message links."
        },
        "onReply": {
            "ar": "إظهار تلميح عند المرور على ردود الرسائل",
            "en": "Show tooltip when hovering over replies."
        },
        "onForward": {
            "ar": "إظهار تلميح عند المرور على الرسائل المُعادة توجيهها",
            "en": "Show tooltip when hovering over forwarded messages."
        },
        "display": {
            "ar": "نمط العرض",
            "en": "Tooltip display style."
        }
    }
});
