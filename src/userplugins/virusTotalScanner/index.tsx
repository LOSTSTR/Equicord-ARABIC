/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./styles.css";

import { definePluginSettings, useSettings } from "@api/Settings";
import { classNameFactory } from "@utils/css";
import { t } from "@utils/esharqI18n";
import definePlugin, { OptionType } from "@utils/types";
import { React, TextInput, useState } from "@webpack/common";

import type { JSX } from "react";

const cl = classNameFactory("vts-");

// ─── Types ────────────────────────────────────────────────────────────────────

interface VtStats {
    malicious: number;
    suspicious: number;
    harmless: number;
    undetected: number;
}

interface ScanResult {
    sha256: string;
    stats: VtStats;
    permalink: string;
}

type ScanPhase =
    | { phase: "idle"; }
    | { phase: "hashing"; }
    | { phase: "querying"; }
    | { phase: "result"; result: ScanResult; }
    | { phase: "notFound"; sha256: string; }
    | { phase: "uploading"; progress: number; }
    | { phase: "uploaded"; }
    | { phase: "error"; message: string; };

interface AttachmentProps {
    fileName?: string;
    fileSize?: number;
    url?: string;
    item?: {
        downloadUrl?: string;
        originalItem?: {
            filename?: string;
            proxy_url?: string;
            size?: number;
            title?: string;
            url?: string;
            content_type?: string;
        };
    };
}

// ─── Session Cache ────────────────────────────────────────────────────────────

const scanCache = new Map<string, ScanResult | "notFound">();

// ─── Settings ────────────────────────────────────────────────────────────────

const settings = definePluginSettings({
    apiKey: {
        type: OptionType.STRING,
        description: t("مفتاح VirusTotal API", "VirusTotal API key"),
        default: "",
        hidden: true,
    },
    apiKeyInput: {
        type: OptionType.COMPONENT,
        description: t("مفتاح VirusTotal API v3", "VirusTotal API v3 key"),
        component: ApiKeyInput,
    }
});

function ApiKeyInput(): JSX.Element {
    useSettings(["plugins.Settings.arabicMode"]);
    const [value, setValue] = useState(settings.store.apiKey ?? "");
    const [saved, setSaved] = useState(false);

    function save() {
        settings.store.apiKey = value.trim();
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }

    return (
        <div className={cl("api-key-wrap")}>
            <TextInput
                type="password"
                value={value}
                onChange={v => { setValue(v); setSaved(false); }}
                placeholder={t("أدخل مفتاح VirusTotal API v3", "Enter your VirusTotal API v3 key")}
                className={cl("api-key-input")}
            />
            <button className={cl("save-btn")} onClick={save}>
                {saved ? t("✔ تم الحفظ", "✔ Saved") : t("حفظ", "Save")}
            </button>
        </div>
    );
}

// ─── SHA-256 ──────────────────────────────────────────────────────────────────

async function computeSha256(data: ArrayBuffer): Promise<string> {
    const hashBuf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuf))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

// ─── VirusTotal API ───────────────────────────────────────────────────────────

const VT_BASE = "https://www.virustotal.com/api/v3";

async function vtHashLookup(hash: string, apiKey: string): Promise<{ found: true; result: ScanResult; } | { found: false; }> {
    const res = await fetch(`${VT_BASE}/files/${hash}`, {
        headers: { "x-apikey": apiKey }
    });

    if (res.status === 404) return { found: false };
    if (!res.ok) throw new Error(`${t("خطأ من VirusTotal", "VirusTotal error")}: ${res.status}`);

    const json = await res.json();
    const attrs = json?.data?.attributes ?? {};
    const stats: VtStats = {
        malicious: attrs.last_analysis_stats?.malicious ?? 0,
        suspicious: attrs.last_analysis_stats?.suspicious ?? 0,
        harmless: attrs.last_analysis_stats?.harmless ?? 0,
        undetected: attrs.last_analysis_stats?.undetected ?? 0,
    };

    return {
        found: true,
        result: {
            sha256: hash,
            stats,
            permalink: `https://www.virustotal.com/gui/file/${hash}`,
        }
    };
}

