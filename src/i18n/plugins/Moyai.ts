/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُشغّل مؤثراً صوتياً 🗿 عند إرسال إيموجي moyai أو التفاعل به أو استخدامه كتأثير صوتي في قناتك الحالية.",
        "en": "Plays a 🗿 sound effect when a moyai emoji is sent, reacted with, or used as a voice effect."
    },
    "options": {
        "volume": {
            "ar": "مستوى صوت 🗿🗿🗿",
            "en": "Volume of the moyai sound effect."
        },
        "quality": {
            "ar": "جودة صوت 🗿🗿🗿",
            "en": "Sound quality."
        },
        "triggerWhenUnfocused": {
            "ar": "تشغيل 🗿 حتى عندما تكون النافذة غير مُركّزة",
            "en": "Also play when Discord is not focused."
        },
        "ignoreBots": {
            "ar": "تجاهل البوتات",
            "en": "Ignore moyai from bots."
        },
        "ignoreBlocked": {
            "ar": "تجاهل المستخدمين المحظورين",
            "en": "Ignore moyai from blocked users."
        }
    }
});
