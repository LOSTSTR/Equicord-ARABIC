/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

export const settings = definePluginSettings({
    apiKey: {
        type: OptionType.STRING,
        description: "مفتاح API.",
        default: "",
        placeholder: "Enter API Key here for your AI endpoint.",
        componentProps: {
            type: "password"
        }
    },
    model: {
        type: OptionType.STRING,
        description: "نموذج الذكاء الاصطناعي المستخدم.",
        default: "google/gemini-3-flash-preview",
        placeholder: "e.g. google/gemini-3-flash-preview, inception/mercury, openai/gpt-5.2-chat, etc."
    },
    systemPrompt: {
        type: OptionType.STRING,
        description: "الموجّه النظامي للذكاء الاصطناعي. العناصر النائبة: {current_user}, {current_time}",
        default: "You are a helpful assistant who answers questions for the user in a concise and short way while using the least amount of words and punctuation.\nCurrent user: {current_user}\nCurrent time: {current_time}",
        placeholder: "Enter system prompt.",
        multiline: true
    },
    maxTokens: {
        type: OptionType.NUMBER,
        description: "الحد الأقصى لعدد التوكنات في الرد.",
        default: 500
    },
    endpoint: {
        type: OptionType.STRING,
        description: "نقطة نهاية AI متوافقة مع OpenAI.",
        default: "https://openrouter.ai/api/v1/chat/completions",
        placeholder: "Enter your OpenAI compatible AI endpoint here."
    },
    context: {
        type: OptionType.NUMBER,
        description: "عدد الرسائل السابقة لتضمينها كسياق.",
        default: 0
    },
    passMessageAuthorName: {
        type: OptionType.BOOLEAN,
        description: "يُضيف اسم المرسل قبل محتوى الرسالة عند تمريرها للذكاء الاصطناعي. يساعد ذلك في التمييز بين المستخدمين.",
        default: true
    },
    treatSelfAsAssistant: {
        type: OptionType.BOOLEAN,
        description: "عند التفعيل، تُعامَل رسائلك الخاصة كرسائل مساعد في السياق. قد يؤدي ذلك لبعض النماذج إلى توليد نصوص غريبة.",
        default: false
    },
    mode: {
        type: OptionType.SELECT,
        description: "كيف يجب معالجة الإجابات؟",
        options: [
            { label: "Auto Reply", value: "autoreply" },
            { label: "Replace Chatbar Text", value: "chatbar", default: true },
            { label: "Clyde", value: "bot" }
        ]
    },
    supportImages: {
        type: OptionType.BOOLEAN,
        description: "يمرر الصور للذكاء الاصطناعي كسياق (إن وجدت). لا تدعم ذلك جميع النماذج.",
        default: true
    }
});
