/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُضيف مؤقتاً للمكالمات الصوتية",
        "en": "Adds a timer to voice calls."
    },
    "options": {
        "format": {
            "ar": "صيغة مضغوطة أو قابلة للقراءة:",
            "en": "Compact or human-readable format."
        },
        "allCallTimers": {
            "ar": "إضافة مؤقت المكالمة لجميع المستخدمين في قناة صوت بالسيرفر",
            "en": "Add a call timer for all users in a server voice channel."
        },
        "showWithoutHover": {
            "ar": "إظهار المؤقت دائماً دون الحاجة للمرور بالمؤشر فوقه",
            "en": "Always show the timer without needing to hover over it."
        },
        "showRoleColor": {
            "ar": "إظهار لون رتبة المستخدم (إذا كانت هذه الإضافة مفعلة)",
            "en": "Show the user's role color (if the RoleColorEverywhere plugin is enabled)."
        },
        "trackSelf": {
            "ar": "تتبع وقت انضمامك أنت أيضاً",
            "en": "Also track your own join time."
        },
        "showSeconds": {
            "ar": "إظهار الثواني في المؤقت",
            "en": "Show seconds in the timer."
        },
        "watchLargeGuilds": {
            "ar": "تتبع المستخدمين في السيرفرات الكبيرة. قد يسبب بطئاً إذا كنت في سيرفرات كبيرة كثيرة بمستخدمي صوت نشطين. تم اختباره مع ما يصل إلى 2000 مستخدم صوت نشط دون مشاكل.",
            "en": "Track users in large servers. May cause lag if you are in many large servers with active voice users."
        }
    }
});
