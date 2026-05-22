/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "FixCodeblockGap",
    get description() { return t("يزيل الفراغ الزائد بين صناديق الكود والنص أسفلها", "Removes the extra gap between code blocks and the text below them"); },
    tags: ["Appearance"],
    authors: [Devs.Grzesiek11],
    patches: [
        {
            find: String.raw`/^${"```"}(?:([a-z0-9_+\-.#]+?)\n)?\n*([^\n][^]*?)\n*${"```"}`,
            replacement: {
                match: String.raw`/^${"```"}(?:([a-z0-9_+\-.#]+?)\n)?\n*([^\n][^]*?)\n*${"```"}`,
                replace: "$&\\n?",
            },
        },
    ],
});
