/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يضيف خيارات FPS ومدة تسجيل إضافية، وطول مقطع مخصص، ووسم RPC والمزيد",
        "en": "Adds extra frame-rate and duration options for clips, a custom length, RPC highlights, and more."
    },
    "options": {
        "richPresenceTagging": {
            "ar": "متى يجب وسم المقاطع بـ Rich Presence الحالية؟",
            "en": "When to tag clips with the current Rich Presence."
        }
    }
});
