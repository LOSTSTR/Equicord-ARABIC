/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يضغط تلقائياً أنواع الملفات والمجلدات المحددة قبل رفعها إلى ديسكورد",
        "en": "Automatically compresses specified file types and folders before uploading to Discord."
    },
    "options": {
        "extensions": {
            "ar": "قائمة امتدادات الملفات للضغط التلقائي مفصولة بفواصل (مثل: .psd,.blend,.exe,.dmg)",
            "en": "Comma-separated list of file extensions to auto-compress (e.g. .psd,.blend,.exe,.dmg)."
        }
    }
});
