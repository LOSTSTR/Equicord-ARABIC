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
        description: "عرض الرابط الكامل للصورة بدلاً من اسم الملف فقط. مُفعّل دائماً للـ GIF لأنها غالباً لا تحمل اسماً ذا معنى",
        type: OptionType.BOOLEAN,
        default: false,
    },
});

export default definePlugin({
    name: "ImageFilename",
    authors: [Devs.Ven],
    description: "Display the file name of images & GIFs as a tooltip when hovering over them",
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
