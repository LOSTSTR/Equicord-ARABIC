/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُزيل إشعار الذكر من الردود تلقائياً",
        "en": "Automatically removes the mention ping from replies."
    },
    "options": {
        "userList": {
            "ar": "قائمة معرّفات المستخدمين المسموح لهم أو المستثنين من المنشن (مفصولة بفواصل أو مسافات)",
            "en": "Users to always or never ping when replying."
        },
        "roleList": {
            "ar": "قائمة معرّفات الرتب المسموح لها أو المستثناة من الإشارات (مفصولة بفواصل أو مسافات)",
            "en": "Roles to always or never ping when replying."
        },
        "shouldPingListed": {
            "ar": "السلوك",
            "en": "If enabled, listed users/roles are always pinged; if disabled, they are never pinged."
        },
        "inverseShiftReply": {
            "ar": "عكس سلوك الرد مع Shift في Discord (فعّله لجعل الرد بـ Shift يُشير إلى المستخدم)",
            "en": "Swap the Shift+Enter reply behavior (ping by default when Shift is not held)."
        }
    }
});
