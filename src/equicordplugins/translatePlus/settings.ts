/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { t } from "@utils/esharqI18n";
import { OptionType } from "@utils/types";

export const settings = definePluginSettings({
    target: {
        type: OptionType.STRING,
        description: t("اللغة المستهدفة", "Target language"),
        default: "en",
        restartNeeded: true
    },
    toki: {
        type: OptionType.BOOLEAN,
        description: t("تفعيل لغة Toki Pona", "Enable Toki Pona language"),
        default: true,
        restartNeeded: true
    },
    sitelen: {
        type: OptionType.BOOLEAN,
        description: t("تفعيل كتابة Sitelen Pona", "Enable Sitelen Pona script"),
        default: true,
        restartNeeded: true
    },
    shavian: {
        type: OptionType.BOOLEAN,
        description: t("تفعيل الحروف الشيفية", "Enable Shavian script"),
        default: true,
        restartNeeded: true
    }
});
