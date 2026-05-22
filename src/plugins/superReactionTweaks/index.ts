/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated, ant0n, FieryFlames and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin, { OptionType } from "@utils/types";
import { OverridePremiumTypeStore } from "@webpack/common";

export const settings = definePluginSettings({
    superReactByDefault: {
        type: OptionType.BOOLEAN,
        description: t("يجعل منتقي التفاعلات يختار التفاعلات الفائقة افتراضياً", "Makes the reaction picker default to super reactions"),
        default: true,
    },
    unlimitedSuperReactionPlaying: {
        type: OptionType.BOOLEAN,
        description: t("إزالة الحد من تشغيل التفاعلات الفائقة في آنٍ واحد", "Remove the limit on playing super reactions simultaneously"),
        default: false,
    },

    superReactionPlayingLimit: {
        description: t("الحد الأقصى للتفاعلات الفائقة المتزامنة. 0 لتعطيل التشغيل", "Maximum number of concurrent super reactions. 0 to disable playback"),
        type: OptionType.SLIDER,
        default: 20,
        markers: [0, 5, 10, 20, 40, 60, 80, 100],
        stickToMarkers: true,
    },
}, {
    superReactionPlayingLimit: {
        disabled() { return this.store.unlimitedSuperReactionPlaying; },
    }
});

export default definePlugin({
    name: "SuperReactionTweaks",
    get description() { return t("يُتيح تخصيص ردود الفعل الكبيرة", "Allows customizing super reactions"); },
    tags: ["Reactions", "Emotes"],
    authors: [Devs.FieryFlames, Devs.ant0n],
    patches: [
        {
            find: ",BURST_REACTION_EFFECT_PLAY",
            replacement: [
                {
                    // if (inlinedCalculatePlayingCount(a,b) >= limit) return;
                    match: /(BURST_REACTION_EFFECT_PLAY:\i=>{.+?if\()(\(\(\i,\i\)=>.+?\(\i,\i\))>=5+?(?=\))/,
                    replace: (_, rest, playingCount) => `${rest}!$self.shouldPlayBurstReaction(${playingCount})`
                }
            ]
        },
        {
            find: ".EMOJI_PICKER_CONSTANTS_EMOJI_CONTAINER_PADDING_HORIZONTAL)",
            replacement: {
                match: /(openPopoutType:void 0(?=.+?isBurstReaction:(\i).+?;(\i===\i\.\i\.REACTION)&&\i\.push\().+?\[\2,\i\]=\i\.useState\()!1\)/,
                replace: (_, rest, _isBurstReactionVariable, isReactionIntention) => `${rest}$self.shouldSuperReactByDefault&&${isReactionIntention})`
            }
        }
    ],
    settings,

    shouldPlayBurstReaction(playingCount: number) {
        if (settings.store.unlimitedSuperReactionPlaying) return true;
        if (settings.store.superReactionPlayingLimit > playingCount) return true;
        return false;
    },

    get shouldSuperReactByDefault() {
        return settings.store.superReactByDefault && (OverridePremiumTypeStore.getState().premiumTypeActual != null);
    }
});
