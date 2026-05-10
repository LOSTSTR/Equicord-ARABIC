/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "NoRoleHeaders",
    description: "كلنا سواء!! يزيل رؤوس الرتب من قائمة الأعضاء.",
    tags: ["Appearance", "Fun", "Roles"],
    authors: [Devs.Samwich],
    patches: [
        {
            find: "this.updateMaxContentFeedRowSeen()",
            replacement: {
                match: /return \i===\i\.\i\.UNKNOWN/,
                replace: "return null;$&"
            }
        }
    ]
});
