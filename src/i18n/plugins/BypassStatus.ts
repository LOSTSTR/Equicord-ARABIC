/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "استمر في تلقي إشعارات من مصادر محددة حتى في وضع عدم الإزعاج. انقر بزر الماوس الأيمن على المستخدمين/القنوات/السيرفرات لإعدادها لتجاوز وضع عدم الإزعاج.",
        "en": "Continue receiving notifications from specific sources even in Do Not Disturb mode. Right-click users/channels/servers to configure bypass."
    },
    "options": {
        "guilds": {
            "ar": "السيرفرات المسموح لها بالتجاوز (تُشعَر عند الإشارة إليك في أي مكان بالسيرفر)",
            "en": "Servers allowed to bypass (notified when mentioned anywhere in the server)."
        },
        "channels": {
            "ar": "القنوات المسموح لها بالتجاوز (تُشعَر عند الإشارة إليك في تلك القناة)",
            "en": "Channels allowed to bypass (notified when mentioned in that channel)."
        },
        "users": {
            "ar": "المستخدمون المسموح لهم بالتجاوز (تُشعَر بجميع رسائلهم المباشرة)",
            "en": "Users allowed to bypass (notified of all their direct messages)."
        },
        "allowOutsideOfDms": {
            "ar": "السماح للمستخدمين المختارين بالتجاوز خارج الرسائل المباشرة أيضاً (يعمل كتجاوز للقناة/السيرفر لجميع رسائل المستخدمين المختارين)",
            "en": "Allow selected users to bypass outside DMs too (acts as a channel/server bypass for all messages from selected users)."
        },
        "notificationSound": {
            "ar": "ما إذا كان صوت الإشعار سيُشغَّل",
            "en": "Whether to play a notification sound."
        },
        "respectSilentPings": {
            "ar": "احترام الإشارات الصامتة (@silent / كتم الإشعارات)",
            "en": "Respect silent mentions (@silent / muted notifications)."
        },
        "statusToUse": {
            "ar": "الحالة المستخدمة لتفعيل القائمة البيضاء",
            "en": "The status used to activate the whitelist."
        }
    }
});
