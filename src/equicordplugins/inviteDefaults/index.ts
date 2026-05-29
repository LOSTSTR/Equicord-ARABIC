/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { EquicordDevs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin, { OptionType } from "@utils/types";

const settings = definePluginSettings({
    inviteDuration: {
        type: OptionType.SELECT,
        description: t("مدة الدعوة", "Invite duration"),
        options: [
            { label: t("٣٠ دقيقة", "30 minutes"), value: 1800 },
            { label: t("ساعة واحدة", "1 hour"), value: 3600 },
            { label: t("٦ ساعات", "6 hours"), value: 21600 },
            { label: t("١٢ ساعة", "12 hours"), value: 43200 },
            { label: t("يوم واحد", "1 day"), value: 86400 },
            { label: t("٧ أيام", "7 days"), value: 604800 },
            { label: t("للأبد", "Forever"), value: 0, default: true },
        ],
    },
    maxUses: {
        type: OptionType.SELECT,
        description: t("عدد استخدامات الدعوة", "Invite max uses"),
        options: [
            { label: t("لا نهاية", "Infinite"), value: 0, default: true },
            { label: "1", value: 1 },
            { label: "5", value: 5 },
            { label: "10", value: 10 },
            { label: "25", value: 25 },
            { label: "50", value: 50 },
            { label: "100", value: 100 },
        ],
    },
    temporaryMembership: {
        type: OptionType.BOOLEAN,
        default: false,
        description: t("عضوية مؤقتة", "Temporary membership"),
    },
});

export default definePlugin({
    name: "InviteDefaults",
    get description() { return t("يتيح لك تعديل القيم الافتراضية عند إنشاء دعوات السيرفر.", "Allows you to customize default values when creating server invites."); },
    tags: ["Servers"],
    authors: [EquicordDevs.VillainsRule],
    settings,
    patches: [
        {
            find: ".GUILD_CREATE_INVITE_SUGGESTION,defaultMaxAge",
            replacement: [
                {
                    match: /(?<=maxAge:)\i\?\?\i\?\?\i/,
                    replace: "$self.settings.store.inviteDuration"
                },
                {
                    match: /(?<=maxUses:)null!=\i&&0!==\i\?\i:\i.value/,
                    replace: "$self.settings.store.maxUses"
                },
                {
                    match: /(?<=temporary:)\i\?\?!1/,
                    replace: "$self.settings.store.temporaryMembership"
                }
            ]
        }
    ]
});
