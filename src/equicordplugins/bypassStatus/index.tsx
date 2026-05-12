/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { playAudio } from "@api/AudioPlayer";
import { type NavContextMenuPatchCallback } from "@api/ContextMenu";
import { Notifications } from "@api/index";
import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import { getCurrentChannel } from "@utils/discord";
import { Logger } from "@utils/Logger";
import definePlugin, { OptionType } from "@utils/types";
import type { Message } from "@vencord/discord-types";
import { ChannelActionCreators, ChannelStore, Menu, MessageStore, NavigationRouter, PresenceStore, UserStore, WindowStore } from "@webpack/common";
import { JSX } from "react";

interface IMessageCreate {
    channelId: string;
    guildId: string;
    message: Message;
}

const SILENT_PING_FLAG = 1 << 12;

function Icon(enabled?: boolean): JSX.Element {
    return <svg
        width="18"
        height="18"
    >
        <circle cx="9" cy="9" r="8" fill={!enabled ? "var(--status-danger)" : "currentColor"} />
        <circle cx="9" cy="9" r="3.75" fill={!enabled ? "white" : "black"} />
    </svg>;
}

function processIds(value: string): string {
    return value.replace(/\s/g, "").split(",").filter(id => id.trim() !== "").join(", ");
}

async function showNotification(message: Message, guildId: string | undefined): Promise<void> {
    try {
        const channel = ChannelStore.getChannel(message.channel_id);
        const channelRegex = /<#(\d{19})>/g;
        const userRegex = /<@(\d{18})>/g;

        message.content = message.content.replace(channelRegex, (match: any, channelId: string) => {
            return `#${ChannelStore.getChannel(channelId)?.name}`;
        });

        message.content = message.content.replace(userRegex, (match: any, userId: string) => {
            return `@${(UserStore.getUser(userId) as any).globalName}`;
        });

        await Notifications.showNotification({
            title: `${(message.author as any).globalName} ${guildId ? `(#${channel?.name}, ${ChannelStore.getChannel(channel?.parent_id)?.name})` : ""}`,
            body: message.content,
            icon: UserStore.getUser(message.author.id).getAvatarURL(undefined, undefined, false),
            onClick: function (): void {
                NavigationRouter.transitionTo(`/channels/${guildId ?? "@me"}/${message.channel_id}/${message.id}`);
            }
        });

        if (settings.store.notificationSound) {
            playAudio("message1");
        }
    } catch (error) {
        new Logger("BypassStatus").error("Failed to notify user: ", error);
    }
}

function ContextCallback(name: "guild" | "user" | "channel"): NavContextMenuPatchCallback {
    return (children, props) => {
        const type = props[name];
        if (!type) return;
        const enabled = settings.store[`${name}s`].split(", ").includes(type.id);
        if (name === "user" && type.id === UserStore.getCurrentUser().id) return;
        children.splice(-1, 0, (
            <Menu.MenuGroup>
                <Menu.MenuItem
                    id={`status-${name}-bypass`}
                    label={`${enabled ? "Remove" : "Add"} Status Bypass`}
                    icon={() => Icon(enabled)}
                    action={() => {
                        let bypasses: string[] = settings.store[`${name}s`].split(", ");
                        if (enabled) bypasses = bypasses.filter(id => id !== type.id);
                        else bypasses.push(type.id);
                        settings.store[`${name}s`] = bypasses.filter(id => id.trim() !== "").join(", ");
                    }}
                />
            </Menu.MenuGroup>
        ));
    };
}

const settings = definePluginSettings({
    guilds: {
        type: OptionType.STRING,
        description: "السيرفرات المسموح لها بالتجاوز (تُشعَر عند الإشارة إليك في أي مكان بالسيرفر)",
        default: "",
        placeholder: "Separate with commas",
        onChange: value => settings.store.guilds = processIds(value)
    },
    channels: {
        type: OptionType.STRING,
        description: "القنوات المسموح لها بالتجاوز (تُشعَر عند الإشارة إليك في تلك القناة)",
        default: "",
        placeholder: "Separate with commas",
        onChange: value => settings.store.channels = processIds(value)
    },
    users: {
        type: OptionType.STRING,
        description: "المستخدمون المسموح لهم بالتجاوز (تُشعَر بجميع رسائلهم المباشرة)",
        default: "",
        placeholder: "Separate with commas",
        onChange: value => settings.store.users = processIds(value)
    },
    allowOutsideOfDms: {
        type: OptionType.BOOLEAN,
        description: "السماح للمستخدمين المختارين بالتجاوز خارج الرسائل المباشرة أيضاً (يعمل كتجاوز للقناة/السيرفر لجميع رسائل المستخدمين المختارين)"
    },
    notificationSound: {
        type: OptionType.BOOLEAN,
        description: "ما إذا كان صوت الإشعار سيُشغَّل",
        default: true,
    },
    respectSilentPings: {
        type: OptionType.BOOLEAN,
        description: "احترام الإشارات الصامتة (@silent / كتم الإشعارات)",
        default: true
    },
    statusToUse: {
        type: OptionType.SELECT,
        description: "الحالة المستخدمة لتفعيل القائمة البيضاء",
        options: [
            {
                label: "Online",
                value: "online",
            },
            {
                label: "Idle",
                value: "idle",
            },
            {
                label: "Do Not Disturb",
                value: "dnd",
                default: true
            },
            {
                label: "Invisible",
                value: "invisible",
            }
        ]
    }
});

export default definePlugin({
    name: "BypassStatus",
    description: "استمر في تلقي إشعارات من مصادر محددة حتى في وضع عدم الإزعاج. انقر بزر الماوس الأيمن على المستخدمين/القنوات/السيرفرات لإعدادها لتجاوز وضع عدم الإزعاج.",
    tags: ["Activity", "Customisation", "Notifications", "Servers"],
    authors: [Devs.Inbestigator],
    dependencies: ["AudioPlayerAPI"],
    flux: {
        async MESSAGE_CREATE({ message, guildId, channelId }: IMessageCreate): Promise<void> {
            try {
                const currentUser = UserStore.getCurrentUser();
                const userStatus = await PresenceStore.getStatus(currentUser.id);
                const currentChannelId = getCurrentChannel()?.id ?? "0";
                if (message.state === "SENDING" || message.content === "" || message.author.id === currentUser.id || (channelId === currentChannelId && WindowStore.isFocused()) || userStatus !== settings.store.statusToUse) {
                    return;
                }
                if (settings.store.respectSilentPings && (message.flags & SILENT_PING_FLAG)) { return; }
                const mentioned = MessageStore.getMessage(channelId, message.id)?.mentioned;
                if ((settings.store.guilds.split(", ").includes(guildId) || settings.store.channels.split(", ").includes(channelId)) && mentioned) {
                    await showNotification(message, guildId);
                } else if (settings.store.users.split(", ").includes(message.author.id)) {
                    const userChannelId = await ChannelActionCreators.getOrEnsurePrivateChannel(message.author.id);
                    if (channelId === userChannelId || (mentioned && settings.store.allowOutsideOfDms === true)) {
                        await showNotification(message, guildId);
                    }
                }
            } catch (error) {
                new Logger("BypassStatus").error("Failed to handle message: ", error);
            }
        }
    },
    settings,
    contextMenus: {
        "guild-context": ContextCallback("guild"),
        "channel-context": ContextCallback("channel"),
        "user-context": ContextCallback("user"),
    }
});
