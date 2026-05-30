/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "تعديلات متعددة للنقر الأوسط، مثل اللصق وفتح الروابط.",
        "en": "Various middle-click tweaks such as pasting and opening links."
    },
    "options": {
        "openScope": {
            "ar": "منع النقر الأوسط على هذه الأنواع من المحتوى.",
            "en": "Where middle-click opens links."
        },
        "pasteScope": {
            "ar": "منع اللصق عبر النقر الأوسط في هذه الحالات.",
            "en": "Where middle-click pastes text."
        },
        "pasteThreshold": {
            "ar": "المدة بالمللي ثانية قبل إعادة تفعيل اللصق بعد النقر الأوسط.",
            "en": "Minimum text length to trigger paste."
        }
    }
});
