/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "DisableDeepLinks",
    description: "Disables the Deep Linking feature that forces you to use the desktop app",
    tags: ["Utility"],
    authors: [Devs.Ven],
    required: true,

    noop: () => { },

    patches: [
        {
            find: /\.openNativeAppModal\(.{0,50}?\.DEEP_LINK/,
            replacement: {
                match: /\i\.\i\.openNativeAppModal/,
                replace: "$self.noop",
            }
        }
    ]
});
