/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يتيح تغيير سرعة تشغيل مقاطع الوسائط (الافتراضية)",
        "en": "Lets you change the playback speed of media attachments (default ones)."
    },
    "options": {
        "defaultVoiceMessageSpeed": {
            "ar": "الرسائل الصوتية",
            "en": "Default playback speed for voice messages."
        },
        "defaultVideoSpeed": {
            "ar": "مقاطع الفيديو",
            "en": "Default playback speed for videos."
        },
        "defaultAudioSpeed": {
            "ar": "الملفات الصوتية",
            "en": "Default playback speed for audio files."
        }
    }
});
