/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { MessageSendListener } from "@api/MessageEvents";
import { definePluginSettings } from "@api/Settings";
import { EquicordDevs } from "@utils/constants";
import { getCurrentChannel, sendMessage } from "@utils/discord";
import { t } from "@utils/esharqI18n";
import definePlugin, { OptionType } from "@utils/types";
import { ChannelStore, ComponentDispatch, PermissionsBits, UserStore } from "@webpack/common";

let maxLength: number = 0;

const canSplit: () => boolean = () => {
    const slowmode = getCurrentChannel()?.rateLimitPerUser ?? 0;
    return (settings.store.splitInSlowmode ? slowmode < settings.store.slowmodeMax : slowmode <= 0) && settings.store.disableFileConversion;
};

const autoMaxLength = () => {
    const hasNitro = UserStore.getCurrentUser()?.premiumType === 2;
    return hasNitro ? 4000 : 2000;
};

const split = async (channelId: string, chunks: string[], delayInMs: number) => {
    const sendChunk = async (chunk: string) => {
        await sendMessage(channelId, { content: chunk }, true);
    };

    // Send the chunks
    for (let i = 0; i < chunks.length; i++) {
        await sendChunk(chunks[i]);
        if (i < chunks.length - 1) // Not the last chunk
            await new Promise(resolve => setTimeout(resolve, delayInMs)); // Wait for `delayInMs`
    }
};

const listener: MessageSendListener = async (channelId, msg) => {
    if (msg.content.trim().length < maxLength || !canSplit()) return; // Nothing to split

    const channel = ChannelStore.getChannel(channelId);

    // Check for slowmode
    let isSlowmode = channel.rateLimitPerUser > 0;
    if ((channel.accessPermissions & PermissionsBits.MANAGE_MESSAGES) === PermissionsBits.MANAGE_MESSAGES
        || (channel.accessPermissions & PermissionsBits.MANAGE_CHANNELS) === PermissionsBits.MANAGE_CHANNELS)
        isSlowmode = false;

    // Not slowmode or splitInSlowmode is on and less than slowmodeMax
    if (!isSlowmode || (settings.store.splitInSlowmode && channel.rateLimitPerUser < settings.store.slowmodeMax)) {
        const chunks: string[] = [];
        const { hardSplit } = settings.store;
        while (msg.content.length > maxLength) {
            msg.content = msg.content.trim();

            // Get last space or newline
            const splitIndex = Math.max(msg.content.lastIndexOf(" ", maxLength), msg.content.lastIndexOf("\n", maxLength));

            // If hard split is on or neither newline or space found, split at maxLength
            if (hardSplit || splitIndex === -1) {
                chunks.push(msg.content.slice(0, maxLength));
                msg.content = msg.content.slice(maxLength);
            } else {
                chunks.push(msg.content.slice(0, splitIndex));
                msg.content = msg.content.slice(splitIndex);
            }
        }

        ComponentDispatch.dispatchToLastSubscribed("CLEAR_TEXT");
        await split(channelId, [...chunks, msg.content], settings.store.sendDelay * 1000);
    }
    return { cancel: true };
};

const settings = definePluginSettings({
    maxLength: {
        type: OptionType.NUMBER,
        description: t("الحد الأقصى لطول الرسالة قبل التقسيم. اضبطه على 0 للكشف التلقائي.", "Maximum message length before splitting. Set to 0 for auto-detection."),
        default: 0,
        max: 4000,
        onChange(newValue) {
            if (newValue === 0)
                maxLength = autoMaxLength();
        },
    },
    disableFileConversion: {
        type: OptionType.BOOLEAN,
        description: t("عند التفعيل، يعطّل تحويل الملفات للرسائل الطويلة.", "When enabled, disables file conversion for long messages."),
        default: true,
    },
    sendDelay: {
        type: OptionType.SLIDER,
        description: t("التأخير بين كل جزء بالثواني.", "Delay between each chunk in seconds."),
        default: 1,
        markers: [1, 2, 3, 5, 10],
    },
    hardSplit: {
        type: OptionType.BOOLEAN,
        description: t("عند التفعيل، يقسم عند آخر حرف بدلاً من آخر مسافة/سطر جديد.", "When enabled, splits at the last character instead of the last space/newline."),
        default: false,
    },
    splitInSlowmode: {
        type: OptionType.BOOLEAN,
        description: t("هل يجب تقسيم الرسائل إذا كان الوضع البطيء مفعّلاً في القناة؟", "Should messages be split if the channel has slow mode enabled?"),
    },
    slowmodeMax: {
        type: OptionType.NUMBER,
        description: t("الحد الأقصى لوقت الوضع البطيء عند التقسيم فيه.", "Maximum slowmode duration when splitting in it."),
        default: 5,
        min: 1,
        max: 30,
    }
});

export default definePlugin({
    name: "SplitLargeMessages",
    get description() { return t("يقسّم الرسائل الطويلة لأجزاء متعددة لتناسب حد رسائل ديسكورد.", "Splits long messages into multiple parts to fit Discord's message limit."); },
    dependencies: ["MessageEventsAPI"],
    tags: ["Appearance", "Customisation", "Chat"],
    authors: [EquicordDevs.Reycko],
    settings,
    onBeforeMessageSend: listener,

    start() {
        if (settings.store.maxLength === 0) maxLength = autoMaxLength();
    },

    patches: [
        {
            find: 'type:"MESSAGE_LENGTH_UPSELL"', // bypass message length check
            replacement: {
                match: /if\(\i.length>\i/,
                replace: "if(false",
            }
        },

        {
            find: ".onHideAutocomplete?", // disable file conversion
            replacement: {
                match: /(?<=getData\(\i\.type\);)if\(\i.length>\i\)/,
                replace: "if(false)",
            },
        }
    ]
});
