/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُطبّق لون الدور على الأسماء في جميع أماكن ديسكورد",
        "en": "Applies the role color to names in all places in Discord."
    },
    "options": {
        "chatMentions": {
            "ar": "اعرض ألوان الرتب في الإشارات بالمحادثة (بما فيها صندوق الرسائل)",
            "en": "Apply role colors to mentions in chat."
        },
        "memberList": {
            "ar": "عرض ألوان الأدوار في رؤوس أقسام الأدوار في قائمة الأعضاء",
            "en": "Apply role colors in the member list."
        },
        "voiceUsers": {
            "ar": "عرض ألوان الأدوار في قائمة مستخدمي الدردشة الصوتية",
            "en": "Apply role colors to users in voice channels."
        },
        "reactorsList": {
            "ar": "عرض ألوان الأدوار في قائمة المتفاعلين",
            "en": "Apply role colors in the reactors list."
        },
        "pollResults": {
            "ar": "عرض ألوان الأدوار في نتائج الاستطلاعات",
            "en": "Apply role colors in poll results."
        },
        "colorChatMessages": {
            "ar": "تلوين رسائل الدردشة بناءً على لون دور المؤلف",
            "en": "Apply role colors to message text."
        },
        "messageSaturation": {
            "ar": "شدة تلوين الرسائل.",
            "en": "Saturation of the role color applied to messages."
        }
    }
});
