/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُضيف 'ington' لاحقةً لكلمة عشوائية في رسالتك",
        "en": "Appends 'ington' to a random word in your message."
    },
    "options": {
        "showIcon": {
            "ar": "إظهار زر لتشغيل/إيقاف إضافة Ingtoninator",
            "en": "Show a toolbar icon to toggle the plugin."
        },
        "isEnabled": {
            "ar": "تفعيل أو تعطيل Ingtoninator",
            "en": "Enable the Ingtoninator."
        }
    }
});
