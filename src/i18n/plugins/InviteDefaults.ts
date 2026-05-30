/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يتيح لك تعديل القيم الافتراضية عند إنشاء دعوات السيرفر.",
        "en": "Lets you modify the default values when creating server invites."
    },
    "options": {
        "inviteDuration": {
            "ar": "مدة الدعوة",
            "en": "Default invite expiry duration."
        },
        "maxUses": {
            "ar": "عدد استخدامات الدعوة",
            "en": "Default maximum invite uses."
        },
        "temporaryMembership": {
            "ar": "عضوية مؤقتة",
            "en": "Create temporary membership invites by default."
        }
    }
});
