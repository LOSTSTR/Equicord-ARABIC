/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants.js";
import { t } from "@utils/esharqI18n";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "NoMaskedUrlPaste",
    authors: [Devs.CatNoir],
    get description() { return t("لصق رابط مع نص محدد لن يحوّله إلى رابط مخفي", "Pasting a link with selected text will not convert it into a masked URL"); },
    tags: ["Chat", "Utility"],
    patches: [
        {
            find: ".selection,preventEmojiSurrogates:",
            replacement: {
                match: /if\(null!=\i.selection&&\i.\i.isExpanded\(\i.selection\)\)/,
                replace: "if(false)"
            }
        }
    ],
});
