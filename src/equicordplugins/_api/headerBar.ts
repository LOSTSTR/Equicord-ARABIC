/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "HeaderBarAPI",
    get description() { return t("واجهة برمجية لإضافة أزرار إلى شريط الرأس وشريط أدوات القناة.", "An API for adding buttons to the header bar and channel toolbar."); },
    authors: [Devs.prism],

    patches: [
        {
            find: '?"BACK_FORWARD_NAVIGATION":',
            replacement: {
                match: /(?<="HELP"===.{0,75}\{\}\))(?=\])/,
                replace: ",...Vencord.Api.HeaderBar._addHeaderBarButtons()"
            }
        },
        {
            find: "Missing channel in Channel.renderHeaderToolbar",
            replacement: {
                match: /(?<=renderHeaderToolbar"\);let (\i)=\[\];)/,
                replace: "Vencord.Api.HeaderBar._addChannelToolbarButtons($1);"
            }
        }
    ]
});
