/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يتيح لك إخفاء تقريباً جميع محتوى أي مستخدم محلياً",
        "en": "Lets you hide nearly all content from any user locally."
    },
    "options": {
        "hideVc": {
            "ar": "إخفاء قنوات الصوت التي تحتوي مستخدمين محجوبين.",
            "en": "Hide blocked users from voice channels."
        },
        "usersToBlock": {
            "ar": "معرّفات المستخدمين مفصولة بفاصلة ومسافة",
            "en": "Users to block client-side."
        },
        "hideBlockedUsers": {
            "ar": "إخفاء المستخدمين المحجوبين في كل مكان",
            "en": "Hide blocked users from member lists and profiles."
        },
        "hideBlockedMessages": {
            "ar": "إخفاء رسائل المستخدمين المحجوبين بالكامل (مشابه لإضافة noblockedmessages القديمة)",
            "en": "Hide messages from blocked users."
        },
        "hideEmptyRoles": {
            "ar": "إخفاء عناوين الرتب إذا كان جميع أعضائها محجوبين",
            "en": "Hide roles that have no visible members after blocking."
        },
        "blockedReplyDisplay": {
            "ar": "ما الذي يُعرض بدلاً من الرسالة عند الرد على مستخدم مخفي",
            "en": "How to display replies to blocked messages."
        },
        "guildBlackList": {
            "ar": "معرّفات السيرفرات لتعطيل الإضافة فيها",
            "en": "Servers to apply blocking in (leave empty for all)."
        },
        "guildWhiteList": {
            "ar": "معرّفات السيرفرات لتفعيل الإضافة فيها فقط",
            "en": "Servers to exclude from blocking."
        }
    }
});
