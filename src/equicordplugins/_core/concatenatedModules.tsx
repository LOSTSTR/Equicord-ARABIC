/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { IconsDef } from "@equicordplugins/iconViewer/types";
import { Devs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin from "@utils/types";

export let iconsModule: IconsDef;

export default definePlugin({
    name: "ConcatenatedModules",
    get description() { return t("استخراج الوحدات التي دمجها المُجمِّع", "Extract modules concatenated by the bundler"); },
    authors: [Devs.thororen],
    patches: [
        {
            find: "AngleBracketsIcon",
            replacement: {
                match: /\i\.\i\((\i)\),\i\.\i\(\i,\{AIcon/,
                replace: "$self.setIconsModule($1),$&"
            }
        }
    ],
    setIconsModule(value: IconsDef) {
        iconsModule = value;

        // incase you dont want to use iconviewer you can do
        // Vencord.Plugins.plugins.ConcatenatedModules.iconsModule instead for icons and viewing paths
        this.iconsModule = value;
    },
});
