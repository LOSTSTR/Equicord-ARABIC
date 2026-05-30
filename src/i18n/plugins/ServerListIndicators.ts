/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُضيف مؤشرات مرئية في قائمة الخوادم",
        "en": "Adds visual indicators in the server list."
    },
    "options": {
        "mode": {
            "ar": "وضع العرض",
            "en": "Which indicator mode to use."
        },
        "useCompact": {
            "ar": "جعل المؤشر يظهر بالنص فقط",
            "en": "Use compact indicators."
        }
    }
});
