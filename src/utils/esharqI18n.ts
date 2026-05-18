/*
 * Esharq — Arabic/English locale utility
 * Reads Settings.plugins.Settings.arabicMode at call time so it works
 * both in eager module init (getters) and in React renders.
 */

import { Settings } from "@api/Settings";

export function isArabicMode(): boolean {
    return (Settings.plugins as any)?.Settings?.arabicMode ?? false;
}

/**
 * Returns `ar` when Arabic mode is on, `en` otherwise.
 * Use as a getter in definePlugin / definePluginSettings so the value
 * is evaluated lazily at render time rather than at module load time.
 *
 * @example
 *   get description() { return t("وصف عربي", "English description"); }
 */
export function t(ar: string, en: string): string {
    return isArabicMode() ? ar : en;
}
