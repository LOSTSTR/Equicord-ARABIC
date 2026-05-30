/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يظهر شبح لطيف إذا لم تردّ على رسائلهم المباشرة",
        "en": "Shows a ghost indicator if you haven't replied to their DMs."
    },
    "options": {
        "showIndicator": {
            "ar": "يعرض عداد الأشباح أعلى قائمة السيرفرات",
            "en": "Show the ghost indicator."
        },
        "showDmIcons": {
            "ar": "إظهار أيقونات الشبح بجانب الرسائل المباشرة الفردية",
            "en": "Show ghost icons in the DM list."
        },
        "ignoreGroupDms": {
            "ar": "استبعاد جميع رسائل المجموعات من التشبيح",
            "en": "Ignore group DMs."
        },
        "exemptedChannels": {
            "ar": "قائمة معرّفات القنوات المعفاة من التشبيح مفصولة بفواصل (انقر بزر الماوس الأيمن على قناة رسائل مباشرة لنسخ معرّفها)",
            "en": "Channels exempt from the ghost indicator."
        },
        "ignoreBots": {
            "ar": "تجاهل الرسائل المباشرة من البوتات",
            "en": "Ignore messages from bots."
        },
        "maxInactiveTimeMs": {
            "ar": "تشبيح الرسائل المباشرة النشطة فقط خلال هذا الإطار الزمني",
            "en": "Maximum inactive time before showing the ghost indicator (in milliseconds)."
        }
    }
});
