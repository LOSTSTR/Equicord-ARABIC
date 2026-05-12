/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

export const settings = definePluginSettings({
    target: {
        type: OptionType.STRING,
        description: "اللغة المستهدفة",
        default: "en",
        restartNeeded: true
    },
    toki: {
        type: OptionType.BOOLEAN,
        description: "تفعيل لغة Toki Pona",
        default: true,
        restartNeeded: true
    },
    sitelen: {
        type: OptionType.BOOLEAN,
        description: "تفعيل كتابة Sitelen Pona",
        default: true,
        restartNeeded: true
    },
    shavian: {
        type: OptionType.BOOLEAN,
        description: "تفعيل الحروف الشيفية",
        default: true,
        restartNeeded: true
    }
});
