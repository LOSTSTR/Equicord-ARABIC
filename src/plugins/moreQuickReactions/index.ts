/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./styles.css";

import { definePluginSettings, migratePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin, { makeRange, OptionType } from "@utils/types";

const settings = definePluginSettings({
    reactionCount: {
        description: t("عدد التفاعلات السريعة (0-42)", "Number of quick reactions (0-42)"),
        type: OptionType.NUMBER,
        default: 5
    },
    frequentEmojis: {
        description: t("استخدام الإيموجي الأكثر استخداماً بدلاً من المفضلة", "Use the most frequently used emojis instead of favorites"),
        type: OptionType.BOOLEAN,
        restartNeeded: true,
        default: true
    },
    rows: {
        description: t("عدد صفوف التفاعلات السريعة للعرض", "Number of quick reaction rows to display"),
        type: OptionType.SLIDER,
        default: 2,
        markers: makeRange(1, 16, 1),
        stickToMarkers: true
    },
    columns: {
        description: t("عدد أعمدة التفاعلات السريعة للعرض", "Number of quick reaction columns to display"),
        type: OptionType.SLIDER,
        default: 4,
        markers: makeRange(1, 12, 1),
        stickToMarkers: true
    },
    compactMode: {
        description: t("تصغير الأزرار إلى 75% من حجمها الأصلي مع تكبير الإيموجي الداخلي إلى 125%. ستكون الإيموجي 93.75% من حجمها الأصلي. يُنصح بوجود 5 أعمدة على الأقل", "Shrink buttons to 75% of their original size while scaling up the inner emoji to 125%. Emojis will be 93.75% of their original size. At least 5 columns recommended"),
        type: OptionType.BOOLEAN,
        default: false
    },
    scroll: {
        description: t("تفعيل التمرير في قائمة الإيموجي", "Enable scrolling in the emoji list"),
        type: OptionType.BOOLEAN,
        default: true
    }
});

migratePluginSettings("MoreQuickReactions", "BetterQuickReact");
export default definePlugin({
    name: "MoreQuickReactions",
    get description() { return t("يُضيف المزيد من ردود الفعل السريعة", "Adds more quick reactions"); },
    tags: ["Emotes", "Reactions", "Customisation", "Shortcuts"],
    authors: [Devs.Ven, Devs.Sqaaakoi, Devs.iamme],
    isModified: true,
    settings,

    patches: [
        {
            find: "#{intl::MESSAGE_UTILITIES_A11Y_LABEL}",
            replacement: {
                match: /(?<=length>=3\?.{0,40})\.slice\(0,3\)/,
                replace: ".slice(0,$self.reactionCount)"
            }
        },
        // Remove favourite emojis from being inserted at the start of the reaction list
        {
            find: "this.favoriteEmojisWithoutFetchingLatest.concat",
            replacement: {
                match: /(this\.favoriteEmojisWithoutFetchingLatest)\.concat/,
                replace: "[].concat"
            },
            predicate: () => settings.store.frequentEmojis
        },
        {
            find: "#{intl::ADD_REACTION_NAMED}",
            group: true,
            replacement: [
                {
                    match: /isEmojiPremiumLocked\(\{.{0,25}channel:(\i),/,
                    replace: "$&guild_id:$1?.guild_id??null,"
                },
                // Override limit of emojis to display with offset hook.
                {
                    match: /"MessageContextMenu"\},\{autoTrackExposure.{0,5}\}\),/,
                    replace: "$&[moreQuickReactionsScrollValue,setMoreQuickReactionsScrollValue]=Vencord.Webpack.Common.React.useState(0),"
                },
                {
                    match: /\.length>4&&\(\i\.length=4\)/,
                    replace: ""
                },
                // Add a custom class to identify the quick reactions have been modified and a CSS variable for the number of columns to display
                {
                    match: /className:(\i\.\i),(?=children:)/,
                    replace: 'className:"vc-better-quick-react "+($self.settings.store.compactMode?"vc-better-quick-react-compact ":"")+$1,style:{"--vc-better-quick-react-columns":$self.settings.store.columns},'
                },
                // Scroll handler + Apply the emoji count limit from earlier with custom logic
                {
                    match: /children:(\i)\.map\(/,
                    replace: "onWheel:$self.onWheelWrapper(moreQuickReactionsScrollValue,setMoreQuickReactionsScrollValue,$1.length),children:$self.applyScroll($1,moreQuickReactionsScrollValue).map("
                }
            ]
        },
        // MenuGroup doesn't accept styles or anything special by default :/
        {
            find: /\.groupLabel,\i\.hideInteraction,/,
            replacement: {
                match: /role:"group",/,
                replace: "$&style:arguments[0].style,onWheel:arguments[0].onWheel,"
            }
        },
        {
            find: '"--custom-menu-viewport-padding"',
            replacement: {
                match: /className:\i\(\)\(\i\.menu/,
                replace: '$&,"vc-better-quick-react-padding"'
            }
        }
    ],
    getMaxQuickReactions() {
        return settings.store.rows * settings.store.columns;
    },
    get reactionCount() {
        return settings.store.reactionCount;
    },
    applyScroll(emojis: any[], index: number) {
        return emojis.slice(index, index + this.getMaxQuickReactions());
    },
    onWheelWrapper(currentScrollValue: number, setScrollHook: (value: number) => void, emojisLength: number) {
        if (settings.store.scroll) return (e: WheelEvent) => {
            if (e.deltaY === 0 || e.shiftKey) return;
            e.stopPropagation(); // does this do anything?
            const modifier = e.deltaY < 0 ? -1 : 1;
            const newValue = currentScrollValue + (modifier * settings.store.columns);
            setScrollHook(Math.max(0, Math.min(newValue, emojisLength - this.getMaxQuickReactions())));
        };
    },
});
