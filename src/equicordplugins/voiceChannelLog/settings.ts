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
        description: "تسجيل عندما يشغّل المستخدمون أصوات لوحة الأصوات.",
        default: true
    },
    logMuteDeafen: {
        type: OptionType.BOOLEAN,
        description: "تسجيل عندما يُكتَم المستخدمون أو يُخرَسون في السيرفر.",
        default: true
    },
    logVideo: {
        type: OptionType.BOOLEAN,
        description: "تسجيل عندما يشغّل المستخدمون الكاميرا أو يطفئونها.",
        default: true
    },
    logStream: {
        type: OptionType.BOOLEAN,
        description: "تسجيل عندما يبدأ المستخدمون مشاركة الشاشة أو يوقفونها.",
        default: true
    },
    logActivity: {
        type: OptionType.BOOLEAN,
        description: "تسجيل عندما يبدأ المستخدمون الأنشطة المدمجة.",
        default: true
    },
    ignoreBlockedUsers: {
        type: OptionType.BOOLEAN,
        description: "عدم تسجيل المستخدمين المحظورين.",
        default: false
    },
    soundboardFileType: {
        type: OptionType.SELECT,
        description: "تنسيق الملف لتنزيل أصوات لوحة الأصوات.",
        options: [
            { label: ".ogg", value: ".ogg", default: true },
            { label: ".mp3", value: ".mp3" },
            { label: ".wav", value: ".wav" },
        ],
    },
    soundboardVolume: {
        type: OptionType.SLIDER,
        description: "مستوى صوت المعاينة لأصوات لوحة الأصوات (0 للتعطيل).",
        default: 0.5,
        markers: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
    },
});

export default settings;
