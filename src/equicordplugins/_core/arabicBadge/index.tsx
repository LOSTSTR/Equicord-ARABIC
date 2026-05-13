/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./styles.css";

import { addProfileBadge, BadgePosition, BadgeUserArgs, ProfileBadge, removeProfileBadge } from "@api/Badges";
import { addMessageDecoration, removeMessageDecoration } from "@api/MessageDecorations";
import ErrorBoundary from "@components/ErrorBoundary";
import definePlugin from "@utils/types";
import { Tooltip } from "@webpack/common";

import type { JSX } from "react";

const BADGE_ID = "eq-arabic-brand";

// ─── Authorized user list ──────────────────────────────────────────────────────
// Stored as base64(discordSnowflakeId) — light obfuscation only.
// To add a user:  btoa("their-discord-id")  → paste result below.
// To remove:      delete the entry.
const _ENCODED = [
    "MTE2MTM4OTIzOTExMjU2ODkwMg==",
    "NjgxNDY1NzU4MTI3MjI2OTAw",
    "MTA3Mjk2MTQ3NTEyNTE4MjU2NA==",
];

const BADGE_USERS: ReadonlySet<string> = new Set(_ENCODED.map(atob));

function hasBadge(userId: string): boolean {
    return BADGE_USERS.has(userId);
}

// ─── Badge visual — purple "EA" disc ─────────────────────────────────────────

function EaBadgeIcon({ size }: { size: number }): JSX.Element {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
        >
            <circle cx="10" cy="10" r="10" fill="#6d28d9" />
            <text
                x="10"
                y="10"
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontSize="7.5"
                fontWeight="bold"
                fontFamily="gg sans,Noto Sans,Whitney,Helvetica Neue,Helvetica,Arial,sans-serif"
                letterSpacing="-0.4"
            >EA</text>
        </svg>
    );
}

function EqArabicBadge({ size }: { size: number }): JSX.Element {
    return (
        <ErrorBoundary noop>
            <Tooltip text="Equicord-ARABIC User" position="top">
                {({ onMouseEnter, onMouseLeave }) => (
                    <div
                        className="eq-arabic-badge"
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        style={{ width: size, height: size }}
                        role="img"
                        aria-label="Equicord-ARABIC User"
                    >
                        <EaBadgeIcon size={size} />
                    </div>
                )}
            </Tooltip>
        </ErrorBoundary>
    );
}

// ─── Profile badge ────────────────────────────────────────────────────────────

const profileBadge: ProfileBadge = {
    id: BADGE_ID,
    key: BADGE_ID,
    description: "Equicord-ARABIC User",
    position: BadgePosition.START,
    shouldShow: ({ userId }: BadgeUserArgs) => hasBadge(userId),
    component: (_props: ProfileBadge & BadgeUserArgs) => <EqArabicBadge size={22} />,
};

// ─── Core module ──────────────────────────────────────────────────────────────
// required: true → cannot be disabled
// hidden: true   → not listed in plugin settings

export default definePlugin({
    name: "EqArabicBrand",
    description: "Equicord-ARABIC brand badge",
    authors: [],
    required: true,
    hidden: true,
    dependencies: ["BadgesAPI", "MessageDecorationsAPI"],

    start() {
        addProfileBadge(profileBadge);

        addMessageDecoration(BADGE_ID, ({ message }) => {
            if (!hasBadge(message?.author?.id ?? "")) return null;
            return <EqArabicBadge size={18} />;
        });
    },

    stop() {
        removeProfileBadge(profileBadge);
        removeMessageDecoration(BADGE_ID);
    },
});
