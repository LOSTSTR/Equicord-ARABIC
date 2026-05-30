/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يعرض اسم الملف الأصلي بدلاً من اسم مُعدَّل",
        "en": "Shows the original filename instead of a modified one."
    },
    "options": {
        "showFullUrl": {
            "ar": "عرض الرابط الكامل للصورة بدلاً من اسم الملف فقط. مُفعّل دائماً للـ GIF لأنها غالباً لا تحمل اسماً ذا معنى",
            "en": "Show the full URL instead of just the filename."
        }
    }
});
