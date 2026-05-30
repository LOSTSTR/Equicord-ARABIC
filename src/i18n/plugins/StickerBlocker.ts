/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يتيح لك حظر الملصقات من العرض.",
        "en": "Lets you block stickers from being displayed."
    },
    "options": {
        "showGif": {
            "ar": "يعرض صورة GIF قطة ظريفة",
            "en": "Show a cute cat GIF image when a sticker is blocked."
        },
        "showMessage": {
            "ar": "ما إذا كان يجب عرض رسالة تفصّل معرّف الملصق المحظور",
            "en": "Whether to show a message detailing the blocked sticker ID."
        },
        "showButton": {
            "ar": "ما إذا كان يجب عرض زر لإلغاء حظر الملصق",
            "en": "Whether to show a button to unblock the sticker."
        },
        "blockedStickers": {
            "ar": "قائمة معرّفات الملصقات المحظورة (لا تعدّلها إلا إذا كنت تعرف ما تفعله)",
            "en": "List of blocked sticker IDs (do not edit unless you know what you are doing)."
        }
    }
});
