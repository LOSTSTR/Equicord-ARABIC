/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { DonorBadge } from "./types";

// ─── سجلّ شارات المتبرعين ─────────────────────────────────────────────────────
// لا متبرّعون بعد. عند إضافة متبرّع: أنشئ ملف صورته وملف بياناته داخل donors/
// (مثل founders.image.ts + founders.ts سابقاً)، ثم استورد البيانات هنا وأضِفها
// إلى المصفوفة. مثال:
//   import someDonor from "./donors/someDonor";
//   export const DONOR_BADGES = [someDonor];
//
// ملاحظة: شارة المؤسِّسين الخاصة (الكأس) ليست هنا — هي في
// src/equicordplugins/_core/founderBadge/ (منفصلة عن المتبرعين).

// TODO(placeholder): فارغة بشكل مقصود — ما دامت فارغة فإن EsharqDonorBadges
// لا تسجّل أي شارة (start()/stop() بلا أثر). تُملأ عند انضمام متبرّعين.
export const DONOR_BADGES: readonly DonorBadge[] = [];
