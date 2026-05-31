/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

// ─── Layer 3: UI (render ONLY — no scanning, no scoring) ─────────────────────

import "./styles.css";

import { t } from "@utils/esharqI18n";
import type { ModalProps } from "@utils/modal";
import { saveFile } from "@utils/web";
import { Button, Modal, React, TextInput, useState } from "@webpack/common";

import type { ScoredPlugin } from "./scoring";

type SortKey = "name" | "hooks" | "listeners" | "patches" | "uiInjects" | "risk";

function exportJson(rows: ScoredPlugin[], heapMB: number | null) {
    const payload = {
        _esharq: "diagnostics",
        version: 1,
        takenAt: new Date().toISOString(),
        heapMB,
        plugins: rows,
    };
    const date = new Date().toISOString().slice(0, 10);
    saveFile(new File([JSON.stringify(payload, null, 2)], `esharq-diagnostics-${date}.json`, { type: "application/json" }));
}

export function DiagnosticsModal({ modalProps, initial, heapMB, rescan }: {
    modalProps: ModalProps;
    initial: ScoredPlugin[];
    heapMB: number | null;
    rescan: () => ScoredPlugin[];
}) {
    const [rows, setRows] = useState<ScoredPlugin[]>(initial);
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("risk");
    const [asc, setAsc] = useState(false);

    // built per-render so language (t) is always current
    const columns: { key: SortKey; label: string; tip: string; num: boolean; }[] = [
        { key: "name", label: t("الإضافة", "Plugin"), tip: t("اسم الإضافة", "Plugin name"), num: false },
        { key: "hooks", label: t("أوامر", "Hooks"), tip: t("عدد الأوامر المسجّلة", "Registered slash commands"), num: true },
        { key: "listeners", label: t("مستمعون", "Listeners"), tip: t("اشتراكات Flux/Dispatcher", "Flux/Dispatcher subscriptions"), num: true },
        { key: "patches", label: t("ترقيعات", "Patches"), tip: t("ترقيعات كود webpack", "Webpack code patches"), num: true },
        { key: "uiInjects", label: t("حقن واجهة", "UI Injects"), tip: t("قوائم سياق + عناصر واجهة", "Context menus + UI render surfaces"), num: true },
        { key: "risk", label: t("الخطورة", "Risk"), tip: "(patches×2)+(listeners×3)+(uiInjects×1.5)", num: true },
    ];

    function sortBy(key: SortKey) {
        if (key === sortKey) setAsc(!asc);
        else { setSortKey(key); setAsc(key === "name"); }
    }

    const q = search.trim().toLowerCase();
    const view = rows
        .filter(r => !q || r.name.toLowerCase().includes(q))
        .sort((a, b) => {
            const av = a[sortKey], bv = b[sortKey];
            const cmp = typeof av === "string"
                ? (av as string).localeCompare(bv as string)
                : (av as number) - (bv as number);
            return asc ? cmp : -cmp;
        });

    return (
        <Modal {...modalProps} size="lg" title={t("تشخيص إِشراق", "Esharq Diagnostics")}>
            <div className="esharq-diag">
                <div className="esharq-diag-sub">
                    {t("لقطة موارد الإضافات لمرة واحدة", "One-time plugin resource snapshot")}
                </div>

                <div className="esharq-diag-toolbar">
                    <div className="esharq-diag-searchwrap">
                        <TextInput
                            placeholder={t("بحث...", "Search...")}
                            value={search}
                            onChange={setSearch}
                        />
                    </div>
                    <div className="esharq-diag-actions">
                        {heapMB != null && (
                            <span className="esharq-diag-heap" title={t("ذاكرة JS الحالية", "Current JS heap")}>
                                Heap: {heapMB} MB
                            </span>
                        )}
                        <Button size={Button.Sizes.SMALL} onClick={() => setRows(rescan())}>
                            {t("إعادة الفحص", "Re-scan")}
                        </Button>
                        <Button size={Button.Sizes.SMALL} color={Button.Colors.PRIMARY} onClick={() => exportJson(view, heapMB)}>
                            {t("تصدير JSON", "Export JSON")}
                        </Button>
                    </div>
                </div>

                <div className="esharq-diag-tablewrap">
                    <table className="esharq-diag-table">
                        <thead>
                            <tr>
                                {columns.map(c => (
                                    <th
                                        key={c.key}
                                        title={c.tip}
                                        className={c.num ? "num" : ""}
                                        onClick={() => sortBy(c.key)}
                                    >
                                        {c.label}{sortKey === c.key ? (asc ? " ▲" : " ▼") : ""}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {view.length === 0 ? (
                                <tr><td colSpan={6} className="esharq-diag-empty">{t("لا نتائج", "No results")}</td></tr>
                            ) : view.map(r => (
                                <tr key={r.name} className={`esharq-diag-row lvl-${r.level}`}>
                                    <td>{r.name}</td>
                                    <td className="num">{r.hooks}</td>
                                    <td className="num">{r.listeners}</td>
                                    <td className="num">{r.patches}</td>
                                    <td className="num">{r.uiInjects}</td>
                                    <td className="num"><span className={`esharq-diag-badge ${r.level}`}>{r.risk}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="esharq-diag-foot">
                    {view.length} / {rows.length} {t("إضافة", "plugins")}
                </div>
            </div>
        </Modal>
    );
}
