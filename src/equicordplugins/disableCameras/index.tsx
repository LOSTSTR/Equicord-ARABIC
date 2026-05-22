/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors*
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "DisableCameras",
    get description() { return t("يعطّل الكاميرا في المكالمات افتراضياً", "Disables cameras in calls by default"); },
    tags: ["Appearance", "Customisation", "Media", "Privacy"],
    authors: [Devs.Joona],
    patches: [
        {
            find: ".identifyStartTime))",
            replacement: {
                match: /\i\.self_video\|\|!1/g,
                replace: "false"
            },
        }
    ]
});
