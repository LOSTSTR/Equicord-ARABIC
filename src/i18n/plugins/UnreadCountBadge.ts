/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يعرض شارات عدد الرسائل غير المقروءة على القنوات في قائمة القنوات",
        "en": "Shows unread message count badges on channels in the channel list."
    },
    "options": {
        "showOnMutedChannels": {
            "ar": "عرض عدد الرسائل غير المقروءة في القنوات المكتومة",
            "en": "Show unread message count on muted channels."
        },
        "notificationCountLimit": {
            "ar": "عرض +99 بدلاً من العدد الحقيقي",
            "en": "Show +99 instead of the actual count when the number is large."
        }
    }
});
