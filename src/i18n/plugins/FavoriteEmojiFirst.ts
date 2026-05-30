/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُظهر إيموجيك المفضلة في مقدمة قائمة الإيموجي",
        "en": "Shows your favorite emoji at the top of the emoji list."
    },
    "options": {
        "aliases": {
            "ar": "إدارة اختصارات الإيموجي الخاصة بك.",
            "en": "Aliases to add to favorite emoji."
        },
        "clearAll": {
            "ar": "حذف جميع الاختصارات.",
            "en": "Clear all emoji aliases."
        }
    }
});
