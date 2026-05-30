/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يستبدل لون النقطة في الاسم بالإيموجي المخصصة للأدوار",
        "en": "Replaces the role dot color in names with custom role emoji."
    },
    "options": {
        "bothStyles": {
            "ar": "عرض نقطة الرتبة والأسماء الملونة معاً",
            "en": "Show both the role dot and the role emoji."
        },
        "copyRoleColorInProfilePopout": {
            "ar": "السماح بالنقر على نقطة الرتبة في بطاقة الملف الشخصي لنسخ لون الرتبة",
            "en": "Add a copy button for role colors in the profile popout."
        }
    }
});
