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
        description: "هل تريد إظهار زر كتم الصوت",
        restartNeeded: true,
    },
    showDeafenButton: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "هل تريد إظهار زر إخراس الصوت",
        restartNeeded: true,
    },
    muteSoundboard: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "تبديل لوحة الأصوات عند النقر على زر الإخراس.",
    },
    disableVideo: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "تعطيل الفيديو عند النقر على زر الإخراس.",
    },
    useServer: {
        type: OptionType.BOOLEAN,
        description: "استخدام كتم/إخراس السيرفر بدلاً من المحلي عند توفر الصلاحية.",
        default: false,
    },
    serverSelf: {
        type: OptionType.BOOLEAN,
        description: "إخراس/كتم نفسك في السيرفر عند استخدام أزرار الكتم/الإخراس.",
        default: false,
    },
    showButtonsSelf: {
        type: OptionType.SELECT,
        description: "هل تريد إظهار الأزرار لمستخدمك الخاص. نفس وظيفة الأزرار الأخرى لكنها ستفتح لوحة الرسائل المباشرة وتكتم/تخرس نفسك.",
        restartNeeded: true,
        options: [
            { label: "Display", value: "display", default: true },
            { label: "Hide", value: "hide" },
            { label: "Disable", value: "disable" },
        ],
    },
    whichNameToShow: {
        type: OptionType.SELECT,
        description: "اختر إظهار الاسم المستعار أو اسم المستخدم في التلميح.",
        options: [
            { label: "Both", value: "both", default: true },
            { label: "Global Name", value: "global" },
            { label: "Username", value: "username" },
        ],
    },
    buttonPosition: {
        type: OptionType.SELECT,
        description: "اختر مكان وضع أزرار الصوت في صف مستخدم الصوت.",
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
