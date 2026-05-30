/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "إخفاء الرسائل والرسائل الخاصة مؤقتاً حتى إعادة التشغيل.",
        "en": "Temporarily hide messages until you restart."
    },
    "options": {
        "hidePopoverButton": {
            "ar": "إخفاء زر الإخفاء في قائمة الرسائل",
            "en": "Show a hide button in the message hover actions."
        }
    }
});
