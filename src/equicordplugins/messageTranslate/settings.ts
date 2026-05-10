/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

export const settings = definePluginSettings({
    targetLanguage: {
        type: OptionType.STRING,
        description: "رمز اللغة الهدف للترجمة (مثل: en, ar, fr, de, ja)",
        default: "en",
    },
    confidenceRequirement: {
        type: OptionType.NUMBER,
        description: "الحد الأدنى للثقة (من 0 إلى 1) المطلوب لعرض الترجمة",
        default: 0.8,
    },
    autoTranslate: {
        type: OptionType.BOOLEAN,
        description: "ترجمة الرسائل تلقائياً عند ظهورها",
        default: true,
    },
    skipOwnMessages: {
        type: OptionType.BOOLEAN,
        description: "عدم ترجمة رسائلك الخاصة",
        default: true,
    },
    skipBotMessages: {
        type: OptionType.BOOLEAN,
        description: "عدم ترجمة رسائل البوتات",
        default: false,
    },
    ignoredGuilds: {
        type: OptionType.STRING,
        description: "قائمة معرّفات السيرفرات مفصولة بفاصلة لتجاهل الترجمة فيها",
        default: "",
    },
    ignoredChannels: {
        type: OptionType.STRING,
        description: "قائمة معرّفات القنوات مفصولة بفاصلة لتجاهل الترجمة فيها",
        default: "",
    },
    ignoredUsers: {
        type: OptionType.STRING,
        description: "قائمة معرّفات المستخدمين مفصولة بفاصلة لتجاهل ترجمة رسائلهم",
        default: "",
    },
    showIndicator: {
        type: OptionType.BOOLEAN,
        description: "إضافة مؤشر صغير (مترجم) للرسائل المترجمة",
        default: true,
    },
});

function parseIdList(value: string): Set<string> {
    return new Set(value.split(",").map(s => s.trim()).filter(Boolean));
}

export function getIgnoredGuilds(): Set<string> {
    return parseIdList(settings.store.ignoredGuilds);
}

export function getIgnoredChannels(): Set<string> {
    return parseIdList(settings.store.ignoredChannels);
}

export function getIgnoredUsers(): Set<string> {
    return parseIdList(settings.store.ignoredUsers);
}
