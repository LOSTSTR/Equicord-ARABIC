/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import { t } from "@utils/translation";
import definePlugin from "@utils/types";

// The entire code of this plugin can be found in native.ts
export default definePlugin({
    name: "YoutubeAdblock",
    description: t("vencord.youtubeAdblock.description"),
    tags: ["Media", "Utility"],
    authors: [Devs.ImLvna, Devs.Ven],
});
