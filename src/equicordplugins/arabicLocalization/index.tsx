/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 LOSTSTR and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║          Arabic Localization Engine — Architecture Reference         ║
 * ╠══════════════════════════════════════════════════════════════════════╣
 * ║                                                                      ║
 * ║  DISCORD STRING PIPELINE (modern @discord/intl, 2024+)              ║
 * ║  ─────────────────────────────────────────────────────              ║
 * ║  Build time:                                                         ║
 * ║    String keys hashed: "ADD_REACTION" → "Ab3xQ1" (xxhash64+base64) ║
 * ║    Compiled into AST MessageDescriptor nodes per locale              ║
 * ║                                                                      ║
 * ║  Runtime:                                                            ║
 * ║    i18n.t.ADD_REACTION      → MessageDescriptor (AST node)          ║
 * ║    i18n.intl.string(desc)   → rendered string                       ║
 * ║    i18n.intl.format(desc)   → React node (rich text)                ║
 * ║                                                                      ║
 * ║  Locale switch sequence:                                             ║
 * ║    intl.setLocale("ar")                                              ║
 * ║      → loads Arabic AST bundle into @discord/intl                   ║
 * ║    LocaleStore.locale must return "ar"                               ║
 * ║      → Flux subscribers see the locale change                        ║
 * ║    FluxDispatcher.dispatch({ type: "I18N_LOAD_SUCCESS" })            ║
 * ║      → all subscribed React components call intl.string() again     ║
 * ║                                                                      ║
 * ║  LEGACY STRING PIPELINE (backward compat, still active)             ║
 * ║  ──────────────────────────────────────────────────────             ║
 * ║    findByProps("Messages","getLocale") → mod.Messages[KEY] → string ║
 * ║    Our Proxy overlays custom 1073-key dict on top                    ║
 * ║                                                                      ║
 * ║  RTL LAYOUT TRIGGER CHAIN (what we neutralize)                      ║
 * ║  ─────────────────────────────────────────────                      ║
 * ║    LocaleStore.locale === "ar"                                       ║
 * ║      → getLocaleInfo("ar").direction === "rtl"                      ║
 * ║        → document.documentElement.dir = "rtl"                       ║
 * ║          → Discord applies RTL flexbox/position CSS                  ║
 * ║                                                                      ║
 * ║  OUR LTR ENFORCEMENT (4 independent layers)                         ║
 * ║  ──────────────────────────────────────────                         ║
 * ║    1. spoofLocaleInfo   getLocaleInfo → { direction:"ltr",isRTL:false }
 * ║    2. CSS nuclear rule  direction:ltr + unicode-bidi:isolate on roots║
 * ║    3. DOM guard         MutationObserver reverts html[dir=rtl] live  ║
 * ║    4. LocaleStore patch forces locale:"ar" for string re-evaluation  ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { definePluginSettings } from "@api/Settings";
