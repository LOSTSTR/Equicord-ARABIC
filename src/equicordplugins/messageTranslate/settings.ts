/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { t } from "@utils/esharqI18n";
import { OptionType } from "@utils/types";

export const settings = definePluginSettings({
    targetLanguage: {
        type: OptionType.STRING,
        description: t("رمز اللغة الهدف للترجمة (مثل: en, ar, fr, de, ja)", "Target language code for translation (e.g. en, ar, fr, de, ja)"),
        default: "en",
    },
    confidenceRequirement: {
        type: OptionType.NUMBER,
        description: t("الحد الأدنى للثقة (من 0 إلى 1) المطلوب لعرض الترجمة.", "Minimum confidence (0 to 1) required to display the translation."),
        default: 0.8,
    },
    autoTranslate: {
        type: OptionType.BOOLEAN,
        description: t("ترجمة الرسائل تلقائياً عند ظهورها.", "Automatically translate messages when they appear."),
        default: true,
    },
    skipOwnMessages: {
        type: OptionType.BOOLEAN,
        description: t("عدم ترجمة رسائلك الخاصة.", "Do not translate your own messages."),
        default: true,
    },
    skipBotMessages: {
        type: OptionType.BOOLEAN,
        description: t("عدم ترجمة رسائل الروبوتات.", "Do not translate bot messages."),
        default: false,
    },
    ignoredGuilds: {
        type: OptionType.STRING,
        description: t("قائمة معرفات السيرفرات التي لا تُترجم فيها (مفصولة بفاصلة).", "Comma-separated list of server IDs where translation is disabled."),
        default: "",
    },
    ignoredChannels: {
        type: OptionType.STRING,
        description: t("قائمة معرفات القنوات التي لا تُترجم فيها (مفصولة بفاصلة).", "Comma-separated list of channel IDs where translation is disabled."),
        default: "",
    },
    ignoredUsers: {
        type: OptionType.STRING,
        description: t("قائمة معرفات المستخدمين الذين لا تُترجم رسائلهم (مفصولة بفاصلة).", "Comma-separated list of user IDs whose messages are not translated."),
        default: "",
    },
    showIndicator: {
        type: OptionType.BOOLEAN,
        description: t("إضافة مؤشر صغير (مترجم) للرسائل المترجمة.", "Add a small indicator (translated) to translated messages."),
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
