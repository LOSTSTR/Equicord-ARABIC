/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings, migratePluginSettings } from "@api/Settings";
import { getUserSettingLazy } from "@api/UserSettings";
import { Devs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin, { OptionType } from "@utils/types";

let savedStatus: string | null;

const StatusSettings = getUserSettingLazy<string>("status", "status")!;

const settings = definePluginSettings({
    statusToSet: {
        type: OptionType.SELECT,
        description: t("الحالة التي تُضبط أثناء تشغيل لعبة", "The status to set while playing a game"),
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
    },
    excludeInvisible: {
        type: OptionType.BOOLEAN,
        description: t("منع تغييرات الحالة التلقائية عندما تكون حالتك مضبوطة على غير مرئي", "Prevent automatic status changes when your status is set to invisible"),
        default: false
    },
});

migratePluginSettings("AutoDNDWhilePlaying", "StatusWhilePlaying");
export default definePlugin({
    name: "AutoDNDWhilePlaying",
    get description() { return t("يضبط حالتك تلقائياً على لا تزعج أثناء تشغيل لعبة", "Automatically sets your status to Do Not Disturb while playing a game"); },
    tags: ["Activity", "Utility"],
    authors: [Devs.thororen],
    isModified: true,
    settings,
    flux: {
        RUNNING_GAMES_CHANGE({ games }) {
            const status = StatusSettings.getSetting();

            if (settings.store.excludeInvisible && (savedStatus ?? status) === "invisible") return;

            if (games.length > 0) {
                if (status !== settings.store.statusToSet) {
                    savedStatus = status;
                    StatusSettings.updateSetting(settings.store.statusToSet);
                }
            } else if (savedStatus && savedStatus !== settings.store.statusToSet) {
                StatusSettings.updateSetting(savedStatus);
            }
        }
    }
});
