/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يعرض أذونات الخادم والأدوار بشكل مفصّل",
        "en": "Shows server and role permissions in detail."
    },
    "options": {
        "permissionsSortOrder": {
            "ar": "طريقة الفرز لتحديد أي رتبة تمنح المستخدم صلاحية معينة",
            "en": "Sort order for permissions in the viewer."
        }
    }
});
