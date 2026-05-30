/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُزيل رسائل التحقق ونوافذ التحذير عند فتح روابط خارجية أو تحميل ملفات",
        "en": "Removes verification prompts and warning dialogs when opening external links or downloading files."
    },
    "options": {
        "domain": {
            "ar": "إزالة نافذة التحذير عند فتح روابط من نطاقات غير موثوقة",
            "en": "Remove the warning popup when opening links from untrusted domains."
        },
        "file": {
            "ar": "إزالة نافذة 'التحميل الخطير المحتمل' عند فتح الروابط",
            "en": "Remove the 'Potentially dangerous download' popup when opening links."
        },
        "noDeleteSafety": {
            "ar": "إزالة شرط إدخال اسم السيرفر عند حذفه",
            "en": "Remove the server name input requirement when deleting it."
        },
        "confirmModal": {
            "ar": "هل يجب إظهار نافذة تأكيد 'هل أنت متأكد من الحذف'؟",
            "en": "Show a 'Are you sure you want to delete?' confirmation modal."
        }
    }
});
