/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُعيد تشغيل العميل تلقائياً بعد فترة خمول قابلة للإعداد، مع تجنب إعادة التشغيل أثناء وجودك في قناة صوتية.",
        "en": "Automatically restarts the client after a configurable idle period, avoiding restarts while in voice."
    },
    "options": {
        "isEnabled": {
            "ar": "تفعيل إعادة التشغيل التلقائية عند الخمول",
            "en": "Enable automatic restart on idle."
        },
        "idleMinutes": {
            "ar": "دقائق الخمول قبل إعادة التشغيل (عند عدم التواجد في قناة صوتية)",
            "en": "Number of idle minutes before restarting."
        }
    }
});
