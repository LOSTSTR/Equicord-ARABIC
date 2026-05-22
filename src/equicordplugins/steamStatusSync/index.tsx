/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { EquicordDevs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin, { OptionType } from "@utils/types";

enum SteamStatus {
    Online = "online",
    Away = "away",
    Invisible = "invisible",
    Offline = "offline",
    None = "none"
}

interface SettingsProto {
    settings: {
        proto: {
            status?: {
                status: {
                    value: String;
                },
                showCurrentGame: {
                    value: Boolean;
                },
            };
        };
    };
}

export const settings = definePluginSettings({
    onlineStatus: {
        type: OptionType.SELECT,
        description: t("حالة Steam عند الاتصال", "Steam status when online"),
        options: [
            { label: "Online", value: SteamStatus.Online, default: true },
            { label: "Away", value: SteamStatus.Away },
            { label: "Invisible", value: SteamStatus.Invisible },
            { label: "Offline (Disconnect Steam Chat)", value: SteamStatus.Offline },
            { label: "Disabled", value: SteamStatus.None }
        ],
    },
    idleStatus: {
        type: OptionType.SELECT,
        description: t("حالة Steam عند الخمول", "Steam status when idle"),
        options: [
            { label: "Online", value: SteamStatus.Online },
            { label: "Away", value: SteamStatus.Away, default: true },
            { label: "Invisible", value: SteamStatus.Invisible },
            { label: "Offline (Disconnect Steam Chat)", value: SteamStatus.Offline },
            { label: "Disabled", value: SteamStatus.None }
        ],
    },
    dndStatus: {
        type: OptionType.SELECT,
        description: t("حالة Steam عند 'عدم الإزعاج'", "Steam status when on 'Do Not Disturb'"),
        options: [
            { label: "Online", value: SteamStatus.Online },
            { label: "Away", value: SteamStatus.Away },
            { label: "Invisible", value: SteamStatus.Invisible },
            { label: "Offline (Disconnect Steam Chat)", value: SteamStatus.Offline },
            { label: "Disabled", value: SteamStatus.None, default: true }
        ],
    },
    invisibleStatus: {
        type: OptionType.SELECT,
        description: t("حالة Steam عند الإخفاء", "Steam status when invisible"),
        options: [
            { label: "Online", value: SteamStatus.Online },
            { label: "Away", value: SteamStatus.Away },
            { label: "Invisible", value: SteamStatus.Invisible, default: true },
            { label: "Offline (Disconnect Steam Chat)", value: SteamStatus.Offline },
            { label: "Disabled", value: SteamStatus.None }
        ],
    },
    goInvisibleIfActivityIsHidden: {
        type: OptionType.BOOLEAN,
        description: t("اذهب دائماً إلى وضع الإخفاء عند إخفاء نشاط اللعبة على Discord", "Always go invisible when hiding game activity on Discord")
    }
});

export default definePlugin({
    name: "SteamStatusSync",
    get description() { return t("زامن حالتك مع Steam! (متصل، بعيد، مخفي، أو غير متصل.)", "Sync your status with Steam! (Online, Away, Invisible, or Offline.)"); },
    tags: ["Activity", "Appearance", "Customisation"],
    authors: [EquicordDevs.niko],

    settings,

    flux: {
        USER_SETTINGS_PROTO_UPDATE(settingsUpdate: SettingsProto) {
            const protoStatus = settingsUpdate.settings.proto.status;

            if (protoStatus !== undefined) {
                const steamStatus: SteamStatus = settings.store[`${protoStatus.status.value}Status`];

                if (settings.store.goInvisibleIfActivityIsHidden && !protoStatus.showCurrentGame.value) {
                    open(`steam://friends/status/${SteamStatus.Invisible}`);

                    return;
                }
                if (steamStatus === SteamStatus.None) { return; }

                // Open steam protocol URI for status change
                open(`steam://friends/status/${steamStatus}`);
            }
        }
    }
});
