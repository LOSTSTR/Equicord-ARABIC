/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "DynamicImageModalAPI",
    authors: [Devs.sadan, Devs.Nuckyz],
    get description() { return t("يتيح لك تجاهل العرض أو الارتفاع عند فتح نافذة الصورة", "Allows you to ignore the width or height when opening an image modal"); },
    patches: [
        {
            find: ".renderLinkComponent",
            replacement: {
                // widthAndHeightPassed = w != null && w !== 0 && h == null || h === 0
                match: /(?<=\i=)(null!=\i&&0!==\i)&&(null!=\i&&0!==\i)/,
                replace: "($1)||($2)"
            }
        }
    ]
});
