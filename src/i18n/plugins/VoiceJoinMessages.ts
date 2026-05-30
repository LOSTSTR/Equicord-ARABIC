/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "استقبال رسائل مؤقتة من جانب العميل عندما ينضم أصدقاؤك للقنوات الصوتية",
        "en": "Receive temporary client-side messages when your friends join voice channels."
    },
    "options": {
        "friendDirectMessages": {
            "ar": "استقبال إشعارات في رسائل أصدقائك عند انضمامهم لقناة صوتية",
            "en": "Receive join notifications via friend DMs."
        },
        "friendDirectMessagesShowMembers": {
            "ar": "إظهار قائمة الأعضاء الآخرين في القناة الصوتية عند تلقي إشعار رسالة مباشرة بانضمام صديق",
            "en": "Show other members in the voice channel when receiving a friend join DM."
        },
        "friendDirectMessagesShowMemberCount": {
            "ar": "إظهار عدد الأعضاء الآخرين في القناة الصوتية عند تلقي إشعار انضمام صديق",
            "en": "Show the member count in the voice channel when receiving a friend join DM."
        },
        "friendDirectMessagesSelf": {
            "ar": "استقبال الإشعارات في رسائل أصدقائك حتى لو كنت في نفس القناة الصوتية معهم",
            "en": "Receive notifications even when you are in the same voice channel as your friend."
        },
        "friendDirectMessagesSilent": {
            "ar": "رسائل الانضمام في رسائل أصدقائك المباشرة ستكون صامتة",
            "en": "Make friend join DMs silent."
        },
        "allowedFriends": {
            "ar": "قائمة معرفات أصدقائك الذين تريد استقبال رسائل انضمامهم (مفصولة بفاصلة أو مسافة)",
            "en": "Friend IDs to receive join messages from (comma or space separated)."
        },
        "ignoredFriends": {
            "ar": "قائمة معرفات أصدقائك الذين لا تريد استقبال رسائل انضمامهم (مفصولة بفاصلة أو مسافة)",
            "en": "Friend IDs to never receive join messages from (comma or space separated)."
        },
        "ignoreBlockedUsers": {
            "ar": "عدم إرسال رسائل عن انضمام/مغادرة/انتقال المستخدمين المحظورين للقنوات الصوتية",
            "en": "Don't send messages about blocked users joining/leaving/moving."
        }
    }
});
