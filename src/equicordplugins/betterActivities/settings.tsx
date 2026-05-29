/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { t } from "@utils/esharqI18n";
import { OptionType } from "@utils/types";
import { React } from "@webpack/common";

export const settings = definePluginSettings({
    memberList: {
        type: OptionType.BOOLEAN,
        description: t("عرض أيقونات النشاط في قائمة الأعضاء", "Show activity icons in the member list"),
        default: true,
        restartNeeded: true,
    },
    iconSize: {
        type: OptionType.SLIDER,
        description: t("حجم أيقونات النشاط", "Activity icon size"),
        markers: [10, 15, 20],
        default: 15,
        stickToMarkers: false,
    },
    specialFirst: {
        type: OptionType.BOOLEAN,
        description: t("عرض الأنشطة المميزة أولاً (حالياً: Spotify و Twitch)", "Show special activities first (currently: Spotify and Twitch)"),
        default: true,
        restartNeeded: false,
    },
    renderGifs: {
        type: OptionType.BOOLEAN,
        description: t("السماح بتشغيل الصور المتحركة (GIF)", "Allow playing animated GIFs"),
        default: true,
        restartNeeded: false,
    },
    removeGameActivityStatus: {
        type: OptionType.BOOLEAN,
        description: t("إزالة أيقونة نشاط الألعاب والحالة المرتبطة بها", "Remove game activity icon and its associated status"),
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
        description: t("عرض جميع الأنشطة في نافذة الملف الشخصي/الشريط الجانبي", "Show all activities in profile popout/sidebar"),
        default: true,
        restartNeeded: true,
    },
    hideTooltip: {
        type: OptionType.BOOLEAN,
        description: t("إخفاء الأنشطة في أماكن متعددة", "Hide activities in multiple places"),
        default: true,
    },
    allActivitiesStyle: {
        type: OptionType.SELECT,
        description: t("أسلوب عرض جميع الأنشطة", "Style for showing all activities"),
        options: [
            {
                default: true,
                label: t("دوّار", "Carousel"),
                value: "carousel",
            },
            {
                label: t("قائمة", "List"),
                value: "list",
            },
        ]
    }
});
