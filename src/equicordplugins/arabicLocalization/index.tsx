/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 LOSTSTR and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { EquicordDevs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { findByProps } from "@webpack";

import rawTranslations from "./translations.json";

const ar: Record<string, string> = rawTranslations as Record<string, string>;

const STYLE_ID = "equicord-ale-styles";
let styleEl: HTMLStyleElement | null = null;

// Descriptor saved on start so we can restore it in stop()
let originalDescriptor: PropertyDescriptor | null = null;
let patchedModule: Record<string, unknown> | null = null;

const settings = definePluginSettings({
    enableRTL: {
        type: OptionType.BOOLEAN,
        description: "تفعيل اتجاه النص من اليمين إلى اليسار (RTL)",
        default: true,
        onChange: () => refreshStyles(),
    },
    enableFont: {
        type: OptionType.BOOLEAN,
        description: "استخدام خط Tajawal العربي",
        default: true,
        onChange: () => refreshStyles(),
    },
    enableTranslations: {
        type: OptionType.BOOLEAN,
        description: "ترجمة واجهة Discord إلى العربية",
        default: true,
    },
});

function buildCSS(): string {
    const parts: string[] = [];

    if (settings.store.enableFont) {
        parts.push(
            "@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap');"
        );
        parts.push(`
[class*="message_"], [class*="messageContent_"], [class*="markup_"],
[class*="contents_"], [class*="scroller_"], [class*="panel_"],
[class*="text_"], [class*="title_"], [class*="label_"],
[class*="formText_"], [class*="description_"], [class*="note_"],
[class*="headerText_"], [class*="defaultColor_"],
[class*="friendsTable_"], [class*="listItem_"] {
    font-family: 'Tajawal', 'Segoe UI', system-ui, sans-serif !important;
}`);
    }

    if (settings.store.enableRTL) {
        parts.push(`
/* ── Step 1: RTL for text-bearing content areas only ── */
[class*="scroller_"],
[class*="panel_"],
[class*="text_"],
[class*="contents_"],
[class*="messageContent_"],
[class*="markup_"],
[class*="message_"],
[class*="friendsTable_"],
[class*="formText_"],
[class*="description_"],
[class*="note_"],
[class*="headerText_"],
[class*="defaultColor_"] {
    direction: rtl !important;
    text-align: right;
}

/* ── Step 2: Anchor the shell layout in LTR (declared after RTL to win tie) ── */
html, body, #app-mount,
[class*="appAsidePanelWrapper_"],
[class*="base_"],
[class*="container_"],
[class*="sidebar_"],
[class*="layers_"],
[class*="guilds_"],
[class*="guildsList_"],
[class*="nav_"],
[class*="panels_"],
[class*="toolbar_"],
[class*="wrapper_"],
[class*="channel_"],
[class*="channels_"],
[class*="categoryContainer_"],
[class*="category_"],
[class*="voiceUsers_"],
[class*="userLimit_"],
[class*="voiceUser_"],
[class*="privateChannels_"],
[class*="privateChannel_"],
[class*="dmContent_"],
[class*="header_"],
[class*="members_"],
[class*="membersWrap_"],
[class*="memberInner_"],
[class*="member_"],
[class*="chat_"],
[class*="chatContent_"],
[class*="scrollerInner_"],
[class*="jumpToPresentBar_"],
[class*="newMessagesBar_"],
[class*="form_"],
[class*="channelTextArea_"],
[class*="inner_"],
[class*="uploadInput_"],
[class*="avatar_"],
[class*="avatarWrapper_"],
[class*="status_"],
[class*="icon_"],
[class*="iconWrapper_"],
[class*="badge_"],
[class*="presence_"],
[class*="timestamp_"],
[class*="codeBlock_"],
code, pre {
    direction: ltr !important;
}

[class*="codeBlock_"], code, pre {
    text-align: left !important;
}`);
    }

    return parts.join("\n");
}

function injectStyles(): void {
    if (document.getElementById(STYLE_ID)) return;
    styleEl = document.createElement("style");
    styleEl.id = STYLE_ID;
    styleEl.textContent = buildCSS();
    document.head.appendChild(styleEl);
}

function removeStyles(): void {
    styleEl?.remove();
    styleEl = null;
    document.getElementById(STYLE_ID)?.remove();
}

function refreshStyles(): void {
    if (styleEl) {
        styleEl.textContent = buildCSS();
    }
}

function fill(template: string, args?: Record<string, unknown>): string {
    if (!args) return template;
    return template.replace(/\{(\w+)\}/g, (m, k) =>
        args[k] !== undefined ? String(args[k]) : m
    );
}

type MessagesObj = Record<string, unknown>;

function makeProxy(original: MessagesObj): MessagesObj {
    return new Proxy(original, {
        get(target, prop) {
            if (typeof prop !== "string") return (target as any)[prop];
            if (!settings.store.enableTranslations) return (target as any)[prop];

            const arString = ar[prop];
            if (arString === undefined) return (target as any)[prop];

            const orig = (target as any)[prop];
            // If Discord's value is a function (ICU formatter), wrap it
            if (typeof orig === "function") {
                return (args?: Record<string, unknown>) => fill(arString, args);
            }
            return arString;
        },
    });
}

export default definePlugin({
    name: "ArabicLocalizationEngine",
    description: "تعريب واجهة Discord — RTL، خط عربي، وترجمة رسائل واجهة المستخدم",
    authors: [EquicordDevs.LOSTSTR],
    settings,

    start() {
        injectStyles();

        // Find Discord's i18n module — try multiple fingerprints for resilience
        const mod =
            findByProps("Messages", "getLocale", "setLocale") ??
            findByProps("Messages", "getLocale");

        if (!mod?.Messages) {
            console.warn("[ALE] i18n module not found — CSS-only mode active");
            return;
        }

        // Save original descriptor so stop() can fully restore it
        originalDescriptor =
            Object.getOwnPropertyDescriptor(mod, "Messages") ?? null;
        patchedModule = mod as Record<string, unknown>;

        const proxy = makeProxy(mod.Messages as MessagesObj);

        Object.defineProperty(mod, "Messages", {
            get: () => proxy,
            configurable: true,
            enumerable: true,
        });
    },

    stop() {
        removeStyles();

        if (patchedModule && originalDescriptor) {
            Object.defineProperty(patchedModule, "Messages", originalDescriptor);
        } else if (patchedModule) {
            delete (patchedModule as any).Messages;
        }

        patchedModule = null;
        originalDescriptor = null;
    },
});
