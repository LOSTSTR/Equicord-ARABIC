/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./styles.css";

import { addMessagePreSendListener, removeMessagePreSendListener } from "@api/MessageEvents";
import { EyeIcon } from "@components/Icons";
import SettingsPlugin from "@plugins/_core/settings";
import { EquicordDevs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import { removeFromArray } from "@utils/misc";
import definePlugin from "@utils/types";

import { Data } from "./components/data";
import DataUI from "./components/ui";

export default definePlugin({
    name: "IRememberYou",
    get description() { return t("يحفظ محلياً جميع من تواصلت معهم (بما في ذلك السيرفرات) احتياطاً في حال الفقدان", "Locally saves everyone you've interacted with (including servers) as a backup in case of loss"); },
    tags: ["Chat", "Servers"],
    authors: [EquicordDevs.zoodogood, EquicordDevs.keircn],
    dependencies: ["MessageEventsAPI"],

    patches: [],

    async start() {
        SettingsPlugin.customEntries.push({
            key: "equicord_i_remember_you",
            title: "I Remember You",
            Component: () => <DataUI usersCollection={data.usersCollection} />,
            Icon: EyeIcon
        });

        const data = (this.dataManager = await new Data().withStart());

        await data.initializeUsersCollection();
        data.writeGuildsOwnersToCollection();
        data.writeMembersFromUserGuildsToCollection();
        data._onMessagePreSend_preSend = addMessagePreSendListener(
            data.onMessagePreSend.bind(data)
        );
        data.storageAutoSaveProtocol();
    },

    stop() {
        removeFromArray(SettingsPlugin.customEntries, e => e.key === "equicord_i_remember_you");

        const dataManager = this.dataManager as Data;
        removeMessagePreSendListener(dataManager._onMessagePreSend_preSend);
        clearInterval(dataManager._storageAutoSaveProtocol_interval);
    },
});
