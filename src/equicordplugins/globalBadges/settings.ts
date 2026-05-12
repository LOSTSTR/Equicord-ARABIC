/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

export const settings = definePluginSettings({
    showPrefix: {
        type: OptionType.BOOLEAN,
        description: "يعرض اسم الموديفيكيشن كبادئة للشارة",
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
        description: "يعرض اسم الموديفيكيشن كلاحقة للشارة",
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
        description: "إظهار الشارات المخصصة",
        default: true,
        restartNeeded: false
    },
    showNekocord: {
        type: OptionType.BOOLEAN,
        description: "إظهار شارات Nekocord",
        default: true,
        restartNeeded: false
    },
    showReviewDB: {
        type: OptionType.BOOLEAN,
        description: "إظهار شارات ReviewDB",
        default: true,
        restartNeeded: false
    },
    showAero: {
        type: OptionType.BOOLEAN,
        description: "إظهار شارات Aero",
        default: true,
        restartNeeded: false
    },
    showAliucord: {
        type: OptionType.BOOLEAN,
        description: "إظهار شارات Aliucord",
        default: true,
        restartNeeded: false
    },
    showRaincord: {
        type: OptionType.BOOLEAN,
        description: "إظهار شارات Raincord",
        default: true,
        restartNeeded: false
    },
    showVelocity: {
        type: OptionType.BOOLEAN,
        description: "إظهار شارات Velocity",
        default: true,
        restartNeeded: false
    },
    showEnmity: {
        type: OptionType.BOOLEAN,
        description: "إظهار شارات Enmity",
        default: true,
        restartNeeded: false
    },
    showPaicord: {
        type: OptionType.BOOLEAN,
        description: "إظهار شارات Paicord",
        default: true,
        restartNeeded: false
    },
    apiUrl: {
        type: OptionType.STRING,
        description: "واجهة برمجة التطبيقات المستخدمة",
        default: "https://badges.equicord.org/",
        restartNeeded: false,
        isValid: (value => {
            if (!value) return false;
            return true;
        })
    }
});
