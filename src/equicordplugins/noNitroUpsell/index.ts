/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin from "@utils/types";
import { OverridePremiumTypeStore } from "@webpack/common";

export default definePlugin({
    name: "NoNitroUpsell",
    get description() { return t("يزيل جميع نوافذ الترويج لنيترو بإيهام العميل بأنك مشترك فيه.", "Removes all Nitro upsell prompts by tricking the client into thinking you are subscribed."); },
    tags: ["Utility"],
    authors: [Devs.thororen],
    flux: {
        CONNECTION_OPEN() {
            const state = OverridePremiumTypeStore.getState();
            if (state.premiumTypeActual !== 2 || state.premiumTypeOverride === 2) return;
            state.premiumTypeOverride = 2;
        }
    },
    start() {
        OverridePremiumTypeStore.getState().premiumTypeOverride = 2;
    },
    stop() {
        OverridePremiumTypeStore.getState().premiumTypeOverride = undefined;
    }
});
