/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { t } from "@utils/esharqI18n";
import { OptionType } from "@utils/types";

const settings = definePluginSettings({
    logJoinLeave: {
        type: OptionType.BOOLEAN,
        description: t("تسجيل دخول/خروج/انتقال المستخدمين بين القنوات الصوتية", "Log users joining/leaving/moving between voice channels"),
        default: true
    },
    logSoundboard: {
        type: OptionType.BOOLEAN,
        description: t("تسجيل عندما يشغّل المستخدمون أصوات لوحة الأصوات.", "Log when users play soundboard sounds."),
        default: true
    },
    logMuteDeafen: {
        type: OptionType.BOOLEAN,
        description: t("تسجيل عندما يُكتَم المستخدمون أو يُخرَسون في السيرفر.", "Log when users are server muted or deafened."),
        default: true
    },
    logVideo: {
        type: OptionType.BOOLEAN,
        description: t("تسجيل عندما يشغّل المستخدمون الكاميرا أو يطفئونها.", "Log when users turn their camera on or off."),
        default: true
    },
    logStream: {
        type: OptionType.BOOLEAN,
        description: t("تسجيل عندما يبدأ المستخدمون مشاركة الشاشة أو يوقفونها.", "Log when users start or stop screen sharing."),
        default: true
    },
    logActivity: {
        type: OptionType.BOOLEAN,
        description: t("تسجيل عندما يبدأ المستخدمون الأنشطة المدمجة.", "Log when users start embedded activities."),
        default: true
    },
    ignoreBlockedUsers: {
        type: OptionType.BOOLEAN,
        description: t("عدم تسجيل المستخدمين المحظورين.", "Don't log blocked users."),
        default: false
    },
    soundboardFileType: {
        type: OptionType.SELECT,
        description: t("تنسيق الملف لتنزيل أصوات لوحة الأصوات.", "File format for downloading soundboard sounds."),
        options: [
            { label: ".ogg", value: ".ogg", default: true },
            { label: ".mp3", value: ".mp3" },
            { label: ".wav", value: ".wav" },
        ],
    },
    soundboardVolume: {
        type: OptionType.SLIDER,
        description: t("مستوى صوت المعاينة لأصوات لوحة الأصوات (0 للتعطيل).", "Preview volume for soundboard sounds (0 to disable)."),
        default: 0.5,
        markers: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
    },
});

export default settings;
