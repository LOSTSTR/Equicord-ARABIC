/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin, { OptionType } from "@utils/types";
import type { Message } from "@vencord/discord-types";
import { ChannelStore, GuildMemberStore } from "@webpack/common";

const settings = definePluginSettings({
    userList: {
        description:
            t("قائمة معرّفات المستخدمين المسموح لهم أو المستثنين من المنشن (مفصولة بفواصل أو مسافات)", "List of user IDs allowed or exempted from mentions (comma or space separated)"),
        type: OptionType.STRING,
        default: "1234567890123445,1234567890123445",
        multiline: true
    },
    roleList: {
        description:
            t("قائمة معرّفات الرتب المسموح لها أو المستثناة من الإشارات (مفصولة بفواصل أو مسافات)", "List of role IDs allowed or exempted from mentions (comma or space separated)"),
        type: OptionType.STRING,
        default: "1234567890123445,1234567890123445",
        multiline: true
    },
    shouldPingListed: {
        description: t("السلوك", "Behavior"),
        type: OptionType.SELECT,
        options: [
            {
                label: "Do not ping the listed users / roles",
                value: false,
            },
            {
                label: "Only ping the listed users / roles",
                value: true,
                default: true,
            },
        ],
    },
    inverseShiftReply: {
        description: t("عكس سلوك الرد مع Shift في Discord (فعّله لجعل الرد بـ Shift يُشير إلى المستخدم)", "Invert Discord's shift-reply behavior (enable to make shift-reply ping the user)"),
        type: OptionType.BOOLEAN,
        default: false,
    }
});

export default definePlugin({
    name: "NoReplyMention",
    get description() { return t("يُزيل إشعار الذكر من الردود تلقائياً", "Automatically removes the mention notification from replies"); },
    tags: ["Chat", "Notifications"],
    authors: [Devs.DustyAngel47, Devs.rae, Devs.pylix, Devs.outfoxxed],
    settings,

    shouldMention(message: Message, isHoldingShift: boolean) {
        let isListed = settings.store.userList.includes(message.author.id);

        const channel = ChannelStore.getChannel(message.channel_id);
        if (channel?.guild_id && !isListed) {
            const roles = GuildMemberStore.getMember(channel.guild_id, message.author.id)?.roles;
            isListed = !!roles && roles.some(role => settings.store.roleList.includes(role));
        }

        const isExempt = settings.store.shouldPingListed ? isListed : !isListed;
        return settings.store.inverseShiftReply ? isHoldingShift !== isExempt : !isHoldingShift && isExempt;
    },

    patches: [
        {
            find: ",\"Message\")}function",
            replacement: {
                match: /:(\i),shouldMention:!(\i)\.shiftKey/,
                replace: ":$1,shouldMention:$self.shouldMention($1,$2.shiftKey)"
            }
        }
    ],
});
