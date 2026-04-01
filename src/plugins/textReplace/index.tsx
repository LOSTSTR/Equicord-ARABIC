/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
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

import "./styles.css";

import { definePluginSettings } from "@api/Settings";
import { Button } from "@components/Button";
import { ExpandableSection } from "@components/ExpandableCard";
import { Flex } from "@components/Flex";
import { HeadingSecondary } from "@components/Heading";
import { Paragraph } from "@components/Paragraph";
import { Span } from "@components/Span";
import { TooltipContainer } from "@components/TooltipContainer";
import { Devs, EquicordDevs } from "@utils/constants";
import { classNameFactory } from "@utils/index";
import { Logger } from "@utils/Logger";
import { t } from "@utils/translation";
import definePlugin, { OptionType } from "@utils/types";
import { Message } from "@vencord/discord-types";
import { React, Select, TextInput, UserStore, useState } from "@webpack/common";

const cl = classNameFactory("vc-textReplace-");

type Rule = Record<"find" | "replace" | "onlyIfIncludes" | "scope" | "id", string>;

interface TextReplaceProps {
    title: string;
    description: string;
    rulesArray: Rule[];
    isRegex?: boolean;
}

const makeEmptyRule: () => Rule = () => ({
    find: "",
    replace: "",
    onlyIfIncludes: "",
    scope: "myMessages",
    id: crypto.randomUUID()
});

const makeEmptyRuleArray = () => [makeEmptyRule()];

const settings = definePluginSettings({
    replace: {
        type: OptionType.COMPONENT,
        component: () => {
            const { stringRules, regexRules } = settings.use(["stringRules", "regexRules"]);

            return (
                <>
                    <TextReplaceTesting />
                    <TextReplace
                        title={t("vencord.textReplace.usingString")}
                        description={t("vencord.textReplace.stringRules")}
                        rulesArray={stringRules}
                    />
                    <TextReplace
                        title={t("vencord.textReplace.usingRegex")}
                        description={t("vencord.textReplace.regexRules")}
                        rulesArray={regexRules}
                        isRegex
                    />
                </>
            );
        }
    },
    stringRules: {
        type: OptionType.CUSTOM,
        default: makeEmptyRuleArray(),
        description: t("vencord.textReplace.stringRules")
    },
    regexRules: {
        type: OptionType.CUSTOM,
        default: makeEmptyRuleArray(),
        description: t("vencord.textReplace.regexRules")
    }
});

function stringToRegex(str: string) {
    const match = str.match(/^(\/)?(.+?)(?:\/([gimsuyv]*))?$/); // Regex to match regex
    return match
        ? new RegExp(
            match[2], // Pattern
            match[3]
                ?.split("") // Remove duplicate flags
                .filter((char, pos, flagArr) => flagArr.indexOf(char) === pos)
                .join("")
            ?? "g"
        )
        : new RegExp(str); // Not a regex, return string
}

function renderFindError(find: string) {
    try {
        stringToRegex(find);
        return null;
    } catch (e) {
        return (
            <span style={{ color: "var(--text-feedback-critical)" }}>
                {String(e)}
            </span>
        );
    }
}

function Input({ initialValue, onChange, placeholder }: {
    placeholder: string;
    initialValue: string;
    onChange(value: string): void;
}) {
    const [value, setValue] = useState(initialValue);
    return (
        <TextInput
            placeholder={placeholder}
            value={value}
            onChange={setValue}
            spellCheck={false}
            onBlur={() => value !== initialValue && setTimeout(() => onChange(value), 0)}
        />
    );
}

function TextRow({ label, description, value, onChange }: { label: string; description: string; value: string; onChange(value: string): void; }) {
    return (
        <>
            <TooltipContainer text={description}>
                <Span weight="medium" size="md">{label}</Span>
            </TooltipContainer>
            <Input
                placeholder={description}
                initialValue={value}
                onChange={onChange}
            />
        </>
    );
}

const isEmptyRule = (rule: Rule) => !rule.find;

