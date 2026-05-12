/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { makeRange, OptionType } from "@utils/types";

import { apiConstants } from "./lib/api";
import Settings from "./ui/settings";

export default definePluginSettings({
    collapseSongList: {
        type: OptionType.BOOLEAN,
        description: "يطوي قائمة الأغاني في ملفات المستخدمين إلى زر يفتح قائمة منفصلة",
        default: false,
    },
    profileSongsLimit: {
        type: OptionType.SLIDER,
        description: "عدد الأغاني التي تظهر عند النقر على ملف المستخدم أول مرة",
        default: apiConstants.songLimit,
        markers: makeRange(1, 3),
    },
    manager: {
        type: OptionType.COMPONENT,
        component: () => <Settings />,
    },
}, {
    profileSongsLimit: {
        disabled() {
            return this.store.collapseSongList;
        },
    },
});
