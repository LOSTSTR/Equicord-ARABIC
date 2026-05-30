/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُضيف عداداً للأحرف في صندوق الكتابة",
        "en": "Adds a character counter to the message input box."
    },
    "options": {
        "colorEffects": {
            "ar": "يفعّل التلوين الأصفر/الأحمر كلما اقتربت من حد الأحرف",
            "en": "Show color effects when approaching or exceeding the character limit."
        }
    }
});
