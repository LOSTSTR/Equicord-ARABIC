/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Notice } from "@components/Notice";
import { EquicordDevs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { User } from "@vencord/discord-types";
import { ChannelStore, UserStore } from "@webpack/common";

const settings = definePluginSettings({
    globalMention: {
        type: OptionType.BOOLEAN,
        description: "منشن المستخدمين من أي سيرفر وليس السيرفر الحالي فقط",
        default: false,
        restartNeeded: true
    },
    onlyDMUsers: {
        type: OptionType.BOOLEAN,
        description: "عرض المستخدمين الذين تحدثت معهم في الرسائل الخاصة فقط",
        default: false,
        restartNeeded: true
    }
});

let cachedUsers: User[] | null = null;

function getCachedUsers(): User[] {
    if (!cachedUsers) {
        cachedUsers = Object.values(UserStore.getUsers());
    }
    return cachedUsers;
}

export default definePlugin({
    name: "UniversalMention",
    authors: [EquicordDevs.justjxke],
    description: "يتيح منشن أي مستخدم بغض النظر عن وصوله للقناة",
    tags: ["Chat", "Servers", "Utility"],
    settings,
    settingsAboutComponent: () => (
        <Notice.Warning>
            Using Global Mention can cause performance issues and show an absurd amount of users in the autocomplete.
        </Notice.Warning>
    ),

    patches: [
        {
            find: ",queryMentionResults(",
            replacement: [
                {
                    match: /(filter:\i).{0,75}context:\i\}\)(?=,allowSnowflake)/,
                    replace: "$1=>true",
                },
                {
                    match: /(?<=\i=)\i\.\i\.getMembers\(.{0,25}\)\.filter\(\i\)/g,
                    replace: "$self.useFilter()",
                    predicate: () => settings.store.globalMention || settings.store.onlyDMUsers,
                },
                {
                    match: /(?<=\i=)\i\.recipients\.map\(.{0,100}\?\?null\}\)\)/,
                    replace: "$self.useFilter(true)",
                }
            ],
        },
    ],
    useFilter(map: boolean = false) {
        const foundUsers = getCachedUsers();
        const users = settings.store.onlyDMUsers ? foundUsers.filter(user => ChannelStore.getDMFromUserId(user.id)) : foundUsers;
        return map ? users.map(user => ({ userId: user.id, nick: null })) : users;
    }
});
