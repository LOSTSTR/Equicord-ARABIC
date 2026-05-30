/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يدمج الرسائل المرسلة خلال فترة زمنية مع رسالتك السابقة إذا لم يرسل أحد آخر رسالة قبلك.",
        "en": "Merges messages sent within a time window with your previous message if no one else sent between them."
    },
    "options": {
        "timePeriod": {
            "ar": "مدة الدمج (بالثواني)",
            "en": "Time window in seconds to merge messages."
        },
        "shouldMergeWithAttachment": {
            "ar": "هل يجب دمج الرسالة إذا كانت الرسالة الأخيرة تحتوي على مرفق؟",
            "en": "Also merge messages that have attachments."
        },
        "useSpace": {
            "ar": "إضافة مسافة بين الرسائل عند الدمج بدلاً من أسطر جديدة.",
            "en": "Insert a space between merged messages."
        }
    }
});
