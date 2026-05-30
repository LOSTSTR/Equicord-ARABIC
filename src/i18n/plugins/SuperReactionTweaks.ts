/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُتيح تخصيص ردود الفعل الكبيرة",
        "en": "Allows customizing super reactions."
    },
    "options": {
        "superReactByDefault": {
            "ar": "يجعل منتقي التفاعلات يختار التفاعلات الفائقة افتراضياً",
            "en": "Use super reactions by default."
        },
        "unlimitedSuperReactionPlaying": {
            "ar": "إزالة الحد من تشغيل التفاعلات الفائقة في آنٍ واحد",
            "en": "Remove the limit on simultaneously playing super reactions."
        },
        "superReactionPlayingLimit": {
            "ar": "الحد الأقصى للتفاعلات الفائقة المتزامنة. 0 لتعطيل التشغيل",
            "en": "Maximum number of super reactions playing at once (when unlimited is off)."
        }
    }
});
