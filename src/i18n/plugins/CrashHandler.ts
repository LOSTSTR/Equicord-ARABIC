/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يتعامل مع أعطال ديسكورد ويُتيح التعافي منها",
        "en": "Handles Discord crashes and allows recovery."
    },
    "options": {
        "attemptToPreventCrashes": {
            "ar": "محاولة منع انهيار Discord تلقائيًا.",
            "en": "Attempt to prevent Discord from crashing."
        },
        "attemptToNavigateToHome": {
            "ar": "محاولة الانتقال إلى الصفحة الرئيسية عند منع أعطال Discord.",
            "en": "Attempt to navigate to the home page when a crash is detected."
        }
    }
});
