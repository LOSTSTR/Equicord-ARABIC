/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يعرض من يكتب في القنوات الأخرى",
        "en": "Shows who is typing in other channels."
    },
    "options": {
        "includeCurrentChannel": {
            "ar": "عرض مؤشر الكتابة للقناة المحددة حالياً",
            "en": "Show typing indicators for the current channel."
        },
        "includeMutedChannels": {
            "ar": "ما إذا كان يجب عرض مؤشر الكتابة للقنوات المكتومة.",
            "en": "Show typing indicators for muted channels."
        },
        "includeIgnoredUsers": {
            "ar": "ما إذا كان يجب عرض مؤشر الكتابة للمستخدمين المتجاهَلين.",
            "en": "Show typing indicators for ignored users."
        },
        "includeBlockedUsers": {
            "ar": "ما إذا كان يجب عرض مؤشر الكتابة للمستخدمين المحجوبين.",
            "en": "Show typing indicators for blocked users."
        },
        "indicatorMode": {
            "ar": "كيف يجب عرض المؤشر؟",
            "en": "Where to show the typing indicator."
        }
    }
});
