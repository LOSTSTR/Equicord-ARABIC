/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يعرض القناة الصوتية التي يتواجد فيها المستخدم في ملفه الشخصي",
        "en": "Shows the voice channel a user is in on their profile."
    },
    "options": {
        "showInUserProfileModal": {
            "ar": "عرض مؤشر القناة الصوتية للمستخدم في ملفه الشخصي بجانب الاسم",
            "en": "Show the voice channel in the user profile modal."
        },
        "showInMemberList": {
            "ar": "عرض مؤشر القناة الصوتية للمستخدم في قائمة الأعضاء والرسائل المباشرة",
            "en": "Show the voice channel in the member list."
        },
        "showInMessages": {
            "ar": "عرض مؤشر القناة الصوتية للمستخدم في الرسائل",
            "en": "Show the voice channel next to usernames in messages."
        }
    }
});
