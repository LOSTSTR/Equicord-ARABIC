/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "StickerPaste",
    get description() { return t("يجعل اختيار ستيكر في منتقي الستيكرات يُدرجه في صندوق الدردشة بدلاً من إرساله فوراً", "Makes selecting a sticker in the sticker picker insert it into the chat box instead of sending it immediately"); },
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
