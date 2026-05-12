/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import { Logger } from "@utils/Logger";
import definePlugin from "@utils/types";
import { Alerts } from "@webpack/common";
import gitHash from "~git-hash";

const logger = new Logger("ArabicAutoUpdater");
const REPO = "LOSTSTR/Equicord-ARABIC";
const RELEASES_PAGE = `https://github.com/${REPO}/releases/latest`;
const API_URL = `https://api.github.com/repos/${REPO}/releases/latest`;
const SEEN_KEY = "equicord-arabic-last-seen-update";

let checked = false;

async function checkForUpdate() {
    if (checked) return;
    checked = true;

    try {
        const res = await fetch(API_URL, {
            headers: { Accept: "application/vnd.github+json" }
        });
        if (!res.ok) return;

        const data = await res.json();
        const releaseName: string = data.name ?? "";
        const remoteHash = releaseName.slice(releaseName.lastIndexOf(" ") + 1);

        if (!remoteHash || remoteHash === gitHash) return;

        const lastSeen = localStorage.getItem(SEEN_KEY);
        if (lastSeen === remoteHash) return;

        localStorage.setItem(SEEN_KEY, remoteHash);

        Alerts.show({
            title: "تحديث جديد متاح!",
            body: (
                <>
                    <p>يتوفر إصدار جديد من <strong>Equicord-ARABIC</strong>.</p>
                    <p>الإصدار الحالي: <code>{gitHash.slice(0, 7)}</code></p>
                    <p>الإصدار الجديد: <code>{remoteHash.slice(0, 7)}</code></p>
                    <p>هل تريد التحديث الآن؟</p>
                </>
            ),
            confirmText: "تحديث الآن",
            cancelText: "لاحقاً",
            onConfirm() {
                VencordNative.native.openExternal(RELEASES_PAGE);
            }
        });
    } catch (e) {
        logger.error("فشل فحص التحديثات:", e);
    }
}

export default definePlugin({
    name: "ArabicAutoUpdater",
    description: "يتحقق تلقائياً من توفر تحديثات لـ Equicord-ARABIC ويُعلمك عند توفر إصدار جديد",
    authors: [Devs.thororen],
    tags: ["Update", "Arabic"],

    flux: {
        async CONNECTION_OPEN() {
            await checkForUpdate();
        }
    }
});
