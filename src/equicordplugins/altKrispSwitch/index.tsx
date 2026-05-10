/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "AltKrispSwitch",
    description: "يجعل نافذة إلغاء الضوضاء تتبدّل بين None وKrisp بدلاً من Krisp وStandard",
    tags: ["Customisation", "Voice"],
    authors: [Devs.newwares],
    patches: [
        {
            find: ",setNoiseCancellation(",
            replacement: {
                match: /(}\),)(.{1,2}\.\i\.dispatch\({type:"AUDIO_SET_NOISE_SUPPRESSION",)/,
                replace: "$1!$self.shouldCancelSuppression(arguments)&&$2"
            }
        }
    ],
    shouldCancelSuppression([enableKrisp, options]) {
        if (options?.section === "Noise Cancellation Popout") {
            if (enableKrisp) {
                return false;
            } else {
                return true;
            }
        }
    }
});
