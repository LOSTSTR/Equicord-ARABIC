/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import { t } from "@utils/translation";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "StickerPaste",
    description: t("vencord.stickerPaste.description"),
    tags: ["Emotes", "Chat"],
    authors: [Devs.ImBanana],

    patches: [
        {
            find: ".stickers,previewSticker:",
            replacement: {
                match: /if\(\i\.\i\.getUploadCount/,
                replace: "return true;$&",
            }
        }
    ]
});
