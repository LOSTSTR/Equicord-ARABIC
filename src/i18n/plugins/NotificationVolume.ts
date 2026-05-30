/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُتيح ضبط مستوى صوت الإشعارات بشكل مستقل",
        "en": "Allows adjusting the notification volume independently."
    },
    "options": {
        "notificationVolume": {
            "ar": "مستوى صوت الإشعارات",
            "en": "Volume for Discord notifications (0–100%)."
        }
    }
});
