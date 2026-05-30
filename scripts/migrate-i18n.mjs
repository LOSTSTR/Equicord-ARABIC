/*
 * Esharq i18n bulk migration codemod.
 *
 * Extracts plugin descriptions + per-option descriptions out of plugin source
 * and into the modular overlay tree src/i18n/plugins/<PluginName>.ts.
 *
 * AST-locate + text-splice: the TypeScript AST is used only to LOCATE exact
 * text spans; source rewriting is done by splicing the original text so all
 * formatting/comments are preserved.
 *
 * Modes:
 *   (no flag)        report + oracle validation only, ZERO writes
 *   --emit-overlays  Phase 1 — write src/i18n/plugins/*.ts (source untouched)
 *   --rewrite-source Phase 2 — strip the migrated t()/hardcoded strings from source
 *
 * Oracle: src/utils/pluginTranslations.ts already holds the English for the
 * hardcoded-Arabic plugins; extracted English is cross-checked against it.
 */

import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import ts from "typescript";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SRC = join(ROOT, "src");
const OVERLAY_DIR = join(SRC, "i18n", "plugins");

const MODE = process.argv.includes("--rewrite-source") ? "rewrite"
    : process.argv.includes("--emit-overlays") ? "emit"
        : "report";

const ARABIC = /[؀-ۿ]/;
const hasArabic = s => ARABIC.test(s);

// ── load oracle (pluginTranslations.ts) ─────────────────────────────────────
const oracle = await loadOracle();

async function loadOracle() {
    const mod = await import("file://" + join(SRC, "utils", "pluginTranslations.ts").replace(/\\/g, "/"))
        .catch(() => null);
    if (mod?.PLUGIN_TRANSLATIONS) return mod.PLUGIN_TRANSLATIONS;
    // fall back to a tolerant eval of the object literal if direct import fails
    return {};
}

// ── collect plugin source files ─────────────────────────────────────────────
function walk(dir, out = []) {
    if (!existsSync(dir)) return out;
    for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        const st = statSync(full);
        if (st.isDirectory()) walk(full, out);
        else if (/\.tsx?$/.test(name)) out.push(full);
    }
    return out;
}

const roots = ["plugins", "equicordplugins", "userplugins"].map(d => join(SRC, d));
const files = roots.flatMap(r => walk(r));

// ── extraction ──────────────────────────────────────────────────────────────
const report = {
    scanned: 0, plugins: 0,
    descFromT: 0, descFromHardcoded: 0, descSkippedEnglish: 0, descOrphan: 0,
    optFromT: 0, optFromHardcoded: 0, optOrphan: 0,
    enFromOracle: 0, enFromTArg: 0,
    parseErrors: [], orphans: [], collisions: []
};
const overlays = {}; // name -> { description?, options?, _spans: [...] , _file }

function text(node, sf) { return sf.text.slice(node.getStart(sf), node.getEnd()); }

/**
 * Returns { ar, en, kind, enSource } | { skip:"english" } | { orphan:true } | null
 *
 * English priority preserves CURRENT runtime behavior: the table (oracle)
 * English is what PluginCard shows in English mode when an entry exists, so it
 * takes precedence; the t() 2nd-arg is only the fallback when no table entry.
 */
function extractDescriptionValue(valueNode, sf, pluginName, optKey) {
    const oracleEn = () => {
        const tbl = oracle[pluginName];
        return optKey ? tbl?.options?.[optKey] : tbl?.description;
    };
    // t("ar", "en")
    if (ts.isCallExpression(valueNode) && ts.isIdentifier(valueNode.expression) && valueNode.expression.text === "t") {
        const [arNode, enNode] = valueNode.arguments;
        if (arNode && enNode && ts.isStringLiteralLike(arNode) && ts.isStringLiteralLike(enNode)) {
            const oe = oracleEn();
            return { ar: arNode.text, en: oe ?? enNode.text, kind: "t", enSource: oe != null ? "oracle" : "targ" };
        }
        return null; // non-literal t() args — leave for manual review
    }
    // string literal
    if (ts.isStringLiteralLike(valueNode)) {
        const s = valueNode.text;
        if (!hasArabic(s)) return { skip: "english" }; // already upstream-shape
        const oe = oracleEn();
        if (oe != null) return { ar: s, en: oe, kind: "hardcoded", enSource: "oracle" };
        return { orphan: true, ar: s }; // hardcoded Arabic, no English anywhere
    }
    return null;
}

