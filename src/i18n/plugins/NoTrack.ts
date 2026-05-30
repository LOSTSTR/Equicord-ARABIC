/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "تعطيل تتبع Discord (التحليلات/الإحصاءات) ومقاييس الأداء وتقارير أعطال Sentry",
        "en": "Disable Discord tracking (analytics/metrics), performance metrics, and Sentry crash reports."
    },
    "options": {
        "disableAnalytics": {
            "ar": "تعطيل تتبع Discord للبيانات (التحليلات)",
            "en": "Disable Discord's analytics/telemetry."
        }
    }
});
