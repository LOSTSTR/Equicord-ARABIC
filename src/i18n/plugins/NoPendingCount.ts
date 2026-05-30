/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُزيل شارة العداد في أيقونة الطلبات المعلقة",
        "en": "Removes the counter badge on the pending requests icon."
    },
    "options": {
        "hideFriendRequestsCount": {
            "ar": "إخفاء عداد طلبات الصداقة الواردة",
            "en": "Hide the friend request count badge."
        },
        "hideMessageRequestsCount": {
            "ar": "إخفاء عداد طلبات الرسائل",
            "en": "Hide the message request count badge."
        },
        "hidePremiumOffersCount": {
            "ar": "إخفاء عداد عروض Nitro",
            "en": "Hide the premium offers count badge."
        }
    }
});
