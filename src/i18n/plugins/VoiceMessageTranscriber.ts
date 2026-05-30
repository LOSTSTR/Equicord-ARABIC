/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "نسخ الرسائل الصوتية على الجهاز مباشرةً بواسطة Whisper v3",
        "en": "Transcribes voice messages on-device using Whisper v3."
    },
    "options": {
        "selectedModel": {
            "ar": "حجم النموذج",
            "en": "Whisper model size."
        },
        "quantized": {
            "ar": "استخدام النموذج المضغوط (حجم أصغر، دقة أقل قليلاً)",
            "en": "Use the quantized (compressed) model (smaller size, slightly lower accuracy)."
        }
    }
});
