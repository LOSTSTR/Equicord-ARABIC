/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يضيف مرئي طيف صوتي وأوسيلوسكوب لمشغّلات الصوت في المرفقات",
        "en": "Adds a visual spectrum analyser and oscilloscope to audio attachment players."
    },
    "options": {
        "oscilloscope": {
            "ar": "تفعيل عارض الأوسيلوسكوب.",
            "en": "Enable the oscilloscope visualizer."
        },
        "spectrograph": {
            "ar": "تفعيل عارض الطيف الصوتي (Spectrograph).",
            "en": "Enable the spectrograph (frequency spectrum) visualizer."
        },
        "oscilloscopeSolidColor": {
            "ar": "استخدام لون ثابت للأوسيلوسكوب.",
            "en": "Use a solid color for the oscilloscope."
        },
        "oscilloscopeColor": {
            "ar": "لون الأوسيلوسكوب (R, G, B أو #hex).",
            "en": "Oscilloscope color (R, G, B or #hex)."
        },
        "spectrographSolidColor": {
            "ar": "استخدام لون ثابت لعارض الطيف الصوتي.",
            "en": "Use a solid color for the spectrograph visualizer."
        },
        "spectrographColor": {
            "ar": "لون عارض الطيف الصوتي (R, G, B أو #hex).",
            "en": "Spectrograph visualizer color (R, G, B or #hex)."
        },
        "corsProxy": {
            "ar": "عنوان CORS proxy لتشغيل الصوت. اتركه فارغاً لتعطيل الـ proxy.",
            "en": "CORS proxy URL for audio playback. Leave empty to disable the proxy."
        }
    }
});
