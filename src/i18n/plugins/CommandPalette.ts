/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "تشغيل الإجراءات بسرعة عبر لوحة أوامر قابلة للبحث",
        "en": "Run actions quickly through a searchable command palette."
    },
    "options": {
        "customCommands": {
            "ar": "إدارة إدخالات لوحة الأوامر المخصصة",
            "en": "Manage custom command palette entries."
        },
        "closeAfterExecute": {
            "ar": "إغلاق لوحة الأوامر بعد تنفيذ أمر.",
            "en": "Close the command palette after executing a command."
        }
    }
});
