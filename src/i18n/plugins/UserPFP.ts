/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يتيح لك استخدام صورة شخصية متحركة بدون نيترو",
        "en": "Lets you use an animated profile picture without Nitro."
    },
    "options": {
        "overrideServerAvatars": {
            "ar": "استبدال صور الملف الشخصي للسيرفر بالصور المخصصة أو الافتراضية إذا لم تُضبط صورة مخصصة",
            "en": "Replace server profile pictures with custom or default ones if no custom picture is set."
        },
        "preferNitro": {
            "ar": "أي صورة شخصية تستخدم إذا كانت صورة نيترو المتحركة وصورة UserPFP موجودتين معاً",
            "en": "Which avatar to use when both an animated Nitro avatar and a UserPFP avatar are present."
        },
        "databaseSource": {
            "ar": "رابط URL لتحميل قاعدة البيانات منه",
            "en": "URL to download the database from."
        }
    }
});
