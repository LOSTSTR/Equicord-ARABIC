/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "NoTypingAnimation",
    authors: [Devs.AutumnVN],
    get description() { return t("يعطّل أنيميشن نقاط الكتابة الذي يستهلك الموارد", "Disables the resource-consuming typing dots animation"); },
    tags: ["Appearance"],
    patches: [
        {
            find: "dotCycle",
            replacement: {
                match: /focused:(\i)/g,
                replace: (_, focused) => `_focused:${focused}=false`
            }
        }
    ]
});
