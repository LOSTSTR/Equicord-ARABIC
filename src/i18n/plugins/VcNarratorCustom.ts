/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُعلن عند انضمام المستخدمين أو مغادرتهم أو تنقلهم في القنوات الصوتية عبر TikTok TTS.",
        "en": "Announces when users join, leave, or move between voice channels using a narrator via TikTok TTS. Revived and back again."
    },
    "options": {
        "customVoice": {
            "ar": "صوت الراوي",
            "en": "TikTok TTS voice to use."
        },
        "volume": {
            "ar": "مستوى صوت الراوي",
            "en": "Narrator volume."
        },
        "rate": {
            "ar": "سرعة الراوي",
            "en": "Narrator speech rate."
        },
        "sayOwnName": {
            "ar": "قول اسمك الخاص",
            "en": "Announce your own name."
        },
        "ignoreSelf": {
            "ar": "تجاهل نفسك في جميع الأحداث.",
            "en": "Ignore your own joins/leaves."
        }
    }
});