async function getVtUploadUrl(apiKey: string): Promise<string> {
    const res = await fetch(`${VT_BASE}/files/upload_url`, {
        headers: { "x-apikey": apiKey }
    });
    if (!res.ok) throw new Error(t("لم نتمكن من الحصول على رابط الرفع", "Could not get upload URL"));
    const json = await res.json();
    return json.data as string;
}

function vtUpload(
    data: ArrayBuffer,
    filename: string,
    uploadUrl: string,
    apiKey: string,
    onProgress: (pct: number) => void
): Promise<string> {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", new Blob([data]), filename);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", uploadUrl);
        xhr.setRequestHeader("x-apikey", apiKey);

        xhr.upload.onprogress = e => {
            if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const json = JSON.parse(xhr.responseText);
                    resolve(json.data.id as string);
                } catch {
                    reject(new Error(t("استجابة غير صالحة من VirusTotal", "Invalid response from VirusTotal")));
                }
            } else {
                reject(new Error(`${t("فشل الرفع", "Upload failed")}: ${xhr.status}`));
            }
        };

        xhr.onerror = () => reject(new Error(t("خطأ في الاتصال أثناء الرفع", "Connection error during upload")));
        xhr.send(formData);
    });
}

async function vtPollAnalysis(analysisId: string, apiKey: string): Promise<ScanResult> {
    for (let i = 0; i < 24; i++) {
        await new Promise<void>(r => setTimeout(r, 5000));
        const res = await fetch(`${VT_BASE}/analyses/${analysisId}`, {
            headers: { "x-apikey": apiKey }
        });
        if (!res.ok) throw new Error(`${t("خطأ أثناء متابعة نتائج الفحص", "Error while polling scan results")}: ${res.status}`);

        const json = await res.json();
        const attrs = json?.data?.attributes ?? {};

        if (attrs.status === "completed") {
            const meta = json?.meta?.file_info ?? {};
            const sha256 = meta.sha256 ?? analysisId;
            const stats: VtStats = {
                malicious: attrs.stats?.malicious ?? 0,
                suspicious: attrs.stats?.suspicious ?? 0,
                harmless: attrs.stats?.harmless ?? 0,
                undetected: attrs.stats?.undetected ?? 0,
            };
            return {
                sha256,
                stats,
                permalink: `https://www.virustotal.com/gui/file/${sha256}`,
            };
        }
    }
    throw new Error(t("انتهت مهلة انتظار نتائج الفحص", "Timed out waiting for scan results"));
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ShieldIcon(): JSX.Element {
    return (
        <svg width={13} height={13} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
        </svg>
    );
}

function Spinner(): JSX.Element {
    return <span className={cl("spinner")} aria-hidden />;
}

// ─── ScanButton Component ─────────────────────────────────────────────────────

function ScanButton({ attachmentProps }: { attachmentProps: AttachmentProps; }): JSX.Element | null {
    useSettings(["plugins.Settings.arabicMode"]);
    const url = attachmentProps.url
        ?? attachmentProps.item?.downloadUrl
        ?? attachmentProps.item?.originalItem?.url
        ?? attachmentProps.item?.originalItem?.proxy_url;

    const filename = attachmentProps.fileName
        ?? attachmentProps.item?.originalItem?.filename
        ?? attachmentProps.item?.originalItem?.title
        ?? t("ملف", "file");

    const [state, setState] = useState<ScanPhase>({ phase: "idle" });

    if (!url) return null;

    async function doScan() {
        const apiKey = settings.store.apiKey?.trim();
        if (!apiKey) {
            setState({ phase: "error", message: t("يرجى إدخال مفتاح VirusTotal API في إعدادات الإضافة أولاً", "Please enter your VirusTotal API key in the plugin settings first") });
            return;
        }

        try {
            setState({ phase: "hashing" });

            let fileData: ArrayBuffer;
            try {
                const fileRes = await fetch(url, { cache: "no-store", credentials: "include" });
                if (!fileRes.ok) throw new Error(`${t("الملف غير متاح", "File unavailable")} (${fileRes.status})`);
                fileData = await fileRes.arrayBuffer();
            } catch (fetchErr: any) {
                const msg: string = fetchErr?.message ?? "";
                if (!msg || /failed to fetch|networkerror|network request failed/i.test(msg)) {
                    throw new Error(t("الملف غير متاح — قد يكون الرابط منتهي الصلاحية أو المرفق محذوف", "File unavailable — the link may have expired or the attachment was deleted"));
                }
                throw new Error(`${t("تعذّر تنزيل الملف", "Failed to download file")} — ${msg}`);
            }

            const hash = await computeSha256(fileData);

            const cached = scanCache.get(hash);
            if (cached) {
                setState(cached === "notFound"
                    ? { phase: "notFound", sha256: hash }
                    : { phase: "result", result: cached });
                return;
            }

            setState({ phase: "querying" });
            let lookup: Awaited<ReturnType<typeof vtHashLookup>>;
            try {
                lookup = await vtHashLookup(hash, apiKey);
            } catch (vtErr: any) {
                throw new Error(`${t("خطأ في VirusTotal API", "VirusTotal API error")} — ${vtErr?.message ?? t("تحقق من مفتاح API", "check your API key")}`);
            }

            if (lookup.found) {
                scanCache.set(hash, lookup.result);
                setState({ phase: "result", result: lookup.result });
            } else {
                scanCache.set(hash, "notFound");
                setState({ phase: "notFound", sha256: hash });
            }
        } catch (e: any) {
            setState({ phase: "error", message: e?.message ?? t("خطأ غير متوقع", "Unexpected error") });
        }
    }

    async function doUpload(sha256hash: string) {
        const apiKey = settings.store.apiKey?.trim();
        if (!apiKey) return;

        try {
            setState({ phase: "uploading", progress: 0 });

            let fileData: ArrayBuffer;
            try {
                const fileRes = await fetch(url, { cache: "no-store", credentials: "include" });
                if (!fileRes.ok) throw new Error(`${t("الملف غير متاح", "File unavailable")} (${fileRes.status})`);
                fileData = await fileRes.arrayBuffer();
            } catch (fetchErr: any) {
                const msg: string = fetchErr?.message ?? "";
                if (!msg || /failed to fetch|networkerror|network request failed/i.test(msg)) {
                    throw new Error(t("الملف غير متاح — قد يكون الرابط منتهي الصلاحية أو المرفق محذوف", "File unavailable — the link may have expired or the attachment was deleted"));
                }
                throw new Error(`${t("تعذّر تنزيل الملف", "Failed to download file")} — ${msg}`);
            }

            const uploadEndpoint = fileData.byteLength > 32 * 1024 * 1024
                ? await getVtUploadUrl(apiKey)
                : `${VT_BASE}/files`;

            const analysisId = await vtUpload(fileData, filename, uploadEndpoint, apiKey, pct => {
                setState({ phase: "uploading", progress: pct });
            });

            setState({ phase: "uploaded" });

            const result = await vtPollAnalysis(analysisId, apiKey);
            scanCache.set(sha256hash, result);
            setState({ phase: "result", result });
        } catch (e: any) {
            setState({ phase: "error", message: e?.message ?? t("فشل الرفع", "Upload failed") });
        }
    }

    const { phase } = state;

    if (phase === "idle") {
        return (
            <button className={cl("scan-btn")} onClick={doScan} title={t("فحص الملف بـ VirusTotal", "Scan file with VirusTotal")}>
                <ShieldIcon />
                <span>{t("فحص الملف", "Scan File")}</span>
            </button>
        );
    }

    if (phase === "hashing" || phase === "querying") {
        return (
            <div className={cl("status-bar")}>
                <Spinner />
                <span>{phase === "hashing" ? t("جارٍ حساب البصمة…", "Computing hash…") : t("جارٍ الفحص…", "Scanning…")}</span>
            </div>
        );
    }

    if (phase === "result") {
        const { stats, permalink } = (state as Extract<ScanPhase, { phase: "result"; }>).result;
        const threatCount = stats.malicious + stats.suspicious;
        const isMalicious = threatCount > 0;

        return (
            <div className={cl("result-card", isMalicious ? "malicious" : "clean")}>
                <span className={cl("result-icon")}>{isMalicious ? "🔴" : "🟢"}</span>
                <span className={cl("result-label")}>
                    {isMalicious
                        ? `${t("ضار", "Malicious")} — ${threatCount} ${t("مكتشِف", "detections")}`
                        : `${t("آمن", "Clean")} — ${stats.harmless + stats.undetected} ${t("فاحص", "scanners")}`}
                </span>
                <a
                    href={permalink}
                    target="_blank"
                    rel="noreferrer"
                    className={cl("vt-link")}
                    onClick={e => e.stopPropagation()}
                >
                    {t("تقرير VT", "VT Report")} ↗
                </a>
                <button
                    className={cl("dismiss-btn")}
                    onClick={() => setState({ phase: "idle" })}
                    title={t("إغلاق", "Close")}
                    aria-label={t("إغلاق", "Close")}
                >
                    ✕
                </button>
            </div>
        );
    }

    if (phase === "notFound") {
        const { sha256 } = state as Extract<ScanPhase, { phase: "notFound"; }>;

        return (
            <div className={cl("result-card", "not-found")}>
                <span className={cl("result-icon")}>⚪</span>
                <span className={cl("result-label")}>{t("هذا الملف جديد ولم يسبق فحصُه", "This file is new and has not been scanned before")}</span>
                <button className={cl("upload-btn")} onClick={() => doUpload(sha256)}>
                    {t("رفع وفحص الملف", "Upload and Scan")}
                </button>
                <button
                    className={cl("dismiss-btn")}
                    onClick={() => setState({ phase: "idle" })}
                    title={t("إغلاق", "Close")}
                    aria-label={t("إغلاق", "Close")}
                >
                    ✕
                </button>
            </div>
        );
    }

    if (phase === "uploading") {
        const { progress } = state as Extract<ScanPhase, { phase: "uploading"; }>;

        return (
            <div className={cl("upload-wrap")}>
                <div className={cl("upload-track")}>
                    <div className={cl("upload-fill")} style={{ width: `${progress}%` }} />
                </div>
                <span className={cl("upload-label")}>{t("جارٍ الرفع…", "Uploading…")} {progress}%</span>
            </div>
        );
    }

    if (phase === "uploaded") {
        return (
            <div className={cl("status-bar")}>
                <Spinner />
                <span>{t("جارٍ انتظار نتائج الفحص…", "Waiting for scan results…")}</span>
            </div>
        );
    }

    if (phase === "error") {
        const { message } = state as Extract<ScanPhase, { phase: "error"; }>;

        return (
            <div className={cl("result-card", "error")}>
                <span className={cl("result-icon")}>⚠️</span>
                <span className={cl("result-label")}>{message}</span>
                <button className={cl("dismiss-btn")} onClick={() => setState({ phase: "idle" })}>
                    {t("إعادة المحاولة", "Retry")}
                </button>
            </div>
        );
    }

    return null;
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export default definePlugin({
    name: "VirusTotal-Scanner",
    get description() { return t("افحص مرفقات Discord باستخدام VirusTotal API — بصمة SHA-256 محلية، بدون رفع بياناتك إلا عند الطلب.", "Scan Discord attachments using the VirusTotal API — SHA-256 hash computed locally, no data uploaded unless you request it."); },
    authors: [{ name: "『N』𝐀𝐁𝐨 𝐆𝐡𝐚𝐲𝐮𝐌 ^", id: 1161389239112568902n }],
    settings,

    patches: [
        {
            find: "#{intl::IMG_ALT_ATTACHMENT_FILE_TYPE}",
            replacement: {
                match: /(?<=renderAdjacentContent:\i}=(\i);.{0,120}className:)(\i\.\i)(,children:\[)/,
                replace: "$2$3$self.renderScanButton($1),"
            }
        }
    ],

    renderScanButton(props: AttachmentProps): JSX.Element | null {
        return <ScanButton attachmentProps={props} />;
    },
});
