/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُضيف ألوان IRC للرسائل",
        "en": "Adds IRC colors to messages."
    },
    "options": {
        "lightness": {
            "ar": "السطوع بالنسبة المئوية. عدّله إذا كانت الألوان فاتحة أو داكنة جداً",
            "en": "Color lightness adjustment."
        },
        "memberListColors": {
            "ar": "استبدال ألوان الرتب في قائمة الأعضاء",
            "en": "Apply IRC colors in the member list."
        },
        "applyColorOnlyToUsersWithoutColor": {
            "ar": "تطبيق الألوان فقط على المستخدمين الذين ليس لديهم لون محدد مسبقاً",
            "en": "Only apply IRC colors to users who have no role color."
        },
        "applyColorOnlyInDms": {
            "ar": "تطبيق الألوان في الرسائل المباشرة فقط؛ عدم تطبيقها في السيرفرات.",
            "en": "Only apply IRC colors in DMs."
        }
    }
});
