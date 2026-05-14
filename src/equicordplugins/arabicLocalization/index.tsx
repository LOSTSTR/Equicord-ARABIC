/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 LOSTSTR and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { EquicordDevs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { findByProps } from "@webpack";
import { FluxDispatcher, LocaleStore, i18n } from "@webpack/common";

import rawTranslations from "./translations.json";

const ar: Record<string, string> = rawTranslations as Record<string, string>;

const STYLE_ID = "equicord-ale-styles";
let styleEl: HTMLStyleElement | null = null;
let htmlDirObserver: MutationObserver | null = null;

// Tracks which legacy Messages modules are already overlaid (idempotency)
const patchedMods = new Set<object>();

// Teardown steps executed in push order during stop()
const teardown: Array<() => void> = [];

const settings = definePluginSettings({
    enableFont: {
        type: OptionType.BOOLEAN,
        description: "استخدام خط Tajawal العربي",
        default: true,
        onChange: () => refreshStyles(),
    },
});

// ── CSS ────────────────────────────────────────────────────────────────────
// Nuclear LTR block on the three root nodes Discord uses for layout,
// plus optional Arabic font on all text-bearing class patterns.

function buildCSS() {
    const ltrNuke = `
html, body, #app-mount,
[class*="appAsidePanelWrapper_"],
[class*="base_"],
[class*="container_"] {
    direction: ltr !important;
    unicode-bidi: isolate !important;
}`;
    if (!settings.store.enableFont) return ltrNuke;
    return `@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap');
${ltrNuke}
[class*="message_"],[class*="messageContent_"],[class*="markup_"],[class*="contents_"],
[class*="panel_"],[class*="text_"],[class*="title_"],[class*="label_"],[class*="formText_"],
[class*="description_"],[class*="note_"],[class*="headerText_"],[class*="defaultColor_"],
[class*="friendsTable_"],[class*="listItem_"],[class*="item_"],[class*="hint_"],
[class*="colorHeaderPrimary_"],[class*="colorHeaderSecondary_"],[class*="eyebrow_"],
[class*="contextMenuItem_"],[class*="labelContainer_"],[class*="userSettingsInner_"],
[class*="settingsLabel_"],[class*="sidebarRegionScroller_"],[class*="tabBarItem_"],
[class*="tooltip_"],[class*="headerTag_"],[class*="colorStandard_"] {
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
function removeStyles() { styleEl?.remove(); styleEl = null; document.getElementById(STYLE_ID)?.remove(); }
function refreshStyles() { if (styleEl) styleEl.textContent = buildCSS(); }

// ── DOM Guard ──────────────────────────────────────────────────────────────
// Watches only the single <html> element's dir attribute.
// If Discord writes dir="rtl" (after or despite our patches), revert instantly.
// Extremely lightweight — one element, one attribute, no subtree scan.

function startHtmlDirGuard() {
    document.documentElement.setAttribute("dir", "ltr");
    htmlDirObserver = new MutationObserver(mutations => {
        for (const m of mutations) {
            if (m.attributeName === "dir") {
                const el = m.target as HTMLElement;
                if (el.getAttribute("dir") !== "ltr") el.setAttribute("dir", "ltr");
            }
        }
    });
    htmlDirObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["dir"],
    });
}
function stopHtmlDirGuard() { htmlDirObserver?.disconnect(); htmlDirObserver = null; }

// ── getLocaleInfo spoof ────────────────────────────────────────────────────
// Discord reads this before writing dir="rtl" / applying RTL CSS classes.
// Returning direction:"ltr" + isRTL:false kills the RTL path at the source.

function spoofLocaleInfo() {
    const mod: any =
        findByProps("getLocaleInfo", "getAvailableLocales") ??
        findByProps("getLocaleInfo", "getSystemLocale") ??
        findByProps("getLocaleInfo");
    if (!mod?.getLocaleInfo) return;
    const orig = mod.getLocaleInfo;
    mod.getLocaleInfo = function(locale?: string, ...rest: unknown[]) {
        const info = orig.call(this, locale, ...rest);
        return info ? { ...info, direction: "ltr", isRTL: false } : info;
    };
    teardown.push(() => { mod.getLocaleInfo = orig; });
}

// ── LocaleStore patch ──────────────────────────────────────────────────────
// Forces LocaleStore.locale (and getLocale() if present) to report "ar"
// so every Flux subscriber that checks the current locale sees Arabic.
// This is what makes settings panels and context menus pick up the strings
// loaded by intl.setLocale() without a full USER_SETTINGS_UPDATE round-trip.

function patchLocaleStore() {
    const store: any = LocaleStore;
    if (!store) return;

    // The `locale` getter lives on the prototype in Discord's Flux stores
    const proto = Object.getPrototypeOf(store);
    const localeDesc =
        Object.getOwnPropertyDescriptor(proto, "locale") ??
        Object.getOwnPropertyDescriptor(store, "locale");

    if (localeDesc) {
        const host = localeDesc.get
            ? proto       // getter defined on prototype
            : store;      // own property on instance
        Object.defineProperty(host, "locale", {
            get: () => "ar",
            configurable: true,
            enumerable: localeDesc.enumerable ?? true,
        });
        teardown.push(() => Object.defineProperty(host, "locale", localeDesc));
    }

    // Some builds expose getLocale() as a standalone method
    if (typeof store.getLocale === "function") {
        const orig = store.getLocale.bind(store);
        store.getLocale = () => "ar";
        teardown.push(() => { store.getLocale = orig; });
    }
}

// ── Custom dictionary overlay ──────────────────────────────────────────────
// Overlays our 1073-key dict ON TOP of whatever Arabic strings Discord loaded.
// The `set` trap on the property descriptor keeps the fallback target current
// when Discord writes a freshly loaded bundle to mod.Messages.

type MessagesObj = Record<string, unknown>;

function overlayMessages(mod: Record<string, unknown>) {
    if (patchedMods.has(mod)) return; // idempotent
    patchedMods.add(mod);

    const savedDesc = Object.getOwnPropertyDescriptor(mod, "Messages") ?? null;
    let target: MessagesObj = (mod.Messages ?? {}) as MessagesObj;

    const proxy = new Proxy(target, {
        get(_, prop) {
            if (typeof prop !== "string") return (target as any)[prop];
            const arStr = ar[prop];
            if (!arStr) return (target as any)[prop]; // fall through to Discord's Arabic
            const orig = (target as any)[prop];
            if (typeof orig === "function") {
                return (args?: Record<string, unknown>) =>
                    args
                        ? arStr.replace(/\{(\w+)\}/g, (_, k) =>
                            args[k] !== undefined ? String(args[k]) : `{${k}}`)
                        : arStr;
            }
            return arStr;
        },
    });

    Object.defineProperty(mod, "Messages", {
        get: () => proxy,
        set: (bundle: MessagesObj) => { target = bundle; }, // keep target live
        configurable: true,
        enumerable: true,
    });

    teardown.push(() => {
        patchedMods.delete(mod);
        if (savedDesc) Object.defineProperty(mod, "Messages", savedDesc);
        else delete (mod as any).Messages;
    });
}

function applyMessagesOverlay() {
    const seen = new Set<object>();
    for (const mod of [
        findByProps("Messages", "getLocale", "setLocale"),
        findByProps("Messages", "getLocale"),
        findByProps("Messages", "defaultLocale"),
    ]) {
        if (!mod || seen.has(mod) || !mod.Messages) continue;
        seen.add(mod);
        overlayMessages(mod as Record<string, unknown>);
    }
}

// ── Plugin ─────────────────────────────────────────────────────────────────

export default definePlugin({
    name: "ArabicLocalizationEngine",
    description: "تعريب واجهة Discord — تحميل اللغة العربية الرسمية مع الحفاظ على تخطيط LTR",
    authors: [EquicordDevs.LOSTSTR],
    settings,

    start() {
        // Inject CSS + DOM guard first so layout is locked before any
        // re-renders triggered by the locale switch can write dir=rtl.
        injectStyles();
        startHtmlDirGuard();

        // Kill RTL at the metadata level before the locale loads
        spoofLocaleInfo();

        // Make LocaleStore report "ar" so Flux subscribers re-render
        patchLocaleStore();

        const intl: any = (i18n as any).intl;
        if (!intl?.setLocale) {
            console.warn("[ALE] @discord/intl IntlManager not found — CSS+store-only mode");
            return;
        }

        const originalLocale: string = intl.getLocale?.() ?? "en-US";

        // Merge our custom dict on every I18N_LOAD_SUCCESS
        // (covers initial Arabic load and any subsequent forced reloads)
        const onLoad = () => applyMessagesOverlay();
        FluxDispatcher.subscribe("I18N_LOAD_SUCCESS", onLoad);
        teardown.push(() => FluxDispatcher.unsubscribe("I18N_LOAD_SUCCESS", onLoad));

        // Load Arabic strings via @discord/intl, then dispatch I18N_LOAD_SUCCESS
        // to wake up all Flux-subscribed React components without touching the
        // user's persisted locale setting (no USER_SETTINGS_UPDATE → no API call).
        const dispatchArabic = () =>
            FluxDispatcher.dispatch({ type: "I18N_LOAD_SUCCESS", locale: "ar" } as any);

        const result = intl.setLocale("ar");
        if (result instanceof Promise)
            result.then(dispatchArabic).catch(e => console.error("[ALE] setLocale failed:", e));
        else
            dispatchArabic();

        // Teardown: unsubscribe first (already pushed), then revert locale
        teardown.push(() => {
            const revert = intl.setLocale(originalLocale);
            const dispatchRevert = () =>
                FluxDispatcher.dispatch({ type: "I18N_LOAD_SUCCESS", locale: originalLocale } as any);
            if (revert instanceof Promise) revert.then(dispatchRevert).catch(() => {});
            else dispatchRevert();
        });
    },

    stop() {
        stopHtmlDirGuard();
        removeStyles();
        // Teardown order (push order = execution order):
        // 1. getLocaleInfo restored
        // 2. LocaleStore.locale restored
        // 3. LocaleStore.getLocale restored
        // 4. Unsubscribe I18N_LOAD_SUCCESS (no overlay on English reload)
        // 5. Revert locale + dispatch English I18N_LOAD_SUCCESS
        for (const fn of teardown) fn();
        teardown.length = 0;
        patchedMods.clear();
    },
});
