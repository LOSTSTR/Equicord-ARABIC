/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import { t } from "@utils/translation";
import definePlugin, { OptionType } from "@utils/types";

const settings = definePluginSettings({
    onlySnow: {
        type: OptionType.BOOLEAN,
        description: t("vencord.secretRingTone.settings.onlySnow"),
        default: false,
        restartNeeded: true
    }
});

export default definePlugin({
    name: "SecretRingToneEnabler",
    description: t("vencord.secretRingTone.description"),
    tags: ["Notifications", "Fun"],
    authors: [Devs.AndrewDLO, Devs.FieryFlames, Devs.RamziAH],
    settings,
    patches: [
        {
            find: '"call_ringing_beat"',
            replacement: [
                {
                    match: /500!==\i\(\)\.random\(1,1e3\)/,
                    replace: "false"
                },
                {
                    predicate: () => settings.store.onlySnow,
                    match: /"call_ringing_beat",/,
                    replace: ""
                }
            ]
        }
    ]
});
