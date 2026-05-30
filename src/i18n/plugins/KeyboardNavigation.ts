/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يتيح لك التنقل في واجهة المستخدم باستخدام لوحة المفاتيح.",
        "en": "Lets you navigate the UI using your keyboard."
    },
    "options": {
        "hotkey": {
            "ar": "اختصار لوحة المفاتيح لفتح لوحة الأوامر",
            "en": "Keyboard shortcut to open the command palette."
        },
        "allowMouseControl": {
            "ar": "السماح بالتحكم في لوحة الأوامر بالماوس.",
            "en": "Allow controlling the command palette with the mouse."
        }
    }
});
