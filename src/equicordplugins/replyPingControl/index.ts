/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated, MrDiamond, ant0n, and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Devs, EquicordDevs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin, { OptionType } from "@utils/types";
import { MessageJSON } from "@vencord/discord-types";
import { MessageStore, UserStore } from "@webpack/common";

export const settings = definePluginSettings({
    alwaysPingOnReply: {
        type: OptionType.BOOLEAN,
        description: t("يُنبّهك دائماً عند ردّ أحدهم على رسائلك", "Always notify you when someone replies to your messages"),
        default: false,
    },
    replyPingWhitelist: {
        type: OptionType.STRING,
        description: t("قائمة معرّفات المستخدمين مفصولة بفاصلة لاستقبال إشعارات الردود منهم دائماً", "Comma-separated list of user IDs to always receive reply notifications from"),
        default: "",
        disabled: () => settings.store.alwaysPingOnReply,
    },
    replyPingBlacklist: {
        type: OptionType.STRING,
        description: t("قائمة معرّفات المستخدمين مفصولة بفاصلة لعدم استقبال إشعارات الردود منهم أبداً", "Comma-separated list of user IDs to never receive reply notifications from"),
        default: "",
    }
});

export default definePlugin({
    name: "ReplyPingControl",
    get description() { return t("التحكم في استقبال إشعارات ردود الرسائل دائماً أو أبداً، مع ميزات القائمة البيضاء والسوداء", "Control whether to always or never receive reply notifications, with whitelist and blacklist features"); },
    tags: ["Chat", "Notifications"],
    authors: [Devs.ant0n, EquicordDevs.MrDiamond, EquicordDevs.keircn],
    settings,

    patches: [{
        find: "_channelMessages",
        replacement: {
            match: /receiveMessage\((\i)\)\{/,
            replace: "$&$self.modifyMentions($1);"
        }
    }],

    modifyMentions(message: MessageJSON) {
        const user = UserStore.getCurrentUser();
        if (message.author.id === user.id) return;

        const repliedMessage = this.getRepliedMessage(message);
        if (!repliedMessage || repliedMessage.author.id !== user.id) return;

        const { replyPingBlacklist, replyPingWhitelist, alwaysPingOnReply } = settings.plain;
        const authorId = message.author.id;

        if (replyPingBlacklist && replyPingBlacklist.split(",").some(id => id.trim() === authorId)) {
            message.mentions = message.mentions.filter(mention => mention.id !== user.id);
            return;
        }

        const isWhitelisted = replyPingWhitelist && replyPingWhitelist.split(",").some(id => id.trim() === authorId);

        if (isWhitelisted || alwaysPingOnReply) {
            if (!message.mentions.some(mention => mention.id === user.id)) {
                message.mentions.push(user as any);
            }
        } else {
            message.mentions = message.mentions.filter(mention => mention.id !== user.id);
        }
    },

    getRepliedMessage(message: MessageJSON) {
        const ref = message.message_reference;
        return ref && MessageStore.getMessage(ref.channel_id, ref.message_id);
    },
});
