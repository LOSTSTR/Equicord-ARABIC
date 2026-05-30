/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

const ImageExtensionRe = /\.(png|jpg|jpeg|gif|webp|avif)$/i;
const GifHostRegex = /^(.+?\.)?(tenor|giphy|imgur)\.com$/i;

const settings = definePluginSettings({
    showFullUrl: {
        description: "Show the full image URL instead of just the filename. Always enabled for GIFs as they usually don't have a meaningful name",
        type: OptionType.BOOLEAN,
        default: false,
    },
});

export default definePlugin({
    name: "ImageFilename",
    authors: [Devs.Ven],
    description: "Shows the original filename instead of a modified name",
    tags: ["Media", "Utility"],
    settings,

    patches: [
        {
            find: ".RESPONSIVE?",
            replacement: {
                match: /(?="data-role":"img","data-safe-src":)(?<=href:(\i).+?)/,
                replace: "title:$self.getTitle($1),"
            }
        },
    ],

    getTitle(src: string) {
        try {
            const url = new URL(src);
            const isGif = GifHostRegex.test(url.hostname);
            if (!isGif && !ImageExtensionRe.test(url.pathname)) return undefined;

            return isGif || settings.store.showFullUrl
                ? src
                : url.pathname.split("/").pop();
        } catch {
            return undefined;
        }
    }
});
