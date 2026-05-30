/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يشغّل صوت Animalese من Animal Crossing لكل رسالة مرسلة",
        "en": "Plays Animal Crossing Animalese sounds for every message sent."
    },
    "options": {
        "volume": {
            "ar": "مستوى صوت الـ Animalese",
            "en": "Animalese volume level."
        },
        "speed": {
            "ar": "سرعة صوت الـ Animalese",
            "en": "Animalese sound speed."
        },
        "pitch": {
            "ar": "مضاعف درجة الصوت",
            "en": "Pitch multiplier."
        },
        "messageLengthLimit": {
            "ar": "الحد الأقصى لطول الرسالة المراد معالجتها",
            "en": "Maximum message length to process."
        },
        "processOwnMessages": {
            "ar": "تفعيل لتشغيل الصوت على رسائلك الخاصة أيضاً",
            "en": "Enable to also play sounds for your own messages."
        },
        "soundQuality": {
            "ar": "جودة الصوت المستخدم",
            "en": "Sound quality used."
        }
    }
});
