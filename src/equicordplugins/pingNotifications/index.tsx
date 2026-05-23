/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { showNotification } from "@api/Notifications";
import { definePluginSettings } from "@api/Settings";
import { EquicordDevs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin, { OptionType } from "@utils/types";
import { findStoreLazy } from "@webpack";
import {
    ChannelStore,
    GuildStore,
    NavigationRouter,
    PresenceStore,
    RelationshipStore,
    SelectedChannelStore,
    UserStore
} from "@webpack/common";

const UserGuildSettingsStore = findStoreLazy("UserGuildSettingsStore");

const settings = definePluginSettings({
    friends: {
        type: OptionType.BOOLEAN,
        default: false,
        description: t("يُنبّهك عندما يرسل أصدقاؤك رسائل في السيرفرات", "Notify you when your friends send messages in servers")
    },
    mentions: {
        type: OptionType.BOOLEAN,
        default: true,
        description: t("إشعار عند ذكرك مباشرةً بعلامة @", "Notify when you are directly mentioned with @")
    },
    dms: {
        type: OptionType.BOOLEAN,
        default: true,
        description: t("إشعار عند استقبال رسائل مباشرة (DMs)", "Notify when you receive direct messages (DMs)")
    },
    showInActive: {
        type: OptionType.BOOLEAN,
        default: false,
        description: t("إظهار الإشعارات حتى للقناة النشطة حالياً", "Show notifications even for the currently active channel")
    },
    ignoreMuted: {
        type: OptionType.BOOLEAN,
        default: true,
        description: t("تجاهل الإشعارات من السيرفرات والقنوات والمستخدمين المكتومين", "Ignore notifications from muted servers, channels, and users")
    }
});

const mentionRegexCache = new Map<string, RegExp>();

function getMentionRegex(userId: string): RegExp {
    let regex = mentionRegexCache.get(userId);
    if (!regex) {
        regex = new RegExp(`<@!?${userId}>`, "g");
        mentionRegexCache.set(userId, regex);
    }
    return regex;
}

function formatContent(message) {
    let content = message.content || "";
    message.mentions?.forEach(user => {
        content = content.replace(getMentionRegex(user.id), `@${user.username}`);
    });
    return content.slice(0, 200) + (content.length > 200 ? "..." : "");
}

function checkIfMuted(channel) {
    if (!settings.store.ignoreMuted) return false;
    if (!channel) return false;

    if (channel.isMuted?.()) return true;

    const isDM = [1, 3].includes(channel.type);
    if (isDM) {
        const recipientIds = channel.recipients || [];
        for (const userId of recipientIds) {
            if (RelationshipStore.isBlocked(userId)) return true;
        }

        if (UserGuildSettingsStore?.getMutedChannels?.()?.includes?.(channel.id)) return true;
    }

    if (channel.guild_id) {
        const guild = GuildStore.getGuild(channel.guild_id);
        if (UserGuildSettingsStore.isMuted(channel.guild_id)) return true;

        if (UserGuildSettingsStore?.isMuted?.(channel.guild_id)) return true;
        if (UserGuildSettingsStore?.isChannelMuted?.(channel.guild_id, channel.id)) return true;
        if (UserGuildSettingsStore?.isCategoryMuted?.(channel.guild_id, channel.id)) return true;
    }

    return false;
}

function isUserBlocked(userId) {
    return settings.store.ignoreMuted && RelationshipStore.isBlocked?.(userId);
}

export default definePlugin({
    name: "PingNotifications",
    get description() { return t("إشعارات قابلة للتخصيص مع تنسيق محسّن للإشارات", "Customizable notifications with improved mention formatting"); },
    tags: ["Chat", "Friends", "Notifications", "Servers"],
    authors: [EquicordDevs.smuki],
    settings,

    flux: {
        MESSAGE_CREATE({ message }) {
            try {
                if (!message?.channel_id || message.state === "SENDING") return;

                const channel = ChannelStore.getChannel(message.channel_id);
                const currentUser = UserStore.getCurrentUser();

                if (!channel || !currentUser) return;
                if (message.author?.id === currentUser.id) return;

                const isDM = [1, 3].includes(channel.type);

                if (checkIfMuted(channel)) return;
                if (isUserBlocked(message.author.id)) return;
                if (!settings.store.showInActive && channel.id === SelectedChannelStore.getChannelId()) return;
                if (PresenceStore.getStatus(currentUser.id) === "dnd") return;

                const author = UserStore.getUser(message.author.id) || { username: "Unknown" };
                const channelName = channel.name || (isDM ? "DM" : "Group");
                const body = formatContent(message);

                let shouldNotify = false;

                if (settings.store.mentions && message.mentions?.some(u => u.id === currentUser.id)) {
                    shouldNotify = true;
                } else if (settings.store.friends && RelationshipStore.isFriend(message.author.id) && !isDM) {
                    shouldNotify = true;
                } else if (isDM && settings.store.dms) {
                    shouldNotify = true;
                }

                if (shouldNotify) {
                    showNotification({
                        title: `${author.username} in ${channelName}`,
                        body,
                        icon: author.getAvatarURL?.(undefined, 128),
                        onClick: () => NavigationRouter.transitionTo(
                            `/channels/${channel.guild_id || "@me"}/${channel.id}/${message.id}`
                        )
                    });
                }
            } catch (err) {
                console.error("[PingNotifications] Error:", err);
            }
        }
    }
});
