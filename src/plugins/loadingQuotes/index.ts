/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import { Logger } from "@utils/Logger";
import definePlugin, { OptionType } from "@utils/types";
import presetQuotesText from "file://quotes.txt";

const presetQuotes = presetQuotesText.split("\n").map(quote => /^\s*[^#\s]/.test(quote) && quote.trim()).filter(Boolean) as string[];
const noQuotesQuote = "Did you really disable all loading quotes? What a buffoon you are...";

const settings = definePluginSettings({
    replaceEvents: {
        description: t("تطبيق الإضافة أيضاً خلال الفعاليات ذات الاقتباسات الخاصة (مثل الهالوين)", "Also apply the plugin during events with special quotes (such as Halloween)"),
        type: OptionType.BOOLEAN,
        default: true
    },
    enablePluginPresetQuotes: {
        description: t("تفعيل الاقتباسات المحددة مسبقاً بواسطة هذه الإضافة", "Enable the preset quotes provided by this plugin"),
        type: OptionType.BOOLEAN,
        default: true
    },
    enableDiscordPresetQuotes: {
        description: t("تفعيل اقتباسات Discord المحددة مسبقاً (بما في ذلك اقتباسات الفعاليات)", "Enable Discord's preset quotes (including event quotes)"),
        type: OptionType.BOOLEAN,
        default: false
    },
    additionalQuotes: {
        description: t("اقتباسات مخصصة إضافية قد تظهر، مفصولة بالمحدد أدناه", "Additional custom quotes that may appear, separated by the delimiter below"),
        type: OptionType.STRING,
        default: "",
        multiline: true
    },
    additionalQuotesDelimiter: {
        description: t("محدد الاقتباسات الإضافية", "Delimiter for additional quotes"),
        type: OptionType.STRING,
        default: "|",
    },
});

export default definePlugin({
    name: "LoadingQuotes",
    get description() { return t("يُغيّر اقتباسات شاشة التحميل", "Changes the loading screen quotes"); },
    tags: ["Appearance", "Fun", "Customisation"],
    authors: [Devs.Ven, Devs.KraXen72, Devs.UlyssesZhan],

    settings,

    patches: [
        {
            find: "#{intl::LOADING_DID_YOU_KNOW}",
            replacement: [
                {
                    match: /_loadingText.+?(?=(\i)\[.{0,10}\.random)/,
                    replace: "$&$self.mutateQuotes($1),"
                },
                {
                    match: /_eventLoadingText.+?(?=(\i)\[.{0,10}\.random)/,
                    replace: "$&$self.mutateQuotes($1),",
                    predicate: () => settings.store.replaceEvents
                }
            ]
        },
    ],

    mutateQuotes(quotes: string[]) {
        try {
            const { enableDiscordPresetQuotes, additionalQuotes, additionalQuotesDelimiter, enablePluginPresetQuotes } = settings.store;

            if (!enableDiscordPresetQuotes)
                quotes.length = 0;

            if (enablePluginPresetQuotes)
                quotes.push(...presetQuotes);

            quotes.push(...additionalQuotes.split(additionalQuotesDelimiter).filter(Boolean));

            if (!quotes.length)
                quotes.push(noQuotesQuote);
        } catch (e) {
            new Logger("LoadingQuotes").error("Failed to mutate quotes", e);
        }
    }
});
