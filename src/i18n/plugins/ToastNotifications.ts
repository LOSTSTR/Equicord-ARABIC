/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يعرض إشعارات منبثقة، قابلة للتهيئة للرسائل المباشرة والمجموعات والأصدقاء وقنوات السيرفر.",
        "en": "Shows popup toast notifications, configurable for DMs, groups, friends, and server channels."
    },
    "options": {
        "position": {
            "ar": "موضع الإشعار المنبثق.",
            "en": "Where notifications appear on screen."
        },
        "timeout": {
            "ar": "مدة عرض الإشعارات بالثواني.",
            "en": "How long notifications stay visible (in seconds)."
        },
        "opacity": {
            "ar": "شفافية الإشعار المرئي.",
            "en": "Notification opacity."
        },
        "maxNotifications": {
            "ar": "الحد الأقصى لعدد الإشعارات المعروضة في وقت واحد.",
            "en": "Maximum number of notifications shown at once."
        },
        "disableInStreamerMode": {
            "ar": "لا تعرض الإشعارات عند تفعيل وضع البث.",
            "en": "Disable notifications in streamer mode."
        },
        "respectDoNotDisturb": {
            "ar": "لا تعرض الإشعارات عندما تكون حالتك 'عدم الإزعاج'.",
            "en": "Respect Do Not Disturb status."
        },
        "directMessages": {
            "ar": "عرض إشعارات للرسائل المباشرة.",
            "en": "Show notifications for direct messages."
        },
        "groupMessages": {
            "ar": "عرض إشعارات لرسائل المجموعات.",
            "en": "Show notifications for group messages."
        },
        "friendServerNotifications": {
            "ar": "عرض إشعارات عندما يرسل الأصدقاء رسائل في سيرفرات مشتركة معك.",
            "en": "Show notifications for friends' server messages."
        },
        "ignoreUsers": {
            "ar": "قائمة معرّفات المستخدمين (مفصولة بفواصل) لتجاهل الإشعارات الخاصة بهم.",
            "en": "Users to ignore notifications from."
        },
        "notifyFor": {
            "ar": "قائمة معرّفات القنوات (مفصولة بفواصل) لتلقي الإشعارات منها دائماً.",
            "en": "Which types of messages trigger notifications."
        },
        "exampleButton": {
            "ar": "عرض مثال على إشعار منبثق.",
            "en": "Show an example notification."
        }
    }
});
