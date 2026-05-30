/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يعرض ملف تعريف الخادم بدلاً من الملف الشخصي العام عند النقر على لوحة الحساب",
        "en": "Shows the server profile instead of the global profile when clicking the account panel."
    },
    "options": {
        "prioritizeServerProfile": {
            "ar": "إعطاء الأولوية لملف سيرفر عند النقر بزر الفأرة الأيسر على لوحة حسابك",
            "en": "Prioritize the server profile when left-clicking your account panel."
        }
    }
});
