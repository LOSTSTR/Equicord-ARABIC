/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import { t } from "@utils/translation";
import definePlugin, { makeRange, OptionType } from "@utils/types";

const settings = definePluginSettings({
    zoomMultiplier: {
        type: OptionType.SLIDER,
        description: t("vencord.unlockedAvatarZoom.settings.zoomMultiplier"),
        markers: makeRange(2, 16),
        default: 4,
    },
});

export default definePlugin({
    name: "UnlockedAvatarZoom",
    description: t("vencord.unlockedAvatarZoom.description"),
    tags: ["Media", "Utility"],
    authors: [Devs.nakoyasha],
    settings,
    patches: [
        {
            find: "#{intl::AVATAR_UPLOAD_EDIT_MEDIA}",
            replacement: {
                match: /maxValue:\d/,
                replace: "maxValue:$self.settings.store.zoomMultiplier",
            }
        }
    ]
});
