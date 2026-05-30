/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُحسّن عناوين ومصغرات يوتيوب باستخدام DeArrow",
        "en": "Improves YouTube titles and thumbnails using DeArrow."
    },
    "options": {
        "hideButton": {
            "ar": "يخفي زر Dearrow من مقاطع YouTube المضمّنة",
            "en": "Hide the DeArrow button from embedded YouTube videos."
        },
        "replaceElements": {
            "ar": "اختر العناصر التي سيتم استبدالها في التضمين",
            "en": "Choose which elements to replace in the embed."
        },
        "dearrowByDefault": {
            "ar": "تطبيق DeArrow على الفيديوهات تلقائياً",
            "en": "Apply DeArrow to videos automatically."
        }
    }
});
