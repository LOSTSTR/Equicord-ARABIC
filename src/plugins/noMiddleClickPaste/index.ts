/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs, IS_LINUX } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin from "@utils/types";

function preventMiddleClick(e: MouseEvent) {
    if (e.button === 1) {
        e.preventDefault();
    }
}

export default definePlugin({
    name: "NoMiddleClickPaste",
    get description() { return t("يعطّل اللصق بزر الفأرة الأوسط في Linux - لنظام Linux فقط", "Disables middle-click paste on Linux - Linux only"); },
    authors: [Devs.Darxoon],
    hidden: !IS_LINUX,

    start() {
        window.addEventListener("mouseup", preventMiddleClick);
    },

    stop() {
        window.removeEventListener("mouseup", preventMiddleClick);
    },
});
