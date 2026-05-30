/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُضيف الأفاتار بجانب الذكر في الرسائل",
        "en": "Adds avatars next to mentions in messages."
    },
    "options": {
        "showAtSymbol": {
            "ar": "عرض رمز @ عند الإشارة إلى المستخدمين",
            "en": "Show the @ symbol before the username in mentions."
        }
    }
});
