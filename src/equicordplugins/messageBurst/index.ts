/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { EquicordDevs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin, { OptionType } from "@utils/types";
import { Channel, Message } from "@vencord/discord-types";
import { ChannelStore, MessageActions, MessageStore, UserStore } from "@webpack/common";

function shouldEdit(channel: Channel, message: Message, timePeriod: number, shouldMergeWithAttachment: boolean) {
    let should = true;

    if (channel.isGroupDM()) {
        if (channel.name === message.content) {
            should = false;
        }
    }

    if (message.author.id !== UserStore.getCurrentUser().id) {
        should = false;
    }

    if (document.querySelector('[class*="replyBar"]')) {
        should = false;
    }

    if (message.attachments.length > 0 && !shouldMergeWithAttachment) {
        should = false;
    }

    // @ts-ignore
    const timestamp = new Date(message.timestamp);
    const now = new Date();

    if ((now.getTime() - timestamp.getTime()) > (timePeriod * 1000)) {
        should = false;
    }

    return {
        should: should,
        content: message.content
    };
}

const settings = definePluginSettings({
    timePeriod: {
        type: OptionType.NUMBER,
        description: t("مدة الدمج (بالثواني)", "Merge period (in seconds)"),
        default: 3
    },
    shouldMergeWithAttachment: {
        type: OptionType.BOOLEAN,
        description: t("هل يجب دمج الرسالة إذا كانت الرسالة الأخيرة تحتوي على مرفق؟", "Should the message be merged if the last message has an attachment?"),
        default: false
    },
    useSpace: {
        type: OptionType.BOOLEAN,
        description: t("إضافة مسافة بين الرسائل عند الدمج بدلاً من أسطر جديدة.", "Add a space between messages when merging instead of new lines."),
        default: false
    }
});

export default definePlugin({
    name: "MessageBurst",
    get description() { return t("يدمج الرسائل المرسلة خلال فترة زمنية مع رسالتك السابقة إذا لم يرسل أحد آخر رسالة قبلك.", "Merges messages sent within a time period with your previous message if nobody else sent a message before you."); },
    dependencies: ["MessagePopoverAPI"],
    tags: ["Chat"],
    authors: [EquicordDevs.port22exposed],
    settings,
    onBeforeMessageSend(channelId, message) {
        const messages = MessageStore.getMessages(channelId)._map;

        if (!messages) {
            return;
        }

        const entries = Object.entries(messages);
        const [lastMessageId, lastMessage] = entries[entries.length - 1];

        const channel = ChannelStore.getChannel(channelId);

        const { should, content } = shouldEdit(channel, lastMessage as Message, this.settings.store.timePeriod, this.settings.store.shouldMergeWithAttachment);

        if (should) {
            const separator = settings.store.useSpace ? " " : "\n";
            const newContent = content + separator + message.content;

            MessageActions.editMessage(channelId, lastMessageId, {
                content: newContent,
            });

            message.content = "";
        }
    },
});
