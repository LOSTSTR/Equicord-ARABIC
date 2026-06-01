/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./styles.css";

import { addProfileBadge, BadgePosition, BadgeUserArgs, ProfileBadge, removeProfileBadge } from "@api/Badges";
import definePlugin from "@utils/types";

import { CircleBadge } from "../_shared/CircleBadge";
import { FOUNDERS_IMAGE } from "./image";

const BADGE_ID = "esharq-founder";
const RING = "#a01b2d";
const NAME = "Esharq Founder · مؤسِّس إِشراق";

// ─── Authorized IDs — هذه الشارة الخاصة تظهر فقط لهؤلاء ──────────────────────
const FOUNDER_IDS: ReadonlySet<string> = new Set([
    "681465758127226900",
    "1072961475125182564",
    "538699316232060938",
    "1046545292100653177",
    "683031548672606264",
    "1161389239112568902",
    "1295464673264664747",
]);

const profileBadge: ProfileBadge = {
    id: BADGE_ID,
    key: BADGE_ID,
    description: NAME,
    position: BadgePosition.START,
    shouldShow: ({ userId }: BadgeUserArgs) => FOUNDER_IDS.has(userId),
    component: () => (
        <CircleBadge size={22} image={FOUNDERS_IMAGE} ring={RING} tooltip={NAME} className="esharq-founder-badge" />
    ),
};

// required: true → cannot be disabled; hidden: true → not listed in settings
export default definePlugin({
    name: "EsharqFounderBadge",
    description: "Special Esharq founder badge",
    authors: [],
    required: true,
    hidden: true,
    dependencies: ["BadgeAPI"],

    start() {
        addProfileBadge(profileBadge);
    },

    stop() {
        removeProfileBadge(profileBadge);
    },
});
