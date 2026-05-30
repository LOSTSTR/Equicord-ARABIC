/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُتيح رفع مستوى الصوت فوق 200%",
        "en": "Allows raising the volume above 200%."
    },
    "options": {
        "multiplier": {
            "ar": "مضاعف الصوت",
            "en": "Volume multiplier (applied on top of Discord's maximum)."
        }
    }
});
