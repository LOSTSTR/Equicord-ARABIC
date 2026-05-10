/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

const settings = definePluginSettings({
    logJoinLeave: {
        type: OptionType.BOOLEAN,
        description: "تسجيل دخول/خروج/انتقال المستخدمين بين القنوات الصوتية",
        default: true
    },
    logSoundboard: {
        type: OptionType.BOOLEAN,
        description: "تسجيل عند تشغيل المستخدمين أصوات السبورد",
        default: true
    },
    logMuteDeafen: {
        type: OptionType.BOOLEAN,
        description: "تسجيل عند كتم/تصميم المستخدمين على مستوى السيرفر",
        default: true
    },
    logVideo: {
        type: OptionType.BOOLEAN,
        description: "تسجيل عند تشغيل/إيقاف المستخدمين لكاميراتهم",
        default: true
    },
    logStream: {
        type: OptionType.BOOLEAN,
        description: "تسجيل عند بدء/إيقاف مشاركة الشاشة",
        default: true
    },
    logActivity: {
        type: OptionType.BOOLEAN,
        description: "تسجيل عند بدء المستخدمين للأنشطة المدمجة",
        default: true
    },
    ignoreBlockedUsers: {
        type: OptionType.BOOLEAN,
        description: "عدم تسجيل نشاط المستخدمين المحجوبين",
        default: false
    },
    soundboardFileType: {
        type: OptionType.SELECT,
        description: "صيغة الملف عند تحميل أصوات السبورد",
        options: [
            { label: ".ogg", value: ".ogg", default: true },
            { label: ".mp3", value: ".mp3" },
            { label: ".wav", value: ".wav" },
        ],
    },
    soundboardVolume: {
        type: OptionType.SLIDER,
        description: "مستوى صوت المعاينة لأصوات السبورد (0 للتعطيل)",
        default: 0.5,
        markers: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
    },
});

export default settings;
