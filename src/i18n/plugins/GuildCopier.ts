/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "نسخ سيرفر كامل بما يشمل القنوات والأدوار والأذونات والإيموجي والستيكرات والفئات لإنشاء سيرفر مطابق.",
        "en": "Copies roles, channels, emoji, stickers, and more from one server to another."
    },
    "options": {
        "copyRoles": {
            "ar": "نسخ الأدوار من السيرفر الأصلي",
            "en": "Copy roles from the original server."
        },
        "copyChannels": {
            "ar": "نسخ القنوات والفئات من السيرفر الأصلي",
            "en": "Copy channels and categories from the original server."
        },
        "copyEmojis": {
            "ar": "نسخ الإيموجي من السيرفر الأصلي",
            "en": "Copy emoji from the original server."
        },
        "copyStickers": {
            "ar": "نسخ الستيكرات من السيرفر الأصلي",
            "en": "Copy stickers from the original server."
        },
        "copyBots": {
            "ar": "إنشاء قناة #bots-list بروابط دعوة لجميع البوتات في السيرفر الأصلي",
            "en": "Create a #bots-list channel with invite links for all bots in the original server."
        },
        "emojiCount": {
            "ar": "الحد الأقصى لعدد الإيموجي المنسوخة (لكل نوع: PNG وGIF)",
            "en": "Maximum number of emoji to copy per type (PNG and GIF)."
        },
        "stickerCount": {
            "ar": "الحد الأقصى لعدد الستيكرات المنسوخة",
            "en": "Maximum number of stickers to copy."
        }
    }
});
