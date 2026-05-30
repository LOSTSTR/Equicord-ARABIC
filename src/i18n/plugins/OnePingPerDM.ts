/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُرسل إشعاراً واحداً فقط لكل محادثة خاصة",
        "en": "Sends only one notification per DM conversation."
    },
    "options": {
        "channelToAffect": {
            "ar": "اختر نوع المحادثة الخاصة التي تؤثر عليها الإضافة",
            "en": "Whether to apply this to DMs, group DMs, or both."
        },
        "allowMentions": {
            "ar": "تلقّي إشعارات صوتية عند @الإشارة",
            "en": "Always notify on direct mentions."
        },
        "allowEveryone": {
            "ar": "تلقّي إشعارات صوتية عند @everyone و @here في المجموعات",
            "en": "Always notify on @everyone mentions."
        },
        "ignoreUsers": {
            "ar": "معرّفات المستخدمين (مفصولة بفاصلة ومسافة) الذين يجب ألا تُحدَّ إشعاراتهم أبداً",
            "en": "User IDs to always notify for."
        },
        "alwaysPlaySound": {
            "ar": "تشغيل صوت إشعار الرسائل حتى عند تعطيله",
            "en": "Always play a sound even if the tab is focused."
        }
    }
});