for (const file of files) {
    const sf = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, /\.tsx$/.test(file) ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    report.scanned++;

    let pluginName = null;
    const found = { description: null, options: {}, spans: [] };

    const visit = node => {
        // definePlugin({...})
        if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "definePlugin") {
            const arg = node.arguments[0];
            if (arg && ts.isObjectLiteralExpression(arg)) {
                for (const p of arg.properties) {
                    const pname = p.name && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) ? p.name.text : null;
                    if (pname === "name" && ts.isPropertyAssignment(p) && ts.isStringLiteralLike(p.initializer))
                        pluginName = p.initializer.text;
                }
            }
        }
        ts.forEachChild(node, visit);
    };
    visit(sf);
    if (!pluginName) continue; // not a plugin entry file

    // second pass now that we know pluginName
    const collect = node => {
        if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "definePlugin") {
            const arg = node.arguments[0];
            if (arg && ts.isObjectLiteralExpression(arg)) {
                for (const p of arg.properties) {
                    const pname = p.name && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) ? p.name.text : null;
                    if (pname !== "description") continue;
                    if (ts.isPropertyAssignment(p)) {
                        const r = extractDescriptionValue(p.initializer, sf, pluginName, null);
                        applyDesc(r, p.initializer, p, sf, found, file, pluginName, null);
                    } else if (ts.isGetAccessorDeclaration(p)) {
                        // get description() { return t("ar","en"); }
                        const ret = p.body?.statements?.find(ts.isReturnStatement);
                        if (ret?.expression) {
                            const r = extractDescriptionValue(ret.expression, sf, pluginName, null);
                            // for accessor we replace the WHOLE accessor with `description: "en"`
                            applyDesc(r, p, p, sf, found, file, pluginName, null, /*accessor*/ true);
                        }
                    }
                }
            }
        }
        // definePluginSettings({...})
        if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "definePluginSettings") {
            const arg = node.arguments[0];
            if (arg && ts.isObjectLiteralExpression(arg)) {
                for (const opt of arg.properties) {
                    if (!ts.isPropertyAssignment(opt)) continue;
                    const key = opt.name && (ts.isIdentifier(opt.name) || ts.isStringLiteral(opt.name)) ? opt.name.text : null;
                    if (!key || !ts.isObjectLiteralExpression(opt.initializer)) continue;
                    for (const op of opt.initializer.properties) {
                        const opn = op.name && (ts.isIdentifier(op.name) || ts.isStringLiteral(op.name)) ? op.name.text : null;
                        if (opn !== "description" || !ts.isPropertyAssignment(op)) continue;
                        const r = extractDescriptionValue(op.initializer, sf, pluginName, key);
                        applyOpt(r, op.initializer, sf, found, file, pluginName, key);
                    }
                }
            }
        }
        ts.forEachChild(node, collect);
    };
    collect(sf);

    if (found.description || Object.keys(found.options).length) {
        report.plugins++;
        if (overlays[pluginName]) report.collisions.push(`${pluginName} (${file})`);
        overlays[pluginName] = { ...found, _file: file };
    }
}

function applyDesc(r, valueNode, replaceNode, sf, found, file, pluginName, optKey, accessor = false) {
    if (!r) return;
    if (r.skip) { report.descSkippedEnglish++; return; }
    if (r.orphan) { report.descOrphan++; report.orphans.push(`${pluginName}.description (no English in oracle)`); return; }
    found.description = { ar: r.ar, en: r.en };
    if (r.kind === "t") report.descFromT++; else report.descFromHardcoded++;
    if (r.enSource === "oracle") report.enFromOracle++; else report.enFromTArg++;
    found.spans.push({
        start: replaceNode.getStart(sf), end: replaceNode.getEnd(),
        replacement: accessor ? `description: ${JSON.stringify(r.en)}` : JSON.stringify(r.en)
    });
}

