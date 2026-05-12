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
        description: "موجّه النظام للذكاء الاصطناعي. العناصر النائبة: {current_user}, {current_time}",
        default: "You are a helpful assistant who answers questions for the user in a concise and short way while using the least amount of words and punctuation.\nCurrent user: {current_user}\nCurrent time: {current_time}",
        placeholder: "Enter system prompt.",
        multiline: true
    },
    maxTokens: {
        type: OptionType.NUMBER,
        description: "الحد الأقصى لعدد الرموز في الاستجابة.",
        default: 500
    },
    endpoint: {
        type: OptionType.STRING,
        description: "نقطة نهاية ذكاء اصطناعي متوافقة مع OpenAI.",
        default: "https://openrouter.ai/api/v1/chat/completions",
        placeholder: "Enter your OpenAI compatible AI endpoint here."
    },
    context: {
        type: OptionType.NUMBER,
        description: "عدد الرسائل السابقة التي تُضمَّن كسياق.",
        default: 0
    },
    passMessageAuthorName: {
        type: OptionType.BOOLEAN,
        description: "إضافة اسم المؤلف قبل محتوى الرسالة عند إرسالها للذكاء الاصطناعي. يساعد على تمييز المستخدمين المختلفين في المحادثة.",
        default: true
    },
    treatSelfAsAssistant: {
        type: OptionType.BOOLEAN,
        description: "عند التفعيل، تُعامَل رسائلك كرسائل مساعد في السياق. قد يجعل بعض النماذج تبدأ بكتابة قصص خيالية.",
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
        description: "تمرير الصور للذكاء الاصطناعي كسياق (إن وجدت). لا يدعم هذا كل النماذج.",
        default: true
    }
});
