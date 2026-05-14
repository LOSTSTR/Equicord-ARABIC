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

interface PatchEntry {
    mod: Record<string, unknown>;
    descriptor: PropertyDescriptor | null;
}
let patchedMods: PatchEntry[] = [];

const settings = definePluginSettings({
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
    if (!settings.store.enableFont) return "";
    return `@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap');

[class*="message_"],[class*="messageContent_"],[class*="markup_"],
[class*="contents_"],[class*="panel_"],[class*="text_"],
[class*="title_"],[class*="label_"],[class*="formText_"],
[class*="description_"],[class*="note_"],[class*="headerText_"],
[class*="defaultColor_"],[class*="friendsTable_"],[class*="listItem_"],
[class*="item_"],[class*="hint_"],[class*="colorHeaderPrimary_"],
[class*="colorHeaderSecondary_"],[class*="eyebrow_"],
[class*="contextMenuItem_"],[class*="labelContainer_"],
[class*="userSettingsInner_"],[class*="settingsLabel_"],
[class*="sidebarRegionScroller_"],[class*="tabBarItem_"] {
    font-family: 'Tajawal', 'Segoe UI', system-ui, sans-serif !important;
}`;
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
    if (styleEl) styleEl.textContent = buildCSS();
}

function fill(template: string, args?: Record<string, unknown>): string {
    if (!args) return template;
    return template.replace(/\{(\w+)\}/g, (_, k) =>
        args[k] !== undefined ? String(args[k]) : `{${k}}`
    );
}

type MessagesObj = Record<string, unknown>;

function makeProxy(original: MessagesObj): MessagesObj {
    return new Proxy(original, {
        get(target, prop) {
            if (typeof prop !== "string") return (target as any)[prop];
            if (!settings.store.enableTranslations) return (target as any)[prop];
            const arStr = ar[prop];
            if (arStr === undefined) return (target as any)[prop];
            const orig = (target as any)[prop];
            if (typeof orig === "function") {
                return (args?: Record<string, unknown>) => fill(arStr, args);
            }
            return arStr;
        },
    });
}

function patchModule(mod: Record<string, unknown>): void {
    const descriptor = Object.getOwnPropertyDescriptor(mod, "Messages") ?? null;
    const proxy = makeProxy((mod.Messages ?? {}) as MessagesObj);
    Object.defineProperty(mod, "Messages", {
        get: () => proxy,
        configurable: true,
        enumerable: true,
    });
    patchedMods.push({ mod, descriptor });
}

export default definePlugin({
    name: "ArabicLocalizationEngine",
    description: "تعريب واجهة Discord — خط عربي وترجمة رسائل واجهة المستخدم",
    authors: [EquicordDevs.LOSTSTR],
    settings,

    start() {
        injectStyles();

        // Discord may chunk the i18n module differently across builds.
        // Try every known fingerprint and patch all unique instances found.
        const candidates = [
            findByProps("Messages", "getLocale", "setLocale"),
            findByProps("Messages", "getLocale"),
            findByProps("Messages", "defaultLocale"),
            findByProps("Messages", "getLanguages"),
        ];

        const seen = new Set<object>();
        for (const mod of candidates) {
            if (!mod || seen.has(mod) || !mod.Messages) continue;
            seen.add(mod);
            patchModule(mod as Record<string, unknown>);
        }

        if (seen.size === 0) {
            console.warn("[ALE] No i18n module found — font-only mode active");
            return;
        }

        // Force already-mounted components (settings panels, context menus,
        // tooltips) to re-evaluate string bindings without a full reload.
        try {
            const i18nMod = [...seen][0] as any;
            const locale = i18nMod?.getLocale?.() ?? "en-US";
            const dispatcher = findByProps("dispatch", "subscribe");
            dispatcher?.dispatch?.({ type: "I18N_LOAD_SUCCESS", locale });
        } catch { /* non-critical */ }
    },

    stop() {
        removeStyles();
        for (const { mod, descriptor } of patchedMods) {
            if (descriptor) {
                Object.defineProperty(mod, "Messages", descriptor);
            } else {
                delete (mod as any).Messages;
            }
        }
        patchedMods = [];
    },
});
