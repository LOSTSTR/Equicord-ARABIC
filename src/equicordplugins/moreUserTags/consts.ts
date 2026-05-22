/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Channel, Guild, Message, RC, User } from "@vencord/discord-types";
import { findByCodeLazy, findLazy } from "@webpack";
import { GuildStore } from "@webpack/common";
import { t } from "@utils/esharqI18n";

import { settings } from "./settings";
import type { ITag } from "./types";

export const isWebhook = (message: Message, user: User) => {
    const isFollowed = message?.type === 0 && !!message?.messageReference && !settings.store.showWebhookTagFully;
    return !!message?.webhookId && user.isNonUserBot() && !isFollowed;
};

export const tags = [
    {
        name: "WEBHOOK",
        displayName: "Webhook",
        description: t("الرسائل المرسلة عبر Webhooks", "Messages sent via Webhooks"),
        condition: isWebhook
    }, {
        name: "OWNER",
        displayName: "Owner",
        description: t("يمتلك السيرفر", "Owns the server"),
        condition: (_, user, channel) => GuildStore.getGuild(channel?.guild_id)?.ownerId === user.id
    }, {
        name: "ADMINISTRATOR",
        displayName: "Admin",
        description: t("لديه صلاحية المسؤول", "Has administrator permission"),
        permissions: ["ADMINISTRATOR"]
    }, {
        name: "MODERATOR_STAFF",
        displayName: "Staff",
        description: t("يمكنه إدارة السيرفر أو القنوات أو الرتب", "Can manage server, channels, or roles"),
        permissions: ["MANAGE_GUILD", "MANAGE_CHANNELS", "MANAGE_ROLES"]
    }, {
        name: "MODERATOR",
        displayName: "Mod",
        description: t("يمكنه إدارة الرسائل أو طرد/حظر الأعضاء", "Can manage messages or kick/ban members"),
        permissions: ["MANAGE_MESSAGES", "KICK_MEMBERS", "BAN_MEMBERS"]
    }, {
        name: "VOICE_MODERATOR",
        displayName: "VC Mod",
        description: t("يمكنه إدارة المحادثات الصوتية", "Can manage voice channels"),
        permissions: ["MOVE_MEMBERS", "MUTE_MEMBERS", "DEAFEN_MEMBERS"]
    }, {
        name: "CHAT_MODERATOR",
        displayName: "Chat Mod",
        description: t("يمكنه تطبيق عقوبة المهلة على الأعضاء", "Can timeout members"),
        permissions: ["MODERATE_MEMBERS"]
    }
] as const satisfies ITag[];

export const Tag = findLazy(m => m.Types?.[0] === "BOT") as RC<{ type?: number | null, className?: string, useRemSizes?: boolean; }> & { Types: Record<string, number>; };

// PermissionStore.computePermissions will not work here since it only gets permissions for the current user
export const computePermissions: (options: {
    user?: { id: string; } | string | null;
    context?: Guild | Channel | null;
    overwrites?: Channel["permissionOverwrites"] | null;
    checkElevated?: boolean /* = true */;
    excludeGuildPermissions?: boolean /* = false */;
}) => bigint = findByCodeLazy(".getCurrentUser()", ".computeLurkerPermissionsAllowList()");
