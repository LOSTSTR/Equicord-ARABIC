/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "ShowSongName",
    get description() { return t("يعرض اسم الأغنية بدلاً من الفنان في نشاط Spotify", "Shows the song name instead of the artist in Spotify activity."); },
    tags: ["Activity"],
    authors: [Devs.prism],

    patches: [
        {
            find: '.join(", ");return{text:',
            replacement: {
                match: /(?<=.join\(", "\);return\{text:)\i/,
                replace: "arguments[0]?.details??$&"
            }
        }
    ]
});
