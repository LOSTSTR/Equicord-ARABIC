/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُعتّم الصور والمقاطع الحساسة تلقائياً",
        "en": "Automatically blurs NSFW images and videos."
    },
    "options": {
        "blurAmount": {
            "ar": "مقدار التعتيم (بالبكسل)",
            "en": "Blur amount for NSFW content."
        },
        "blurAllChannels": {
            "ar": "تعتيم المرفقات في جميع القنوات (وليس القنوات الحساسة فقط)",
            "en": "Blur all channels marked as NSFW."
        }
    }
});
