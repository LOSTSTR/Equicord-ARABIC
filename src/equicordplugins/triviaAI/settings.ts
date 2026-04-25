/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { t } from "@utils/translation";
import { OptionType } from "@utils/types";

export const settings = definePluginSettings({
    apiKey: {
        type: OptionType.STRING,
        description: t("equicord.triviaAI.settings.apiKey"),
        default: "",
        placeholder: "Enter API Key here for your AI endpoint.",
        componentProps: {
            type: "password"
        }
    },
    model: {
        type: OptionType.STRING,
        description: t("equicord.triviaAI.settings.model"),
        default: "google/gemini-3-flash-preview",
        placeholder: "e.g. google/gemini-3-flash-preview, inception/mercury, openai/gpt-5.2-chat, etc."
    },
    systemPrompt: {
        type: OptionType.STRING,
        description: t("equicord.triviaAI.settings.systemPrompt"),
        default: "You are a helpful assistant who answers questions for the user in a concise and short way while using the least amount of words and punctuation.\nCurrent user: {current_user}\nCurrent time: {current_time}",
        placeholder: "Enter system prompt.",
        multiline: true
    },
    maxTokens: {
        type: OptionType.NUMBER,
        description: t("equicord.triviaAI.settings.maxTokens"),
        default: 500
    },
    endpoint: {
        type: OptionType.STRING,
        description: t("equicord.triviaAI.settings.endpoint"),
        default: "https://openrouter.ai/api/v1/chat/completions",
        placeholder: "Enter your OpenAI compatible AI endpoint here."
    },
    context: {
        type: OptionType.NUMBER,
        description: "Number of previous messages to include as context.",
        default: 0
    },
    passMessageAuthorName: {
        type: OptionType.BOOLEAN,
        description: "Prepend the author's name to the message content when passing it to the AI. This can help the AI distinguish between different users in a conversation.",
        default: true
    },
    treatSelfAsAssistant: {
        type: OptionType.BOOLEAN,
        description: "When enabled, your own messages will be treated as assistant messages in the context. This causes some models to start generating fanfic.",
        default: false
    },
    mode: {
        type: OptionType.SELECT,
        description: t("equicord.triviaAI.settings.autoRespond"),
        options: [
            { label: t("equicord.triviaAI.settings.autoReply"), value: "autoreply" },
            { label: t("equicord.triviaAI.settings.chatBar"), value: "chatbar", default: true },
            { label: t("equicord.triviaAI.settings.bot"), value: "bot" }
        ]
    },
    supportImages: {
        type: OptionType.BOOLEAN,
        description: t("equicord.triviaAI.settings.supportImages"),
        default: true
    }
});
