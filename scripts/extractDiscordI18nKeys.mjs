#!/usr/bin/env node
/**
 * Discord i18n Key Extractor
 * Scans the built renderer.js for all Discord Messages keys and compares
 * them against our translations.json to identify gaps.
 *
 * Usage: node scripts/extractDiscordI18nKeys.mjs [path/to/renderer.js]
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, "..");

const rendererPath = process.argv[2]
    ?? resolve(ROOT, "dist/desktop/renderer.js");

const translationsPath = resolve(
    ROOT, "src/equicordplugins/arabicLocalization/translations.json"
);

// ── 1. Load existing translations ─────────────────────────────────────────────
const existing = JSON.parse(readFileSync(translationsPath, "utf8"));
const existingKeys = new Set(Object.keys(existing));
console.log(`Existing translations: ${existingKeys.size} keys\n`);

// ── 2. Scan renderer bundle for Messages key patterns ─────────────────────────
console.log(`Scanning: ${rendererPath}`);
const src = readFileSync(rendererPath, "utf8");

// Discord's Messages object uses SCREAMING_SNAKE_CASE identifiers
// Pattern: property access on Messages objects, string literals used as keys,
// and identifiers that follow the naming convention
const KEY_RE = /\b([A-Z][A-Z0-9_]{3,})\b/g;

const candidates = new Set();
let m;
while ((m = KEY_RE.exec(src)) !== null) {
    const k = m[1];
    // Filter to likely Discord i18n keys (exclude obvious non-keys)
    if (
        k.length >= 4 &&
        k.length <= 80 &&
        !k.startsWith("_") &&
        !/^(NULL|TRUE|FALSE|NAN|INFINITY|MAX|MIN|GET|SET|HAS|USE|IS|NEW)$/.test(k)
    ) {
        candidates.add(k);
    }
}

console.log(`Candidate key patterns found: ${candidates.size}`);

// ── 3. Cross-reference: find keys in renderer not in our translations ─────────
const missing = [...candidates].filter(k => !existingKeys.has(k)).sort();
const covered = [...candidates].filter(k => existingKeys.has(k)).sort();

console.log(`\nCoverage:`);
console.log(`  Matched (in our translations): ${covered.length}`);
console.log(`  Not yet translated:            ${missing.length}`);

// ── 4. Write gap report ───────────────────────────────────────────────────────
const reportPath = resolve(ROOT, "scripts/i18n-gap-report.json");
const report = {
    generatedAt: new Date().toISOString(),
    rendererScanned: rendererPath,
    existingTranslations: existingKeys.size,
    candidatesFoundInRenderer: candidates.size,
    covered: covered.length,
    uncovered: missing.length,
    missingKeys: missing,
};
writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");
console.log(`\nGap report written to: ${reportPath}`);

// ── 5. Generate a stub translations patch for missing keys ────────────────────
const stubPath = resolve(ROOT, "scripts/i18n-stubs.json");
const stubs = {};
for (const k of missing.slice(0, 200)) {
    // Convert SCREAMING_SNAKE_CASE → human readable hint
    const hint = k.toLowerCase().replace(/_/g, " ");
    stubs[k] = `[AR] ${hint}`;
}
writeFileSync(stubPath, JSON.stringify(stubs, null, 2), "utf8");
console.log(`Stub file (first 200 missing keys) written to: ${stubPath}`);
console.log(`\nDone. Review i18n-gap-report.json then fill i18n-stubs.json with translations.`);
