/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin, { makeRange, OptionType } from "@utils/types";

const settings = definePluginSettings({
    volume: {
        type: OptionType.SLIDER,
        description: t("نسبة الصوت لمشغلات Spotify. فوق 10% يكون الصوت عالياً جداً", "Volume level for Spotify players. Above 10% the audio will be too loud"),
        markers: makeRange(0, 100, 10),
        stickToMarkers: false,
        default: 10
    }
});

// The entire code of this plugin can be found in ipcPlugins
export default definePlugin({
    name: "FixSpotifyEmbeds",
    get description() { return t("يُصلح مشكلة انتهاء جلسة Spotify في المضمّنات", "Fixes the Spotify session expiry issue in embeds"); },
    authors: [Devs.Ven],
    tags: ["Media", "Customisation"],
    settings,
});
