/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin, { makeRange, OptionType } from "@utils/types";

const settings = definePluginSettings({
    zoomMultiplier: {
        type: OptionType.SLIDER,
        description: t("مضاعف التكبير", "Zoom multiplier"),
        markers: makeRange(2, 16),
        default: 4,
    },
});

export default definePlugin({
    name: "UnlockedAvatarZoom",
    get description() { return t("يُتيح تكبير الأفاتار أكثر من الحد المعتاد", "Allows zooming avatars beyond the usual limit"); },
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
