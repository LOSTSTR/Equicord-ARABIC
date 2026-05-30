/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُغيّر اقتباسات شاشة التحميل",
        "en": "Changes the loading screen quotes."
    },
    "options": {
        "replaceEvents": {
            "ar": "تطبيق الإضافة أيضاً خلال الفعاليات ذات الاقتباسات الخاصة (مثل الهالوين)",
            "en": "Also replace event-related loading quotes."
        },
        "enablePluginPresetQuotes": {
            "ar": "تفعيل الاقتباسات المحددة مسبقاً بواسطة هذه الإضافة",
            "en": "Enable the preset quotes added by plugins."
        },
        "enableDiscordPresetQuotes": {
            "ar": "تفعيل اقتباسات Discord المحددة مسبقاً (بما في ذلك اقتباسات الفعاليات)",
            "en": "Enable Discord's default preset quotes."
        },
        "additionalQuotes": {
            "ar": "اقتباسات مخصصة إضافية قد تظهر، مفصولة بالمحدد أدناه",
            "en": "Additional custom quotes to show on the loading screen."
        },
        "additionalQuotesDelimiter": {
            "ar": "محدد الاقتباسات الإضافية",
            "en": "Delimiter used between custom quotes."
        }
    }
});
