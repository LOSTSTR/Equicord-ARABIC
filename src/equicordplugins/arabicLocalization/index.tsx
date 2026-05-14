/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 LOSTSTR and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { EquicordDevs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { findByProps } from "@webpack";
import { FluxDispatcher, i18n } from "@webpack/common";

import rawTranslations from "./translations.json";

const ar: Record<string, string> = rawTranslations as Record<string, string>;

const STYLE_ID = "equicord-ale-styles";
let styleEl: HTMLStyleElement | null = null;

// Modules that have already been overlaid — prevents duplicate teardown entries
// if I18N_LOAD_SUCCESS fires more than once during the plugin's lifetime.
const patchedMods = new Set<object>();

// Ordered teardown steps executed in start() order during stop()
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
// Font rules + a targeted safety net: if Discord does write dir="rtl" on
// the html element despite us bypassing Flux, this overrides it silently.

function buildCSS() {
    const rtlGuard = `
html[dir="rtl"], html[dir="rtl"] body, html[dir="rtl"] #app-mount {
    direction: ltr !important;
}`;
    if (!settings.store.enableFont) return rtlGuard;
    return `@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap');
${rtlGuard}
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

// ── getLocaleInfo spoof ────────────────────────────────────────────────────
// Discord queries this to get a locale's writing direction before applying
// RTL body classes / CSS. Always returning "ltr" prevents any layout flip.

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

// ── Custom dictionary overlay ──────────────────────────────────────────────
// Called on I18N_LOAD_SUCCESS so our 1073 keys overlay Discord's freshly
// loaded Arabic strings (which become the transparent fallback for every
// key we don't explicitly override).

type MessagesObj = Record<string, unknown>;

function overlayMessages(mod: Record<string, unknown>) {
    if (patchedMods.has(mod)) {
        // Already patched on a previous I18N_LOAD_SUCCESS. The `set` trap
        // on the property descriptor will have kept the target up-to-date.
        return;
    }
    patchedMods.add(mod);

    const savedDesc = Object.getOwnPropertyDescriptor(mod, "Messages") ?? null;

    // Mutable target reference: when Discord assigns `mod.Messages = arabicBundle`
    // our setter captures it so the proxy's fallback stays current.
    let target: MessagesObj = (mod.Messages ?? {}) as MessagesObj;

    const proxy = new Proxy(target, {
        get(_, prop) {
            if (typeof prop !== "string") return (target as any)[prop];
            const arStr = ar[prop];
            if (!arStr) return (target as any)[prop];
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
        // When Discord writes the freshly loaded Arabic bundle, capture it
        // as the new fallback target instead of letting the assignment fail.
        set: (newMessages: MessagesObj) => { target = newMessages; },
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
    const candidates = [
        findByProps("Messages", "getLocale", "setLocale"),
        findByProps("Messages", "getLocale"),
        findByProps("Messages", "defaultLocale"),
    ];
    const seen = new Set<object>();
    for (const mod of candidates) {
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
        injectStyles();

        const intl: any = (i18n as any).intl;
        if (!intl?.setLocale) {
            console.warn("[ALE] @discord/intl IntlManager not found — CSS-only mode");
            return;
        }

        // 1. Save current locale so stop() can restore it cleanly
        const originalLocale: string = intl.getLocale?.() ?? "en-US";

        // 2. Spoof direction metadata so Discord never applies RTL layout rules
        spoofLocaleInfo();

        // 3. Subscribe BEFORE setLocale so we never miss the load event.
        //    Re-applying the overlay on every load is safe: overlayMessages()
        //    is idempotent for already-patched modules.
        const onLoad = () => applyMessagesOverlay();
        FluxDispatcher.subscribe("I18N_LOAD_SUCCESS", onLoad);
        teardown.push(() => FluxDispatcher.unsubscribe("I18N_LOAD_SUCCESS", onLoad));

        // 4. Switch to Discord's native Arabic locale via @discord/intl directly.
        //    Because we bypass the Flux USER_SETTINGS_UPDATE path, LocaleStore
        //    stays "en-US" — Discord's own RTL-layout trigger never fires.
        const result: unknown = intl.setLocale("ar");
        if (result instanceof Promise)
            result.catch(e => console.error("[ALE] setLocale('ar') failed:", e));

        teardown.push(() => {
            const revert: unknown = intl.setLocale(originalLocale);
            if (revert instanceof Promise)
                revert.catch(e => console.error("[ALE] locale restore failed:", e));
        });
    },

    stop() {
        removeStyles();
        // Unsubscribe first so the English reload on locale revert
        // does not re-trigger our overlay.
        for (const fn of teardown) fn();
        teardown.length = 0;
        patchedMods.clear();
    },
});
