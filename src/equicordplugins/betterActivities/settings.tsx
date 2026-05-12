/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";
import { React } from "@webpack/common";

export const settings = definePluginSettings({
    memberList: {
        type: OptionType.BOOLEAN,
        description: "عرض أيقونات النشاط في قائمة الأعضاء",
        default: true,
        restartNeeded: true,
    },
    iconSize: {
        type: OptionType.SLIDER,
        description: "حجم أيقونات النشاط",
        markers: [10, 15, 20],
        default: 15,
        stickToMarkers: false,
    },
    specialFirst: {
        type: OptionType.BOOLEAN,
        description: "عرض الأنشطة المميزة أولاً (حالياً: Spotify و Twitch)",
        default: true,
        restartNeeded: false,
    },
    renderGifs: {
        type: OptionType.BOOLEAN,
        description: "السماح بتشغيل الصور المتحركة (GIF)",
        default: true,
        restartNeeded: false,
    },
    removeGameActivityStatus: {
        type: OptionType.BOOLEAN,
        description: "إزالة أيقونة نشاط الألعاب والحالة المرتبطة بها",
        default: false,
        restartNeeded: true,
    },
    divider: {
        type: OptionType.COMPONENT,
        description: "",
        component: () => (
            <div style={{
                width: "100%",
                height: 1,
                borderTop: "thin solid var(--input-border-default, var(--input-border))",
                paddingTop: 5,
                paddingBottom: 5
            }} />
        ),
    },
    userPopout: {
        type: OptionType.BOOLEAN,
        description: "عرض جميع الأنشطة في نافذة الملف الشخصي/الشريط الجانبي",
        default: true,
        restartNeeded: true,
    },
    hideTooltip: {
        type: OptionType.BOOLEAN,
        description: "إخفاء الأنشطة في أماكن متعددة",
        default: true,
    },
    allActivitiesStyle: {
        type: OptionType.SELECT,
        description: "أسلوب عرض جميع الأنشطة",
        options: [
            {
                default: true,
                label: "Carousel",
                value: "carousel",
            },
            {
                label: "List",
                value: "list",
            },
        ]
    }
});
