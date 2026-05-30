/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يُعدّل رسائلك لجعلها أجمل وأفضل نحوياً. راجع الإعدادات",
        "en": "Adjusts your messages to make them more polished and grammatically correct. See settings."
    },
    "options": {
        "quickDisable": {
            "ar": "تعطيل سريع. يوقف تعديل الرسائل دون الحاجة لإعادة تشغيل العميل.",
            "en": "Quickly disable the plugin from the toolbar."
        },
        "blockedWords": {
            "ar": "الكلمات التي لن يتم تكبيرها (مفصولة بفاصلة).",
            "en": "Words to exclude from processing."
        },
        "fixApostrophes": {
            "ar": "ضمان احتواء الاختصارات على الفواصل العليا.",
            "en": "Fix missing apostrophes."
        },
        "expandContractions": {
            "ar": "توسيع الاختصارات.",
            "en": "Expand contractions (e.g. don't → do not)."
        },
        "fixCapitalization": {
            "ar": "تكبير بداية الجمل.",
            "en": "Fix sentence capitalization."
        },
        "fixPunctuation": {
            "ar": "إضافة علامات الترقيم للجمل.",
            "en": "Fix missing punctuation."
        },
        "fixPunctuationFrequency": {
            "ar": "تكرار وضع النقطة بالنسبة المئوية (قد يزعج بعض الناس كثيراً).",
            "en": "How often to fix punctuation."
        }
    }
});
