/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "تعطيل برامج ترميز البث التي تختارها",
        "en": "Disable streaming codecs of your choice."
    },
    "options": {
        "disableAv1Codec": {
            "ar": "يمنع Discord من استخدام AV1 في البث.",
            "en": "Disable the AV1 codec."
        },
        "disableH265Codec": {
            "ar": "منع Discord من استخدام H265 في البث.",
            "en": "Disable the H.265 codec."
        },
        "disableH264Codec": {
            "ar": "منع Discord من استخدام H264 في البث.",
            "en": "Disable the H.264 codec."
        },
        "disableVP8Codec": {
            "ar": "منع Discord من استخدام VP8 في البث.",
            "en": "Disable the VP8 codec."
        },
        "disableVP9Codec": {
            "ar": "منع Discord من استخدام VP9 في البث.",
            "en": "Disable the VP9 codec."
        }
    }
});
