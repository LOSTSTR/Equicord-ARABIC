/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ApplicationCommandOptionType, findOption } from "@api/Commands";
import { definePluginSettings } from "@api/Settings";
import { Devs, EquicordDevs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin, { OptionType } from "@utils/types";

function getMessage(opts) {
    const inputOption = findOption(opts, "input", "");

    let queryURL = "" + searchEngines[settings.store.defaultEngine] + encodeURIComponent(inputOption);

    if (settings.store.customEngineURL) {
        queryURL = "" + [settings.store.customEngineURL] + encodeURIComponent(inputOption);
    }

    if (settings.store.hyperlink && !settings.store.embed) {
        return `[${inputOption}](<${queryURL}>)`;
    }
    else if (settings.store.hyperlink) {
        return `[${inputOption}](${queryURL})`;
    }
    else if (!settings.store.embed) {
        return `<${queryURL}>`;
    }
    else {
        return queryURL;
    }
}

const searchEngines = {
    "Google": "https://www.google.com/search?q=",
    "Bing": "https://www.bing.com/search?q=",
    "Yahoo": "https://search.yahoo.com/search?p=",
    "DuckDuckGo": "https://duckduckgo.com/?q=",
    "Baidu": "https://www.baidu.com/s?wd=",
    "Yandex": "https://yandex.com/search/?text=",
    "Ecosia": "https://www.ecosia.org/search?q=",
    "Ask": "https://www.ask.com/web?q=",
    "AOL": "https://search.aol.com/aol/search?q=",
    "LetMeGoogleThatForYou": "https://letmegooglethat.com/?q="
};

const settings = definePluginSettings({
    hyperlink: {
        type: OptionType.BOOLEAN,
        description: t("يجعل الرابط المرسل نصاً مشار إليه باستخدام الاستعلام كعنوان", "Makes the sent link hyperlinked text using the query as title"),
        default: false
    },
    embed: {
        type: OptionType.BOOLEAN,
        description: t("ما إذا كان الرابط المرسل يجب أن يُظهر معاينة", "Whether the sent link should show a preview"),
        default: true
    },
    defaultEngine: {
        type: OptionType.SELECT,
        description: t("محرك البحث المستخدم", "Search engine to use"),
        options: Object.keys(searchEngines).map((key, index) => ({
            label: key,
            value: key,
            default: index === 0
        }))
    },
    customEngineURL: {
        description: t("رابط محرك البحث الذي تريد استخدامه", "URL of the search engine you want to use"),
        type: OptionType.STRING,
        placeholder: ""
    }
});

export default definePlugin({
    name: "GoogleThat",
    get description() { return t("يضيف أمراً لإرسال رابط بحث على الإنترنت", "Adds a command to send a web search link"); },
    dependencies: ["CommandsAPI"],
    tags: ["Commands", "Utility"],
    authors: [Devs.Samwich, EquicordDevs.KrystalSkull],
    searchTerms: ["search", "google", "query", "duckduckgo", "command"],
    settings,
    commands: [
        {
            name: "googlethat",
            description: t("إرسال رابط محرك بحث", "Send a search engine link"),
            options: [
                {
                    name: "input",
                    description: t("استعلام البحث", "Search query"),
                    type: ApplicationCommandOptionType.STRING,
                    required: true,
                }
            ],
            execute: opts => ({
                content: getMessage(opts)
            }),
        }
    ]
});
