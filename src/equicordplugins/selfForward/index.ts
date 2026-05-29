/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { EquicordDevs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "SelfForward",
    get description() { return t("يضيف القناة الحالية إلى قائمة إعادة التوجيه المنبثقة", "Adds the current channel to the forward popup list."); },
    tags: ["Utility"],
    authors: [EquicordDevs.VillainsRule],
    patches: [
        {
            find: ".getChannelHistory(),",
            replacement: [{
                match: /\i.id\]/,
                replace: "]"
            }]
        }
    ]
});
