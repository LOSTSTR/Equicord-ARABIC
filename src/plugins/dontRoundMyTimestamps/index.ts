/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
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

import { Devs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin from "@utils/types";
import { moment } from "@webpack/common";

export default definePlugin({
    name: "DontRoundMyTimestamps",
    authors: [Devs.Lexi],
    get description() { return t("يقرّب الطوابع الزمنية النسبية دائمًا للأسفل، فتصبح 7.6 سنة 7 سنوات بدلًا من 8", "Always rounds relative timestamps down, so 7.6 years becomes 7 years instead of 8"); },
    tags: ["Appearance", "Utility"],

    start() {
        moment.relativeTimeRounding(Math.floor);
    },

    stop() {
        moment.relativeTimeRounding(Math.round);
    }
});
