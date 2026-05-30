/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يحدّث حالتك الإلكترونية تلقائياً عند الانضمام لقناة صوتية.",
        "en": "Automatically updates your online status when you join a voice channel."
    },
    "options": {
        "statusToSet": {
            "ar": "الحالة التي تُعيّن عند الانضمام إلى قناة صوتية.",
            "en": "Status to set when you join a voice channel."
        }
    }
});
