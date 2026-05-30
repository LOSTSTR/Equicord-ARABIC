/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُضيف زراً لتفعيل/تعطيل الرسائل الصامتة",
        "en": "Adds a button to toggle silent messages on or off."
    },
    "options": {
        "persistState": {
            "ar": "كيفية الاحتفاظ بحالة تبديل الرسائل الصامتة",
            "en": "Remember the silent message toggle state between sessions."
        },
        "autoDisable": {
            "ar": "تعطيل تبديل الرسائل الصامتة تلقائياً بعد إرسال رسالة صامتة",
            "en": "Automatically disable silent messages after sending."
        }
    }
});
