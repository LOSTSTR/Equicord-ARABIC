/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يضيف حزم ملصقات من منصات التواصل الاجتماعي الأخرى. (مثل LINE)",
        "en": "Adds sticker packs from other platforms (e.g., LINE)."
    },
    "options": {
        "promptToUpload": {
            "ar": "يضع الستيكر في شريط الكتابة بدلاً من إرساله مباشرة",
            "en": "Place the sticker in the chat bar instead of sending immediately."
        },
        "packs": {
            "ar": "حزم الملصقات",
            "en": "Sticker packs to enable."
        }
    }
});
