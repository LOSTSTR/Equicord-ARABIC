/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { t } from "@utils/esharqI18n";

import { TAG_PLUGINS, TAG_UTILITY } from "../metadata/tags";
import type { ExtensionDefinition } from "../registry";
import type { ExtensionKeybindMap } from "./types";

export const INSTALLED_EXTENSIONS_KEY = "CommandPaletteInstalledExtensions";
export const EXTENSION_KEYBINDS_KEY = "CommandPaletteExtensionKeybinds";

export const EXTENSIONS_ROOT_CATEGORY_ID = "extensions-root";
export const EXTENSIONS_CATALOG_CATEGORY_ID = "extensions-catalog";
export const EXTENSIONS_DETAIL_PROVIDER_ID = "extensions-detail-provider";
export const EXTENSIONS_PACK_PROVIDER_ID = "extensions-pack-provider";

export const SILENT_TYPING_EXTENSION_ID = "silent-typing";
export const SILENT_TYPING_EXTENSION_DETAIL_CATEGORY_ID = "extensions-detail-silent-typing";
export const RANDOM_VOICE_EXTENSION_ID = "random-voice";
export const RANDOM_VOICE_EXTENSION_DETAIL_CATEGORY_ID = "extensions-detail-random-voice";
export const HOLY_NOTES_EXTENSION_ID = "holy-notes";
export const HOLY_NOTES_EXTENSION_DETAIL_CATEGORY_ID = "extensions-detail-holy-notes";
export const SILENT_MESSAGE_TOGGLE_EXTENSION_ID = "silent-message-toggle";
export const SILENT_MESSAGE_TOGGLE_EXTENSION_DETAIL_CATEGORY_ID = "extensions-detail-silent-message-toggle";
export const SCHEDULED_MESSAGES_EXTENSION_ID = "scheduled-messages";
export const SCHEDULED_MESSAGES_EXTENSION_DETAIL_CATEGORY_ID = "extensions-detail-scheduled-messages";
export const THEME_LIBRARY_EXTENSION_ID = "theme-library";
export const THEME_LIBRARY_EXTENSION_DETAIL_CATEGORY_ID = "extensions-detail-theme-library";

export const DEFAULT_EXTENSION_KEYBINDS: Record<string, ExtensionKeybindMap> = {
    [SILENT_TYPING_EXTENSION_ID]: {
        secondaryActionChord: "meta+enter",
        tertiaryActionChord: "alt+enter"
    },
    [RANDOM_VOICE_EXTENSION_ID]: {
        secondaryActionChord: "meta+enter",
        tertiaryActionChord: "alt+enter"
    },
    [SILENT_MESSAGE_TOGGLE_EXTENSION_ID]: {
        secondaryActionChord: "meta+enter",
        tertiaryActionChord: "alt+enter"
    }
};

export const EXTENSIONS_CATALOG: ExtensionDefinition[] = [
    {
        id: SILENT_TYPING_EXTENSION_ID,
        label: "SilentTyping",
        description: t("التحكم في إضافة SilentTyping من لوحة الأوامر.", "Control the SilentTyping plugin from the command palette."),
        detailCategoryId: SILENT_TYPING_EXTENSION_DETAIL_CATEGORY_ID,
        commandId: "extension-silent-typing-toggle",
        commandLabel: "Toggle SilentTyping",
        commandDescription: t("تشغيل أمر الإضافة من هذه الصفحة التفصيلية.", "Run the plugin command from this detail page."),
        sourcePath: "src/plugins/silentTyping",
        tags: [TAG_PLUGINS, TAG_UTILITY],
        keywords: ["extension", "plugin", "silent", "typing", "toggle", "keyboard"]
    },
    {
        id: RANDOM_VOICE_EXTENSION_ID,
        label: "RandomVoice",
        description: t("التحكم في إضافة RandomVoice من لوحة الأوامر.", "Control the RandomVoice plugin from the command palette."),
        detailCategoryId: RANDOM_VOICE_EXTENSION_DETAIL_CATEGORY_ID,
        commandId: "extension-random-voice-join",
        commandLabel: "Join Random Voice",
        commandDescription: t("تشغيل أمر الإضافة من هذه الصفحة التفصيلية.", "Run the plugin command from this detail page."),
        sourcePath: "src/equicordplugins/randomVoice",
        tags: [TAG_PLUGINS, TAG_UTILITY],
        keywords: ["extension", "plugin", "random", "voice", "join", "channel", "vc"]
    },
    {
        id: SILENT_MESSAGE_TOGGLE_EXTENSION_ID,
        label: "SilentMessageToggle",
        description: t("التحكم في إضافة SilentMessageToggle من لوحة الأوامر.", "Control the SilentMessageToggle plugin from the command palette."),
        detailCategoryId: SILENT_MESSAGE_TOGGLE_EXTENSION_DETAIL_CATEGORY_ID,
        commandId: "extension-silent-message-toggle-plugin",
        commandLabel: "Toggle SilentMessageToggle",
        commandDescription: t("تبديل حالة إضافة SilentMessageToggle.", "Toggle the state of the SilentMessageToggle plugin."),
        sourcePath: "src/plugins/silentMessageToggle",
        tags: [TAG_PLUGINS, TAG_UTILITY],
        keywords: ["extension", "plugin", "silent", "message", "toggle", "auto disable"]
    },
    {
        id: SCHEDULED_MESSAGES_EXTENSION_ID,
        label: "ScheduledMessages",
        description: t("التحكم في إضافة ScheduledMessages من لوحة الأوامر.", "Control the ScheduledMessages plugin from the command palette."),
        detailCategoryId: SCHEDULED_MESSAGES_EXTENSION_DETAIL_CATEGORY_ID,
        commandId: "extension-scheduled-messages-open",
        commandLabel: "Open Scheduled Messages",
        commandDescription: t("فتح نافذة الرسائل المجدولة.", "Open the scheduled messages window."),
        sourcePath: "src/equicordplugins/scheduledMessages",
        tags: [TAG_PLUGINS, TAG_UTILITY],
        keywords: ["extension", "plugin", "schedule", "message", "queue", "remind", "delay"]
    },
    {
        id: THEME_LIBRARY_EXTENSION_ID,
        label: "ThemeLibrary",
        description: t("التحكم في إضافة ThemeLibrary من لوحة الأوامر.", "Control the ThemeLibrary plugin from the command palette."),
        detailCategoryId: THEME_LIBRARY_EXTENSION_DETAIL_CATEGORY_ID,
        commandId: "extension-theme-library-open",
        commandLabel: "Open Theme Library",
        commandDescription: t("فتح صفحة إعدادات مكتبة القوالب.", "Open the theme library settings page."),
        sourcePath: "src/equicordplugins/themeLibrary",
        tags: [TAG_PLUGINS, TAG_UTILITY],
        keywords: ["extension", "plugin", "theme", "library", "themes", "settings"]
    }
];

export const extensionDefinitionsById = new Map(EXTENSIONS_CATALOG.map(extension => [extension.id, extension]));

export const EQUICORD_REPOSITORY_BLOB_BASE_URL = "https://github.com/Equicord/Equicord/blob/main";

export function normalizeRepositoryPath(path: string): string {
    return path.trim().replace(/^\/+/, "");
}

export function toRepositoryBlobUrl(path: string): string {
    const normalizedPath = normalizeRepositoryPath(path);
    return `${EQUICORD_REPOSITORY_BLOB_BASE_URL}/${normalizedPath}`;
}
