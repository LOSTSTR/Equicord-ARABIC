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

// Reverse map: trimmed English string → Arabic string
// Shared across Layer 2 (intl.string patch) and Layer 3 (MutationObserver)
const enToAr = new Map<string, string>();

const STYLE_ID = "equicord-ale-styles";
let styleEl: HTMLStyleElement | null = null;
let domObserver: MutationObserver | null = null;
const restoreList: Array<() => void> = [];

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

// ── CSS (font only, zero layout/direction rules) ───────────────────────────

function buildCSS() {
    if (!settings.store.enableFont) return "";
    return `@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap');
[class*="message_"],[class*="messageContent_"],[class*="markup_"],[class*="contents_"],
[class*="panel_"],[class*="text_"],[class*="title_"],[class*="label_"],
[class*="formText_"],[class*="description_"],[class*="note_"],[class*="headerText_"],
[class*="defaultColor_"],[class*="friendsTable_"],[class*="listItem_"],[class*="item_"],
[class*="hint_"],[class*="colorHeaderPrimary_"],[class*="colorHeaderSecondary_"],
[class*="eyebrow_"],[class*="contextMenuItem_"],[class*="labelContainer_"],
[class*="userSettingsInner_"],[class*="settingsLabel_"],
[class*="sidebarRegionScroller_"],[class*="tabBarItem_"],[class*="tooltip_"] {
    font-family: 'Tajawal','Segoe UI',system-ui,sans-serif !important;
}`;
}

function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    styleEl = document.createElement("style");
    styleEl.id = STYLE_ID;
    styleEl.textContent = buildCSS();
    document.head.appendChild(styleEl);
}
function removeStyles() {
    styleEl?.remove();
    styleEl = null;
    document.getElementById(STYLE_ID)?.remove();
}
function refreshStyles() {
    if (styleEl) styleEl.textContent = buildCSS();
}

// ── ICU template fill ──────────────────────────────────────────────────────

function fill(template: string, args?: Record<string, unknown>) {
    if (!args) return template;
    return template.replace(/\{(\w+)\}/g, (_, k) =>
        args[k] !== undefined ? String(args[k]) : `{${k}}`
    );
}

// ── Layer 1: Messages proxy (legacy i18n.Messages.KEY access) ──────────────

type MessagesObj = Record<string, unknown>;

function makeProxy(original: MessagesObj): MessagesObj {
    return new Proxy(original, {
        get(target, prop) {
            if (typeof prop !== "string") return (target as any)[prop];
            if (!settings.store.enableTranslations) return (target as any)[prop];
            const arStr = ar[prop];
            if (!arStr) return (target as any)[prop];
            const orig = (target as any)[prop];
            return typeof orig === "function"
                ? (args?: Record<string, unknown>) => fill(arStr, args)
                : arStr;
        },
    });
}

function patchMessages(mod: Record<string, unknown>) {
    const origMessages = (mod.Messages ?? {}) as MessagesObj;
    // Populate reverse map from the original English values
    for (const [key, arabic] of Object.entries(ar)) {
        const eng = (origMessages as any)[key];
        if (typeof eng === "string" && eng.trim()) enToAr.set(eng.trim(), arabic);
    }
    const savedDesc = Object.getOwnPropertyDescriptor(mod, "Messages") ?? null;
    const proxy = makeProxy(origMessages);
    Object.defineProperty(mod, "Messages", { get: () => proxy, configurable: true, enumerable: true });
    restoreList.push(() => {
        if (savedDesc) Object.defineProperty(mod, "Messages", savedDesc);
        else delete (mod as any).Messages;
    });
}

// ── Layer 2: intl.string() patch (@discord/intl compiled-message access) ───
// Context menus, settings panels, and tooltips call intl.string(descriptor)
// instead of reading i18n.Messages.KEY — this intercepts the output.

function patchIntlString(intlMod: Record<string, unknown>) {
    const orig = (intlMod as any).string;
    if (typeof orig !== "function") return;
    (intlMod as any).string = function(this: unknown, msg: unknown, ...rest: unknown[]) {
        const result: string = orig.call(this, msg, ...rest);
        if (!settings.store.enableTranslations || typeof result !== "string") return result;
        return enToAr.get(result.trim()) ?? result;
    };
    restoreList.push(() => { (intlMod as any).string = orig; });
}

// ── Layer 3: MutationObserver DOM fallback ─────────────────────────────────
// Catches any already-rendered text and anything that slips past Layers 1/2.

const USER_CONTENT = [
    "messageContent_", "markup_", "chatContent_",
    "userContent_", "blockquote_", "embedDescription_",
];

function isUserContent(el: Element): boolean {
    const cls = el.className ?? "";
    return USER_CONTENT.some(c => cls.includes(c)) || el.tagName === "CODE" || el.tagName === "PRE";
}

function translateNode(node: Text) {
    if (!settings.store.enableTranslations) return;
    const raw = node.textContent;
    if (!raw?.trim()) return;
    const arabic = enToAr.get(raw.trim());
    if (arabic && arabic !== raw.trim()) node.textContent = arabic;
}

function walk(root: Node) {
    if (root.nodeType === Node.ELEMENT_NODE && isUserContent(root as Element)) return;
    if (root.nodeType === Node.TEXT_NODE) { translateNode(root as Text); return; }
    for (const child of root.childNodes) walk(child);
}

function startObserver() {
    domObserver = new MutationObserver(mutations => {
        if (!settings.store.enableTranslations) return;
        for (const m of mutations)
            for (const node of m.addedNodes) walk(node);
    });
    domObserver.observe(document.body, { childList: true, subtree: true });
    // Translate already-rendered UI after a short settle delay
    setTimeout(() => walk(document.body), 400);
}

function stopObserver() { domObserver?.disconnect(); domObserver = null; }

// ── Plugin ─────────────────────────────────────────────────────────────────

export default definePlugin({
    name: "ArabicLocalizationEngine",
    description: "تعريب واجهة Discord — خط عربي وترجمة رسائل واجهة المستخدم",
    authors: [EquicordDevs.LOSTSTR],
    settings,

    start() {
        injectStyles();

        // Layer 1: patch every i18n module instance we can find
        const seen = new Set<object>();
        for (const mod of [
            findByProps("Messages", "getLocale", "setLocale"),
            findByProps("Messages", "getLocale"),
            findByProps("Messages", "defaultLocale"),
            findByProps("Messages", "getLanguages"),
        ]) {
            if (!mod || seen.has(mod) || !mod.Messages) continue;
            seen.add(mod);
            patchMessages(mod as Record<string, unknown>);
        }
        if (!seen.size) console.warn("[ALE] i18n module not found");

        // Layer 2: patch @discord/intl string resolver
        const intlMod =
            findByProps("string", "format", "formatToPlainString") ??
            findByProps("string", "formatToPlainString");
        if (intlMod) patchIntlString(intlMod as Record<string, unknown>);

        // Layer 3: DOM fallback observer
        startObserver();
    },

    stop() {
        removeStyles();
        stopObserver();
        for (const restore of restoreList) restore();
        restoreList.length = 0;
        enToAr.clear();
    },
});