import { EquicordDevs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { findByProps } from "@webpack";
import { FluxDispatcher, LocaleStore, i18n } from "@webpack/common";

import rawTranslations from "./translations.json";

// ── Module-level state ─────────────────────────────────────────────────────

const ar: Record<string, string> = rawTranslations as Record<string, string>;

const STYLE_ID = "equicord-ale-styles";
let styleEl: HTMLStyleElement | null = null;
let htmlDirObserver: MutationObserver | null = null;

// Whether translations (locale switch + patches) are currently active
let translationActive = false;

// Locale to restore when translations are deactivated
let originalLocale = "en-US";

// Modules already overlaid — prevents duplicate property definition + teardown entries
const patchedMods = new Set<object>();

// Teardown callbacks for the translation subsystem (not styles/DOM guard)
// Executed in push order so patches unwind before locale is reverted
const translationTeardown: Array<() => void> = [];

// ── Settings ───────────────────────────────────────────────────────────────

const settings = definePluginSettings({
    enableTranslations: {
        type: OptionType.BOOLEAN,
        description: "تفعيل الترجمة العربية الكاملة",
        default: true,
        onChange: (enabled: boolean) =>
            enabled ? activateTranslations() : deactivateTranslations(),
    },
    enableFont: {
        type: OptionType.BOOLEAN,
        description: "استخدام خط Tajawal العربي",
        default: true,
        onChange: () => refreshStyles(),
    },
});

// ══════════════════════════════════════════════════════════════════════════
//  CSS — font injection + nuclear LTR root lock
// ══════════════════════════════════════════════════════════════════════════

function buildCSS(): string {
    // Applied regardless of enableFont: prevents any layout flip
    const ltrLock = `
html, body, #app-mount,
[class*="appAsidePanelWrapper_"],
[class*="base_"],
[class*="container_"] {
    direction: ltr !important;
    unicode-bidi: isolate !important;
}`;

    if (!settings.store.enableFont) return ltrLock;

    return `@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap');
${ltrLock}
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

// ══════════════════════════════════════════════════════════════════════════
//  DOM Guard — single-element MutationObserver on <html> dir attribute
//  Scope: one element, one attribute, no subtree traversal → negligible cost
// ══════════════════════════════════════════════════════════════════════════

function startHtmlDirGuard(): void {
    document.documentElement.setAttribute("dir", "ltr");
    htmlDirObserver = new MutationObserver(mutations => {
        for (const m of mutations) {
            const el = m.target as HTMLElement;
            if (el.getAttribute("dir") !== "ltr") el.setAttribute("dir", "ltr");
        }
    });
    htmlDirObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["dir"],
    });
}

function stopHtmlDirGuard(): void {
    htmlDirObserver?.disconnect();
    htmlDirObserver = null;
}

// ══════════════════════════════════════════════════════════════════════════
//  getLocaleInfo spoof
//  Discord calls getLocaleInfo(locale) before writing dir="rtl" to <html>
//  and before applying RTL Flex/position CSS. Returning direction:"ltr" at
//  this point kills the entire RTL branch unconditionally.
// ══════════════════════════════════════════════════════════════════════════

function spoofLocaleInfo(): void {
    const mod: any =
        findByProps("getLocaleInfo", "getAvailableLocales") ??
        findByProps("getLocaleInfo", "getSupportedLocales") ??
        findByProps("getLocaleInfo", "getSystemLocale") ??
        findByProps("getLocaleInfo", "getDiscordLocale") ??
        findByProps("getLocaleInfo");

    if (!mod?.getLocaleInfo) return;

    const orig = mod.getLocaleInfo as (...a: unknown[]) => unknown;
    mod.getLocaleInfo = function(...args: unknown[]) {
        const info = orig.apply(this, args);
        return info && typeof info === "object"
            ? { ...(info as object), direction: "ltr", isRTL: false }
            : info;
    };
    translationTeardown.push(() => { mod.getLocaleInfo = orig; });
}

// ══════════════════════════════════════════════════════════════════════════
//  LocaleStore patch
//  React components read LocaleStore.locale (via Flux connect) to decide
//  which strings to display. Without patching this, the store still says
//  "en-US" and components skip the Arabic re-render path even after
//  intl.setLocale("ar") has loaded the Arabic bundle.
// ══════════════════════════════════════════════════════════════════════════

function patchLocaleStore(): void {
    const store: any = LocaleStore;
    if (!store) return;

    // Getter may live on the prototype (class-based Flux store pattern)
    const proto = Object.getPrototypeOf(store);
    const localeDesc =
        Object.getOwnPropertyDescriptor(proto, "locale") ??
        Object.getOwnPropertyDescriptor(store, "locale");

    if (localeDesc) {
        const host = localeDesc.get ? proto : store;
        Object.defineProperty(host, "locale", {
            get: () => "ar",
            configurable: true,
            enumerable: localeDesc.enumerable ?? true,
        });
        translationTeardown.push(() => Object.defineProperty(host, "locale", localeDesc));
    }

    // Older builds / some modules call getLocale() as a function
    if (typeof store.getLocale === "function") {
        const orig = store.getLocale.bind(store) as () => string;
        store.getLocale = (): string => "ar";
        translationTeardown.push(() => { store.getLocale = orig; });
    }
}

// ══════════════════════════════════════════════════════════════════════════
//  Legacy Messages proxy (custom dict overlay)
//  Equicord-specific strings and any gaps in Discord's Arabic bundle are
//  served from our 1073-key translations.json via a transparent Proxy.
//  The property descriptor includes a `set` trap so that when Discord
//  assigns a freshly loaded bundle (mod.Messages = arabicBundle), our
//  proxy's fallback target updates atomically without breaking the proxy.
// ══════════════════════════════════════════════════════════════════════════

type MessagesObj = Record<string, unknown>;

function overlayMessages(mod: Record<string, unknown>): void {
    if (patchedMods.has(mod)) return; // idempotent across I18N_LOAD_SUCCESS firings
    patchedMods.add(mod);

    const savedDesc = Object.getOwnPropertyDescriptor(mod, "Messages") ?? null;

    // `target` is updated by the `set` trap on every Discord bundle assignment
    let target: MessagesObj = (mod.Messages ?? {}) as MessagesObj;

    const proxy = new Proxy(target, {
        get(_, prop) {
            if (typeof prop !== "string") return (target as any)[prop];
            const arStr = ar[prop];
            // No override → fall through to Discord's official Arabic string
            if (!arStr) return (target as any)[prop];
            // Function value (ICU formatter) → wrap with our Arabic template
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
        set: (bundle: MessagesObj) => { target = bundle; }, // live-update fallback
        configurable: true,
        enumerable: true,
    });

    translationTeardown.push(() => {
        patchedMods.delete(mod);
        if (savedDesc) Object.defineProperty(mod, "Messages", savedDesc);
        else delete (mod as any).Messages;
    });
}

function applyMessagesOverlay(): void {
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

// ══════════════════════════════════════════════════════════════════════════
//  Translation activation / deactivation
//  These functions are called both from start()/stop() and from the
//  enableTranslations setting's onChange handler, making the toggle live.
// ══════════════════════════════════════════════════════════════════════════

function activateTranslations(): void {
    if (translationActive) return;

    const intl: any = (i18n as any).intl;
    if (!intl?.setLocale) {
        console.warn("[ALE] @discord/intl IntlManager not found — CSS+store-only mode");
        return;
    }

    translationActive = true;
    originalLocale = (intl.getLocale?.() as string | undefined) ?? "en-US";

    // Layer 1: kill RTL at the metadata level before strings load
    spoofLocaleInfo();

    // Layer 2: make LocaleStore report "ar" so React components re-render
    patchLocaleStore();

    // Merge our custom dict every time Discord's Arabic bundle loads
    const onLoad = () => applyMessagesOverlay();
    FluxDispatcher.subscribe("I18N_LOAD_SUCCESS", onLoad);
    translationTeardown.push(() =>
        FluxDispatcher.unsubscribe("I18N_LOAD_SUCCESS", onLoad)
    );

    // Load Discord's native Arabic bundle, then fire I18N_LOAD_SUCCESS to
    // wake all Flux-subscribed components. We do NOT dispatch
    // USER_SETTINGS_UPDATE so the user's account locale is never modified.
    const dispatchArabic = () =>
        void FluxDispatcher.dispatch({ type: "I18N_LOAD_SUCCESS", locale: "ar" } as any);

    const result: unknown = intl.setLocale("ar");
    if (result instanceof Promise)
        result.then(dispatchArabic).catch(e => console.error("[ALE] setLocale('ar'):", e));
    else
        dispatchArabic();

    // Schedule locale revert for deactivation (pushed last → runs last)
    translationTeardown.push(() => {
        const revert: unknown = intl.setLocale(originalLocale);
        const dispatchRevert = () =>
            void FluxDispatcher.dispatch({ type: "I18N_LOAD_SUCCESS", locale: originalLocale } as any);
        if (revert instanceof Promise)
            revert.then(dispatchRevert).catch(() => {});
        else
            dispatchRevert();
    });
}

function deactivateTranslations(): void {
    if (!translationActive) return;
    translationActive = false;

    // Execution order of translationTeardown array:
    //   1. getLocaleInfo restored       — direction checks return real values
    //   2. LocaleStore.locale restored  — store shows original locale
    //   3. LocaleStore.getLocale restored
    //   4. Unsubscribe I18N_LOAD_SUCCESS — no dict overlay on English reload
    //   5. Messages descriptor restored  — proxy removed before English writes
    //   6. intl.setLocale(original)      — English bundle loaded into clean mod
    //      + dispatch I18N_LOAD_SUCCESS(original) — components re-render English
    for (const fn of translationTeardown) fn();
    translationTeardown.length = 0;
    patchedMods.clear();
}

// ══════════════════════════════════════════════════════════════════════════
//  Plugin entry point
// ══════════════════════════════════════════════════════════════════════════

export default definePlugin({
    name: "ArabicLocalizationEngine",
    description: "تعريب واجهة Discord — تحميل اللغة العربية الرسمية مع الحفاظ على تخطيط LTR",
    authors: [EquicordDevs.LOSTSTR],
    settings,

    start() {
        // CSS and DOM guard go up first — they must be active before any
        // locale-triggered re-renders can attempt to write dir="rtl".
        injectStyles();
        startHtmlDirGuard();

        if (settings.store.enableTranslations) activateTranslations();
    },

    stop() {
        // Order: kill the DOM guard, remove styles, then cleanly unwind
        // all translation patches (including locale revert).
        stopHtmlDirGuard();
        removeStyles();
        deactivateTranslations();
    },
});
