/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يضيف احتمالية قابلة للإعداد لإخافتك في كل مرة تفتح فيها قناة. مستوحى من Geometry Dash Mega Hack",
        "en": "Adds a configurable chance of jump-scaring you each time you open a channel. Inspired by Geometry Dash Mega Hack."
    },
    "options": {
        "imageSource": {
            "ar": "رابط صورة المفاجأة المرعبة",
            "en": "URL of the jump-scare image."
        },
        "audioSource": {
            "ar": "رابط صوت المفاجأة المرعبة",
            "en": "URL of the jump-scare audio."
        },
        "chance": {
            "ar": "احتمالية حدوث المفاجأة المرعبة (1 من X، مثال: 100 = 1/100 أي 1%، 50 = 1/50 أي 2%، إلخ)",
            "en": "Probability of a jump-scare (1 in X, e.g. 100 = 1%, 50 = 2%)."
        }
    }
});
