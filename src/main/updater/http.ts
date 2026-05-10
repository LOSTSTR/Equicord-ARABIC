/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { fetchBuffer, fetchJson } from "@main/utils/http";
import { IpcEvents } from "@shared/IpcEvents";
import { VENCORD_USER_AGENT } from "@shared/vencordUserAgent";
import { createHash } from "crypto";
import { ipcMain } from "electron";
import { writeFileSync } from "original-fs";

import gitHash from "~git-hash";
import gitRemote from "~git-remote";

import { ASAR_FILE, serializeErrors } from "./common";

const API_BASE = `https://api.github.com/repos/${gitRemote}`;

interface PendingUpdateInfo {
    url: string;
    expectedSha256: string | null;
}

let PendingUpdate: PendingUpdateInfo | null = null;

async function githubGet<T = any>(endpoint: string) {
    return fetchJson<T>(API_BASE + endpoint, {
        headers: {
            Accept: "application/vnd.github+json",
            // "All API requests MUST include a valid User-Agent header.
            // Requests with no User-Agent header will be rejected."
            "User-Agent": VENCORD_USER_AGENT
        }
    });
}

async function calculateGitChanges() {
    const isOutdated = await fetchUpdates();
    if (!isOutdated) return [];

    const data = await githubGet(`/compare/${gitHash}...HEAD`);

    return data.commits.map((c: any) => ({
        hash: c.sha,
        author: c.author?.login ?? c.commit?.author?.name ?? "Ghost",
        message: c.commit.message.split("\n")[0]
    }));
}

async function fetchUpdates() {
    const data = await githubGet("/releases/latest");

    const hash = data.name.slice(data.name.lastIndexOf(" ") + 1);
    if (hash === gitHash)
        return false;

    const asset = data.assets.find((a: any) => a.name === ASAR_FILE);
    if (!asset) return false;

    // Look for a companion SHA-256 checksum asset (e.g. desktop.asar.sha256)
    const checksumAsset = data.assets.find((a: any) => a.name === ASAR_FILE + ".sha256");
    let expectedSha256: string | null = null;
    if (checksumAsset) {
        try {
            const text = await fetchJson<string>(checksumAsset.browser_download_url, {
                headers: { "User-Agent": VENCORD_USER_AGENT }
            });
            // File may contain "hash  filename" or just "hash"
            expectedSha256 = (typeof text === "string" ? text : JSON.stringify(text))
                .split(/\s+/)[0].toLowerCase();
        } catch {
            // Checksum unavailable — continue without verification (log warning)
            console.warn("[Updater] Could not download checksum file — update will proceed unverified");
        }
    }

    PendingUpdate = { url: asset.browser_download_url, expectedSha256 };
    return true;
}

async function applyUpdates() {
    if (!PendingUpdate) return true;

    const data = await fetchBuffer(PendingUpdate.url);

    // Verify SHA-256 checksum when available
    if (PendingUpdate.expectedSha256) {
        const actualSha256 = createHash("sha256").update(data).digest("hex");
        if (actualSha256 !== PendingUpdate.expectedSha256) {
            PendingUpdate = null;
            throw new Error(
                `Update integrity check failed!\n` +
                `Expected: ${PendingUpdate?.expectedSha256}\n` +
                `Actual:   ${actualSha256}\n` +
                `The downloaded file may be corrupted or tampered with.`
            );
        }
    }

    writeFileSync(__dirname, data, { flush: true });
    PendingUpdate = null;
    return true;
}

ipcMain.handle(IpcEvents.GET_REPO, serializeErrors(() => `https://github.com/${gitRemote}`));
ipcMain.handle(IpcEvents.GET_UPDATES, serializeErrors(calculateGitChanges));
ipcMain.handle(IpcEvents.UPDATE, serializeErrors(fetchUpdates));
ipcMain.handle(IpcEvents.BUILD, serializeErrors(applyUpdates));
