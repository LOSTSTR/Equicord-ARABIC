/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُحسّن صفحة الجلسات بالأجهزة ويُضيف رموز تعريفية",
        "en": "Improves the sessions page and adds identifiers."
    },
    "options": {
        "backgroundCheck": {
            "ar": "التحقق من الجلسات الجديدة في الخلفية وعرض إشعارات عند اكتشافها",
            "en": "Check for suspicious sessions in the background and send a notification."
        },
        "checkInterval": {
            "ar": "عدد الدقائق بين كل فحص للجلسات الجديدة في الخلفية (إذا كان مفعلاً)",
            "en": "How often to check for suspicious sessions (in minutes)."
        }
    }
});
