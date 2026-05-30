/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "التحكم في إعدادات الصوت مباشرةً من لوحة الصوت",
        "en": "Control voice settings directly from the voice panel."
    },
    "options": {
        "uncollapseSettingsByDefault": {
            "ar": "توسيع إعدادات الصوت تلقائياً بشكل افتراضي",
            "en": "Show settings expanded by default."
        },
        "outputVolume": {
            "ar": "إظهار شريط تمرير مستوى صوت الإخراج",
            "en": "Show output volume slider."
        },
        "inputVolume": {
            "ar": "إظهار شريط تمرير مستوى صوت الإدخال",
            "en": "Show input volume slider."
        },
        "outputDevice": {
            "ar": "إظهار منتقي جهاز الإخراج",
            "en": "Show output device selector."
        },
        "inputDevice": {
            "ar": "إظهار منتقي جهاز الإدخال",
            "en": "Show input device selector."
        },
        "camera": {
            "ar": "إظهار منتقي الكاميرا",
            "en": "Show camera toggle."
        },
        "showOutputVolumeHeader": {
            "ar": "إظهار عنوان فوق شريط تمرير مستوى صوت الإخراج",
            "en": "Show header for output volume."
        },
        "showInputVolumeHeader": {
            "ar": "إظهار عنوان فوق شريط تمرير مستوى صوت الإدخال",
            "en": "Show header for input volume."
        },
        "showOutputDeviceHeader": {
            "ar": "إظهار عنوان فوق منتقي جهاز الإخراج",
            "en": "Show header for output device."
        },
        "showInputDeviceHeader": {
            "ar": "إظهار عنوان فوق منتقي جهاز الإدخال",
            "en": "Show header for input device."
        },
        "showVideoDeviceHeader": {
            "ar": "إظهار عنوان فوق منتقي الكاميرا",
            "en": "Show header for video device."
        }
    }
});