function TextReplace({ title, description, rulesArray, isRegex = false }: TextReplaceProps) {
    function onClickRemove(index: number) {
        rulesArray.splice(index, 1);
    }

    function onChange(e: string, index: number, key: string) {
        rulesArray[index][key] = e;

        // If a rule is empty after editing and is not the last rule, remove it
        if (rulesArray[index].find === "" && rulesArray[index].replace === "" && rulesArray[index].onlyIfIncludes === "" && index !== rulesArray.length - 1) {
            rulesArray.splice(index, 1);
        }
    }

    const scopeOptions = [
        { label: t("vencord.textReplace.scope.myMessages"), value: "myMessages" },
        { label: t("vencord.textReplace.scope.othersMessages"), value: "othersMessages" },
        { label: t("vencord.textReplace.scope.allMessages"), value: "allMessages" }
    ];

    return (
        <>
            <div>
                <HeadingSecondary>{title}</HeadingSecondary>
                <Paragraph>{description}</Paragraph>
            </div>
            <Flex flexDirection="column" style={{ gap: "0.5em", paddingBottom: "1.25em" }}>
                {rulesArray.map((rule, index) =>
                    <ExpandableSection
                        key={rule.id}
                        renderContent={() => (
                            <>
                                <div className={cl("input-grid")}>
                                    <TextRow
                                        label={t("vencord.textReplace.find")}
                                        description={isRegex ? t("vencord.textReplace.findDescRegex") : t("vencord.textReplace.findDesc")}
                                        value={rule.find}
                                        onChange={e => onChange(e, index, "find")}
                                    />
                                    <TextRow
                                        label={t("vencord.textReplace.replace")}
                                        description={t("vencord.textReplace.replaceDesc")}
                                        value={rule.replace}
                                        onChange={e => onChange(e, index, "replace")}
                                    />
                                    <TextRow
                                        label={t("vencord.textReplace.onlyIfIncludes")}
                                        description={t("vencord.textReplace.onlyIfIncludesDesc")}
                                        value={rule.onlyIfIncludes}
                                        onChange={e => onChange(e, index, "onlyIfIncludes")}
                                    />
                                </div>
                                <div style={{ marginTop: "0.25em" }}>
                                    <Select
                                        options={scopeOptions}
                                        isSelected={e => e === rule.scope}
                                        select={e => onChange(e, index, "scope")}
                                        serialize={e => e}
                                    />
                                </div>
                                {isRegex && renderFindError(rule.find)}
                                <Button
                                    className={cl("delete-button")}
                                    variant="dangerPrimary"
                                    onClick={() => onClickRemove(index)}
                                >
                                    Delete Rule
                                </Button>
                            </>
                        )}
                    >
                        <Paragraph weight="medium" size="md">
                            {isEmptyRule(rule)
                                ? `Empty Rule ${index + 1}`
                                : `Rule ${index + 1} - ${rule.find}`
                            }
                        </Paragraph>
                    </ExpandableSection>
                )}
                <Button
                    onClick={() => rulesArray.push(makeEmptyRule())}
                    disabled={rulesArray.length > 0 && isEmptyRule(rulesArray[rulesArray.length - 1])}
                >
                    Add Rule
                </Button>
            </Flex>
        </>
    );
}

function TextReplaceTesting() {
    const [value, setValue] = useState("");

    return (
        <div>
            <HeadingSecondary>Rule Tester</HeadingSecondary>
            <Flex flexDirection="column" gap={6}>
                <TextInput placeholder={t("vencord.textReplace.testMessage")} onChange={setValue} />
                <TextInput placeholder={t("vencord.textReplace.messageWithRules")} editable={false} value={applyRules(value, "allMessages")} style={{ opacity: 0.7 }} />
            </Flex>
        </div>
    );
}

function applyRules(content: string, scope: "myMessages" | "othersMessages" | "allMessages"): string {
    if (content.length === 0) {
        return content;
    }

    for (const rule of settings.store.stringRules) {
        if (!rule.find) continue;
        if (rule.onlyIfIncludes && !content.includes(rule.onlyIfIncludes)) continue;
        if (rule.scope !== "allMessages" && rule.scope !== scope && scope !== "allMessages") continue;

        content = ` ${content} `.replaceAll(rule.find, rule.replace.replaceAll("\\n", "\n")).replace(/^\s|\s$/g, "");
    }

    for (const rule of settings.store.regexRules) {
        if (!rule.find) continue;
        if (rule.onlyIfIncludes && !content.includes(rule.onlyIfIncludes)) continue;
        if (rule.scope !== "allMessages" && rule.scope !== scope && scope !== "allMessages") continue;

        try {
            const regex = stringToRegex(rule.find);
            content = content.replace(regex, rule.replace.replaceAll("\\n", "\n"));
        } catch (e) {
            new Logger("TextReplace").error(`Invalid regex: ${rule.find}`);
        }
    }

    content = content.trim();
    return content;
}

function modifyIncomingMessage(message: Message) {
    const currentUser = UserStore.getCurrentUser();
    const messageAuthor = message.author;

    if (!message.content || !currentUser?.id || !messageAuthor?.id || messageAuthor.id === currentUser.id) {
        return message.content;
    }

    return applyRules(message.content, "othersMessages");
}

const TEXT_REPLACE_RULES_EXEMPT_CHANNEL_IDS = [
    "1102784112584040479", // Vencord's Text Replace Rules Channel
    "1419347113745059961", // Equicord's Requests Channel
];

export default definePlugin({
    name: "TextReplace",
    description: t("vencord.textReplace.description"),
    authors: [Devs.AutumnVN, Devs.TheKodeToad, EquicordDevs.Etorix],
    isModified: true,

    settings,
    modifyIncomingMessage,

    patches: [
        {
            find: "!1,hideSimpleEmbedContent",
            replacement: {
                match: /(let{toAST:.{0,125}?)\(\i\?\?\i\).content/,
                replace: "const textReplaceContent=$self.modifyIncomingMessage(arguments[2]?.contentMessage??arguments[1]);$1textReplaceContent"
            }
        },
    ],

    start() {
        const { stringRules, regexRules } = settings.store;

        stringRules.forEach(rule => {
            rule.scope ??= "myMessages";
            rule.id ??= crypto.randomUUID();
        });

        regexRules.forEach(rule => {
            rule.scope ??= "myMessages";
            rule.id ??= crypto.randomUUID();
        });
    },

    onBeforeMessageSend(channelId, msg) {
        // Replacing text in channels used for sharing/requesting rules may be messy.
        if (TEXT_REPLACE_RULES_EXEMPT_CHANNEL_IDS.includes(channelId)) return;
        msg.content = applyRules(msg.content, "myMessages");
    }
});
