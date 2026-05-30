/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "نص توقيع/ختام تلقائي",
        "en": "Automatic signature/footer text."
    },
    "options": {
        "name": {
            "ar": "التوقيع الذي سيُضاف في نهاية رسائلك",
            "en": "The signature appended to the end of your messages."
        },
        "textHeader": {
            "ar": "العنوان الذي يُضاف قبل النص",
            "en": "Header text added before the signature."
        },
        "showIcon": {
            "ar": "عرض أيقونة لتبديل تفعيل الإضافة في شريط الدردشة",
            "en": "Show an icon in the chat bar to toggle the plugin."
        },
        "contextMenu": {
            "ar": "إضافة خيار لتبديل الوظيفة في قائمة السياق لمدخل الدردشة",
            "en": "Add a context menu option to toggle the signature."
        },
        "isEnabled": {
            "ar": "تبديل تفعيل الوظيفة",
            "en": "Toggle the signature on or off."
        }
    }
});
