/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { t } from "@utils/esharqI18n";
import { Logger } from "@utils/Logger";
import { OptionType } from "@utils/types";

import { VoiceSettingSection } from "./VoiceSetting";

export const getDefaultVoice = () => window.speechSynthesis?.getVoices().find(v => v.default);

export function getCurrentVoice(voices = window.speechSynthesis?.getVoices()) {
    if (!voices) return undefined;

    if (settings.store.voice) {
        const voice = voices.find(v => v.voiceURI === settings.store.voice);
        if (voice) return voice;

        new Logger("VcNarrator").error(`Voice "${settings.store.voice}" not found. Resetting to default.`);
    }

    const voice = voices.find(v => v.default);
    settings.store.voice = voice?.voiceURI;
    return voice;
}

export const settings = definePluginSettings({
    voice: {
        type: OptionType.COMPONENT,
        component: VoiceSettingSection,
        get default() {
            return getDefaultVoice()?.voiceURI;
        }
    },
    volume: {
        type: OptionType.SLIDER,
        description: t("صوت الراوي", "Narrator volume"),
        default: 1,
        markers: [0, 0.25, 0.5, 0.75, 1],
        stickToMarkers: false
    },
    rate: {
        type: OptionType.SLIDER,
        description: t("سرعة الراوي", "Narrator rate"),
        default: 1,
        markers: [0.1, 0.5, 1, 2, 5, 10],
        stickToMarkers: false
    },
    sayOwnName: {
        description: t("نطق اسمك الخاص", "Say your own name"),
        type: OptionType.BOOLEAN,
        default: false
    },
    latinOnly: {
        description: t("إزالة الأحرف غير اللاتينية من الأسماء قبل نطقها", "Remove non-Latin characters from names before speaking them"),
        type: OptionType.BOOLEAN,
        default: false
    },
    joinMessage: {
        type: OptionType.STRING,
        description: t("رسالة الانضمام", "Join message"),
        default: "{{USER}} joined"
    },
    leaveMessage: {
        type: OptionType.STRING,
        description: t("رسالة المغادرة", "Leave message"),
        default: "{{USER}} left"
    },
    moveMessage: {
        type: OptionType.STRING,
        description: t("رسالة الانتقال", "Move message"),
        default: "{{USER}} moved to {{CHANNEL}}"
    },
    muteMessage: {
        type: OptionType.STRING,
        description: t("رسالة الكتم (للنفس فقط حالياً)", "Mute message (currently self only)"),
        default: "{{USER}} muted"
    },
    unmuteMessage: {
        type: OptionType.STRING,
        description: t("رسالة إلغاء الكتم (للنفس فقط حالياً)", "Unmute message (currently self only)"),
        default: "{{USER}} unmuted"
    },
    deafenMessage: {
        type: OptionType.STRING,
        description: t("رسالة الصمم (للنفس فقط حالياً)", "Deafen message (currently self only)"),
        default: "{{USER}} deafened"
    },
    undeafenMessage: {
        type: OptionType.STRING,
        description: t("رسالة إلغاء الصمم (للنفس فقط حالياً)", "Undeafen message (currently self only)"),
        default: "{{USER}} undeafened"
    }
});
