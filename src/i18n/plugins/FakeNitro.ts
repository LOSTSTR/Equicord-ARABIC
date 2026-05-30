/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُتيح إرسال إيموجي وستيكرات مدفوعة وبث بجودة Nitro",
        "en": "Allows sending paid emoji, stickers, and streaming in Nitro quality."
    },
    "options": {
        "enableEmojiBypass": {
            "ar": "يتيح إرسال إيموجي وهمية (يتخطى أيضاً قيود الصلاحيات)",
            "en": "Allow sending emoji from servers you are not in."
        },
        "emojiSize": {
            "ar": "حجم الإيموجي عند الإرسال",
            "en": "Size of emojis when sent as images."
        },
        "transformEmojis": {
            "ar": "تحويل الإيموجي الوهمية إلى حقيقية",
            "en": "Transform emoji in messages to display them."
        },
        "enableStickerBypass": {
            "ar": "يتيح إرسال ملصقات وهمية (يتخطى أيضاً قيود الصلاحيات لاستخدام الملصقات)",
            "en": "Allow sending stickers you do not own."
        },
        "stickerSize": {
            "ar": "حجم الملصقات عند الإرسال",
            "en": "Size of stickers when sent as images."
        },
        "transformStickers": {
            "ar": "تحويل الملصقات الوهمية إلى حقيقية",
            "en": "Transform stickers in messages to display them."
        },
        "transformCompoundSentence": {
            "ar": "تحويل الملصقات والإيموجي الوهمية في الجمل المركبة (الجمل التي تحتوي على محتوى أكثر من مجرد رابط الإيموجي أو الملصق الوهمي)",
            "en": "Transform emoji in compound sentences (e.g. 'Hello :emoji: World')."
        },
        "enableStreamQualityBypass": {
            "ar": "السماح بالبث بجودة نيترو",
            "en": "Allow streaming in high quality without Nitro."
        },
        "useStickerHyperLinks": {
            "ar": "استخدام روابط تشعبية عند إرسال الملصقات الوهمية",
            "en": "Send stickers as hyperlinks when no other bypass can be used."
        },
        "useEmojiHyperLinks": {
            "ar": "استخدام روابط تشعبية عند إرسال الإيموجي الوهمية",
            "en": "Send emojis as hyperlinks when no other bypass can be used."
        },
        "hyperLinkText": {
            "ar": "النص الذي يجب أن يستخدمه الرابط التشعبي. سيتم استبدال {{NAME}} باسم الإيموجي/الملصق.",
            "en": "Text to use for hyperlinks."
        },
        "disableEmbedPermissionCheck": {
            "ar": "تعطيل فحص صلاحية التضمين عند إرسال الإيموجي والملصقات الوهمية",
            "en": "Disable the permission check for embeds."
        }
    }
});
