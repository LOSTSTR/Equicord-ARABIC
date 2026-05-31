/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./styles.css";

import { addProfileBadge, BadgePosition, BadgeUserArgs, ProfileBadge, removeProfileBadge } from "@api/Badges";
import definePlugin from "@utils/types";

import { CircleBadge } from "../_shared/CircleBadge";
import { DONOR_BADGES } from "./registry";

const DEFAULT_RING = "#a01b2d";

// ─── One profile badge per donor entry ────────────────────────────────────────
const profileBadges: ProfileBadge[] = DONOR_BADGES.map((badge, i) => {
    const idSet = new Set(badge.ids);
    return {
        id: `esharq-donor-${i}`,
        key: `esharq-donor-${i}`,
        description: badge.name,
        position: BadgePosition.START,
        shouldShow: ({ userId }: BadgeUserArgs) => idSet.has(userId),
        component: () => (
            <CircleBadge
                size={22}
                image={badge.image}
                ring={badge.ring ?? DEFAULT_RING}
                tooltip={badge.name}
                className="esharq-donor-badge"
            />
        ),
    };
});

// required: true → cannot be disabled; hidden: true → not listed in settings
export default definePlugin({
    name: "EsharqDonorBadges",
    description: "Custom badges for Esharq donors",
    authors: [],
    required: true,
    hidden: true,
    dependencies: ["BadgesAPI"],

    start() {
        for (const b of profileBadges) addProfileBadge(b);
    },

    stop() {
        for (const b of profileBadges) removeProfileBadge(b);
    },
});
