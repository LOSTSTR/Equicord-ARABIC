/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { t } from "@utils/esharqI18n";
import { OptionType } from "@utils/types";

export const settings = definePluginSettings({
    showPrefix: {
        type: OptionType.BOOLEAN,
        description: t("يعرض اسم الموديفيكيشن كبادئة للشارة", "Show mod name as a prefix on the badge"),
        default: true,
        restartNeeded: false,
        onChange: (e => {
            if (e && settings.store.showSuffix) {
                settings.store.showSuffix = false;
            }
        })
    },
    showSuffix: {
        type: OptionType.BOOLEAN,
        description: t("يعرض اسم الموديفيكيشن كلاحقة للشارة", "Show mod name as a suffix on the badge"),
        default: false,
        restartNeeded: false,
        onChange: (e => {
            if (e && settings.store.showPrefix) {
                settings.store.showPrefix = false;
            }
        })
    },
    showCustom: {
        type: OptionType.BOOLEAN,
        description: t("إظهار الشارات المخصصة", "Show custom badges"),
        default: true,
        restartNeeded: false
    },
    showNekocord: {
        type: OptionType.BOOLEAN,
        description: t("إظهار شارات Nekocord", "Show Nekocord badges"),
        default: true,
        restartNeeded: false
    },
    showReviewDB: {
        type: OptionType.BOOLEAN,
        description: t("إظهار شارات ReviewDB", "Show ReviewDB badges"),
        default: true,
        restartNeeded: false
    },
    showAero: {
        type: OptionType.BOOLEAN,
        description: t("إظهار شارات Aero", "Show Aero badges"),
        default: true,
        restartNeeded: false
    },
    showAliucord: {
        type: OptionType.BOOLEAN,
        description: t("إظهار شارات Aliucord", "Show Aliucord badges"),
        default: true,
        restartNeeded: false
    },
    showRaincord: {
        type: OptionType.BOOLEAN,
        description: t("إظهار شارات Raincord", "Show Raincord badges"),
        default: true,
        restartNeeded: false
    },
    showVelocity: {
        type: OptionType.BOOLEAN,
        description: t("إظهار شارات Velocity", "Show Velocity badges"),
        default: true,
        restartNeeded: false
    },
    showEnmity: {
        type: OptionType.BOOLEAN,
        description: t("إظهار شارات Enmity", "Show Enmity badges"),
        default: true,
        restartNeeded: false
    },
    showPaicord: {
        type: OptionType.BOOLEAN,
        description: t("إظهار شارات Paicord", "Show Paicord badges"),
        default: true,
        restartNeeded: false
    },
    apiUrl: {
        type: OptionType.STRING,
        description: t("واجهة برمجة التطبيقات المستخدمة", "API URL used"),
        default: "https://badges.equicord.org/",
        restartNeeded: false,
        isValid: (value => {
            if (!value) return false;
            return true;
        })
    }
});
