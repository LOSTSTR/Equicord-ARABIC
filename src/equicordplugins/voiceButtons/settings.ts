/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

export const settings = definePluginSettings({
    showChatButton: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "عرض زر الدردشة في لوحة الصوت",
        restartNeeded: true,
    },
    showMuteButton: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "عرض زر الكتم في لوحة الصوت",
        restartNeeded: true,
    },
    showDeafenButton: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "عرض زر التصميم في لوحة الصوت",
        restartNeeded: true,
    },
    muteSoundboard: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "كتم السبورد عند الضغط على زر التصميم",
    },
    disableVideo: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "إيقاف الكاميرا عند الضغط على زر التصميم",
    },
    useServer: {
        type: OptionType.BOOLEAN,
        description: "استخدام كتم/تصميم السيرفر عند توفر الصلاحية بدلاً من الكتم المحلي",
        default: false,
    },
    serverSelf: {
        type: OptionType.BOOLEAN,
        description: "تصميم/كتم نفسك على السيرفر عند استخدام أزرار الكتم/التصميم",
        default: false,
    },
    showButtonsSelf: {
        type: OptionType.SELECT,
        description: "عرض الأزرار لمستخدمك الخاص، مع نفس الوظيفة لكن تفتح الرسائل الخاصة وتكتم/تصمّ نفسك",
        restartNeeded: true,
        options: [
            { label: "Display", value: "display", default: true },
            { label: "Hide", value: "hide" },
            { label: "Disable", value: "disable" },
        ],
    },
    whichNameToShow: {
        type: OptionType.SELECT,
        description: "اختيار عرض اللقب أو اسم المستخدم في التلميح",
        options: [
            { label: "Both", value: "both", default: true },
            { label: "Global Name", value: "global" },
            { label: "Username", value: "username" },
        ],
    },
    buttonPosition: {
        type: OptionType.SELECT,
        description: "اختيار موضع أزرار الصوت في صف المستخدم",
        options: [
            { label: "Left", value: "left", default: true },
            { label: "Right", value: "right" },
        ],
    }
}, {
    useServer: {
        disabled() {
            return !this.store.showMuteButton && !this.store.showDeafenButton;
        },
    },
    serverSelf: {
        disabled() {
            return !this.store.useServer && !this.store.showMuteButton && !this.store.showDeafenButton;
        },
    }
});
