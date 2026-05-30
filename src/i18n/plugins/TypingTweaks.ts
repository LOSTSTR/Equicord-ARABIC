/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُحسّن مؤشر الكتابة بالأفاتار والأسماء",
        "en": "Improves the typing indicator with avatars and names."
    },
    "options": {
        "showAvatars": {
            "ar": "عرض الصور الرمزية في مؤشر الكتابة",
            "en": "Show user avatars in the typing indicator."
        },
        "showRoleColors": {
            "ar": "عرض ألوان الأدوار في مؤشر الكتابة",
            "en": "Show role colors in the typing indicator."
        },
        "alternativeFormatting": {
            "ar": "عرض رسالة أكثر فائدة عندما يكتب عدة مستخدمين",
            "en": "Use alternative formatting for the typing indicator."
        },
        "amITyping": {
            "ar": "يُظهر لك ما إذا كان الآخرون يرون أنك تكتب",
            "en": "Show yourself in the typing indicator when you are typing."
        }
    }
});
