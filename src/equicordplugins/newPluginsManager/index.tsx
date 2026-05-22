/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin from "@utils/types";

import * as KnownSettings from "./knownSettings";
import { KNOWN_PLUGINS_LEGACY_DATA_KEY, KNOWN_SETTINGS_DATA_KEY } from "./knownSettings";
import { openNewPluginsModal } from "./NewPluginsModal";

export default definePlugin({
    name: "NewPluginsManager",
    get description() { return t("أداة تُنبّهك عند إضافة إضافات جديدة إلى Equicord", "A tool that notifies you when new plugins are added to Equicord"); },
    tags: ["Utility"],
    authors: [Devs.Sqaaakoi],
    enabledByDefault: true,
    flux: {
        async POST_CONNECTION_OPEN() {
            openNewPluginsModal();
        }
    },
    openNewPluginsModal,
    KNOWN_PLUGINS_LEGACY_DATA_KEY,
    KNOWN_SETTINGS_DATA_KEY,
    KnownSettings
});
