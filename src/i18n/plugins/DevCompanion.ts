/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "أداة مطوري Vencord لتصحيح الأخطاء",
        "en": "Vencord developer tool for debugging."
    },
    "options": {
        "notifyOnAutoConnect": {
            "ar": "إشعار عند اتصال Dev Companion تلقائيًا.",
            "en": "Show a notification when DevCompanion auto-connects."
        },
        "usePatchedModule": {
            "ar": "عند طلبات الاستخراج، الرد بالوحدة المُرقّعة الحالية (إن كانت مُرقّعة) بدلاً من الأصلية.",
            "en": "Use the patched module in DevCompanion."
        },
        "reloadAfterToggle": {
            "ar": "إعادة التحميل عند استلام أمر تعطيل/تفعيل الإضافة.",
            "en": "Automatically reload Discord after toggling a plugin."
        }
    }
});
