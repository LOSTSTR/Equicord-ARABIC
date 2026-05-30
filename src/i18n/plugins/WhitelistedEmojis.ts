/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يضيف القدرة على تعطيل جميع الإيموجي في الرسائل إلا ما أُدرج في القائمة البيضاء.",
        "en": "Adds the ability to disable all emoji in messages except those on your whitelist."
    },
    "options": {
        "defaultEmojis": {
            "ar": "إخفاء الإيموجي الافتراضية من الإكمال التلقائي إلا ما أُضيف للقائمة البيضاء",
            "en": "Hide default emoji from autocomplete except those on the whitelist."
        },
        "serverEmojis": {
            "ar": "إخفاء الإيموجي المخصصة للسيرفر من الإكمال التلقائي إلا ما أُضيف للقائمة البيضاء.",
            "en": "Hide custom server emoji from autocomplete except those on the whitelist."
        },
        "disableToasts": {
            "ar": "لا تعرض إشعارات منبثقة عند إضافة الإيموجي أو إزالتها.",
            "en": "Do not show toast notifications when adding or removing emoji."
        },
        "whiteListedEmojis": {
            "ar": "الإيموجي في القائمة البيضاء",
            "en": "Emoji currently on the whitelist."
        },
        "exportEmojis": {
            "ar": "تصدير الإيموجي",
            "en": "Export the whitelist."
        },
        "importEmojis": {
            "ar": "استيراد الإيموجي",
            "en": "Import the whitelist."
        },
        "resetEmojis": {
            "ar": "إعادة تعيين الإيموجي",
            "en": "Reset the whitelist."
        }
    }
});
