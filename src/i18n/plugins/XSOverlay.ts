/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يدعم تراكب XSOverlay للواقع الافتراضي",
        "en": "Supports the XSOverlay VR overlay."
    },
    "options": {
        "webSocketPort": {
            "ar": "منفذ Websocket",
            "en": "WebSocket port to connect to XSOverlay."
        },
        "preferUDP": {
            "ar": "فعّل إذا كنت تستخدم إصداراً قديماً من XSOverlay غير قادر على الاتصال عبر WebSocket. يُتجاهل هذا الإعداد على الويب.",
            "en": "Prefer UDP over WebSocket for communication."
        },
        "botNotifications": {
            "ar": "السماح بإشعارات البوتات",
            "en": "Send bot message notifications to XSOverlay."
        },
        "serverNotifications": {
            "ar": "السماح بإشعارات السيرفر",
            "en": "Send server message notifications to XSOverlay."
        },
        "dmNotifications": {
            "ar": "السماح بإشعارات الرسائل المباشرة",
            "en": "Send DM notifications to XSOverlay."
        },
        "groupDmNotifications": {
            "ar": "السماح بإشعارات المجموعات",
            "en": "Send group DM notifications to XSOverlay."
        },
        "callNotifications": {
            "ar": "السماح بإشعارات المكالمات",
            "en": "Send call notifications to XSOverlay."
        },
        "pingColor": {
            "ar": "لون ذكر المستخدم",
            "en": "Color for ping/mention notifications."
        },
        "channelPingColor": {
            "ar": "لون ذكر القناة",
            "en": "Color for channel mention notifications."
        },
        "soundPath": {
            "ar": "صوت الإشعار (default/warning/error)",
            "en": "Sound to play for XSOverlay notifications."
        },
        "timeout": {
            "ar": "مدة الإشعار (بالثواني)",
            "en": "How long notifications are shown (in seconds)."
        },
        "lengthBasedTimeout": {
            "ar": "تمديد المدة بحسب طول الرسالة",
            "en": "Scale notification duration based on message length."
        },
        "opacity": {
            "ar": "شفافية الإشعار",
            "en": "Notification opacity."
        },
        "volume": {
            "ar": "الصوت",
            "en": "Notification volume."
        }
    }
});
