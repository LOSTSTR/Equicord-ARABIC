/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُتيح مشاهدة صور الخوادم والمستخدمين بدقة كاملة",
        "en": "Allows viewing server and user icons at full resolution."
    },
    "options": {
        "format": {
            "ar": "اختر صيغة الصورة للصور غير المتحركة. الصور المتحركة تستخدم .gif دائماً",
            "en": "File format to download icons in."
        },
        "imgSize": {
            "ar": "حجم الصورة للاستخدام",
            "en": "Resolution of the viewed icon."
        }
    }
});
