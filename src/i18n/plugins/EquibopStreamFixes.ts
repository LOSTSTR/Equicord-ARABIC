/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يحاول إصلاح جودة البث على Equibop عبر تعديل مشفّر Discord وقيود الجودة.",
        "en": "Attempts to fix streaming quality on Equibop by tweaking Discord's encoder and quality limits."
    },
    "options": {
        "unlockQualityOptions": {
            "ar": "فتح خيارات جودة البث بصرف النظر عن حالة النيترو",
            "en": "Unlock stream quality options regardless of Nitro status."
        },
        "removeResolutionCap": {
            "ar": "السماح بدقة أعلى من 720p عند 60 إطار في الثانية",
            "en": "Allow resolutions higher than 720p at 60fps."
        },
        "forceEncoderSettings": {
            "ar": "إجبار المشفّر على استخدام الدقة ومعدل الإطارات المضبوطين",
            "en": "Force the encoder to use the configured resolution and frame rate."
        },
        "preventDownscale": {
            "ar": "منع Discord من تقليل دقة البث",
            "en": "Prevent Discord from downscaling the stream resolution."
        },
        "keyframeInterval": {
            "ar": "فترة الإطار الرئيسي بالمللي ثانية (0 = افتراضي المشفّر، 5000 = كل 5 ثوانٍ)",
            "en": "Keyframe interval in milliseconds (0 = encoder default, 5000 = every 5 seconds)."
        },
        "minBitrate": {
            "ar": "الحد الأدنى لمعدل بت المشفّر بـ kbps",
            "en": "Minimum encoder bitrate in kbps."
        },
        "raiseBitrateCaps": {
            "ar": "رفع حدود معدل بت سطح المكتب الافتراضية (600kbps هدف ← 10Mbps، 3.5Mbps حد أقصى ← 40Mbps)",
            "en": "Raise the default desktop bitrate caps (600kbps target → 10Mbps, 3.5Mbps max → 40Mbps)."
        },
        "preventFramerateReduction": {
            "ar": "منع Discord من تقليل معدل إطارات البث عند التوقف عن الكلام",
            "en": "Prevent Discord from reducing stream frame rate when not speaking."
        },
        "bitsPerPixelPct": {
            "ar": "نسبة بتات لكل بكسل لمعدل البت المستهدف (8 = 0.08 bpp، 12 = 0.12 bpp)",
            "en": "Bits-per-pixel percentage for the target bitrate (8 = 0.08 bpp, 12 = 0.12 bpp)."
        }
    }
});
