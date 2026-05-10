/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { makeRange, OptionType } from "@utils/types";

const settings = definePluginSettings({
    volume: {
        type: OptionType.SLIDER,
        description: "نسبة الصوت لمشغلات Spotify. فوق 10% يكون الصوت عالياً جداً",
        markers: makeRange(0, 100, 10),
        stickToMarkers: false,
        default: 10
    }
});

// The entire code of this plugin can be found in ipcPlugins
export default definePlugin({
    name: "FixSpotifyEmbeds",
    description: "Fixes spotify embeds being incredibly loud by letting you customise the volume",
    authors: [Devs.Ven],
    tags: ["Media", "Customisation"],
    settings,
});
