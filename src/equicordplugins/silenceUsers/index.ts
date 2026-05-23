/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { EquicordDevs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin, { OptionType } from "@utils/types";
import { FluxDispatcher } from "@webpack/common";

const settings = definePluginSettings({
    mutedUserIds: {
        type: OptionType.STRING,
        description: t("معرّفات مستخدمي Discord مفصولة بفواصل لكتم إشعاراتهم وشاراتهم.", "Comma-separated Discord user IDs to silence their notifications and badges."),
        default: "",
        restartNeeded: false,
    },
});

let cachedMutedIds: Set<string> = new Set();
let cachedMutedIdsRaw = "";

function getMutedIds(): Set<string> {
    const raw = settings.plain.mutedUserIds;
    if (raw !== cachedMutedIdsRaw) {
        cachedMutedIdsRaw = raw;
        cachedMutedIds = new Set(raw.split(",").map(id => id.trim()).filter(Boolean));
    }
    return cachedMutedIds;
}

function interceptor(event: any) {
    try {
        const mutedIds = getMutedIds();
        if (!mutedIds.size) return;

        if (event.type === "MESSAGE_CREATE" || event.type === "MESSAGE_UPDATE") {
            const msg = event.message;
            if (!msg) return;

            const authorId = String(msg.author?.id ?? "");
            if (!authorId || !mutedIds.has(authorId)) return;

            msg.mention_everyone = false;
            msg.mention_roles = [];
            msg.mentions = [];
        }

        if (event.type === "NOTIFICATION_CREATE") {
            const msg = event?.message ?? event?.notification?.message;
            if (!msg) return;

            const authorId = String(msg?.author?.id ?? "");
            if (!authorId || !mutedIds.has(authorId)) return;

            return false;
        }
    } catch { }
}

export default definePlugin({
    name: "SilenceUsers",
    get description() { return t("يكتم تنبيهات @mention وعدادات شارات السيرفر من مستخدمين محددين. لا تتأثر الرسائل العادية والرسائل المباشرة.", "Silences @mention notifications and server badge counts from specific users. Regular messages and DMs are unaffected."); },
    authors: [EquicordDevs.dka],
    settings,
    start() {
        FluxDispatcher.addInterceptor(interceptor);
    },
    stop() {
        const list = FluxDispatcher._interceptors ?? [];
        const idx = list.indexOf(interceptor);
        if (idx !== -1) list.splice(idx, 1);
    },
});
