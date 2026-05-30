/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يضيف أمراً لإرسال رابط بحث على الإنترنت",
        "en": "Adds a command to send an internet search link."
    },
    "options": {
        "hyperlink": {
            "ar": "يجعل الرابط المرسل نصاً مشار إليه باستخدام الاستعلام كعنوان",
            "en": "Make the sent link a hyperlink using the query as the title."
        },
        "embed": {
            "ar": "ما إذا كان الرابط المرسل يجب أن يُظهر معاينة",
            "en": "Whether the sent link should show a preview embed."
        },
        "defaultEngine": {
            "ar": "محرك البحث المستخدم",
            "en": "The search engine to use."
        },
        "customEngineURL": {
            "ar": "رابط محرك البحث الذي تريد استخدامه",
            "en": "URL of the custom search engine you want to use."
        }
    }
});
