/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يمنع ديسكورد من تحويل نص الإيموجي إلى صور الخادم",
        "en": "Prevents Discord from converting emoji text to server emoji images."
    },
    "options": {
        "shownEmojis": {
            "ar": "أنواع الإيموجيات التي تظهر في قائمة الإكمال التلقائي.",
            "en": "Which emoji to show: all, only animated, or none."
        }
    }
});