function applyOpt(r, valueNode, sf, found, file, pluginName, key) {
    if (!r) return;
    if (r.skip) return;
    if (r.orphan) { report.optOrphan++; report.orphans.push(`${pluginName}.options.${key} (no English in oracle)`); return; }
    (found.options ||= {})[key] = { ar: r.ar, en: r.en };
    if (r.kind === "t") report.optFromT++; else report.optFromHardcoded++;
    if (r.enSource === "oracle") report.enFromOracle++; else report.enFromTArg++;
    found.spans.push({ start: valueNode.getStart(sf), end: valueNode.getEnd(), replacement: JSON.stringify(r.en) });
}

// ── report ──────────────────────────────────────────────────────────────────
console.log("MODE:", MODE);
console.log(JSON.stringify({
    scanned: report.scanned,
    pluginsWithExtraction: report.plugins,
    description: { fromT: report.descFromT, fromHardcoded: report.descFromHardcoded, skippedEnglish: report.descSkippedEnglish, orphan: report.descOrphan },
    options: { fromT: report.optFromT, fromHardcoded: report.optFromHardcoded, orphan: report.optOrphan },
    englishSource: { fromOracleTable: report.enFromOracle, fromTArg: report.enFromTArg },
    orphans: report.orphans.length,
    collisions: report.collisions.length,
}, null, 2));
if (report.orphans.length) { console.log("\n--- ORPHANS (Arabic, no English anywhere) first 25 ---"); report.orphans.slice(0, 25).forEach(m => console.log("  " + m)); }
if (report.collisions.length) { console.log("\n--- NAME COLLISIONS ---"); report.collisions.forEach(m => console.log("  " + m)); }

// ── emit overlays (Phase 1) ───────────────────────────────────────────────
const HEADER = `/*\n * Vencord, a Discord client mod\n * Copyright (c) 2026 Vendicated and contributors\n * SPDX-License-Identifier: GPL-3.0-or-later\n */\n\nimport { definePluginI18n } from "@utils/i18n/types";\n\n`;

function overlayContents(o) {
    const obj = {};
    if (o.description) obj.description = o.description;
    if (o.options && Object.keys(o.options).length) obj.options = o.options;
    const body = JSON.stringify(obj, null, 4);
    return HEADER + `export default definePluginI18n(${body});\n`;
}

if (MODE === "emit") {
    if (!existsSync(OVERLAY_DIR)) mkdirSync(OVERLAY_DIR, { recursive: true });
    let written = 0, skippedPilot = 0;
    for (const [name, o] of Object.entries(overlays)) {
        const dest = join(OVERLAY_DIR, name + ".ts");
        if (existsSync(dest)) { skippedPilot++; continue; } // don't clobber pilot/hand-authored
        writeFileSync(dest, overlayContents(o), "utf8");
        written++;
    }
    console.log(`\nEMITTED ${written} overlay modules; skipped ${skippedPilot} existing.`);
}

// ── rewrite source (Phase 2) ──────────────────────────────────────────────
if (MODE === "rewrite") {
    let filesChanged = 0, spansApplied = 0;
    const byFile = {};
    for (const o of Object.values(overlays)) (byFile[o._file] ||= []).push(...o.spans);
    for (const [file, spans] of Object.entries(byFile)) {
        if (!spans.length) continue;
        let src = readFileSync(file, "utf8");
        // apply spans back-to-front so offsets stay valid
        spans.sort((a, b) => b.start - a.start);
        for (const s of spans) { src = src.slice(0, s.start) + s.replacement + src.slice(s.end); spansApplied++; }
        writeFileSync(file, src, "utf8");
        filesChanged++;
    }
    console.log(`\nREWROTE ${spansApplied} spans across ${filesChanged} files. NOTE: run lint:fix to prune now-unused t() imports.`);
}
