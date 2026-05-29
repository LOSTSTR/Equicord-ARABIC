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

import { Devs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "DisableCallIdle",
    get description() { return t("يمنع الطرد التلقائي من مكالمة صوتية في الرسائل الخاصة بعد 3 دقائق ونقلك إلى قناة AFK.", "Prevents automatic disconnection from a private voice call after 3 minutes of inactivity and being moved to the AFK channel."); },
    tags: ["Voice", "Utility"],
    authors: [Devs.Nuckyz],
    patches: [
        {
            find: "this.idleTimeout.start(",
            replacement: {
                match: /this\.idleTimeout\.(start|stop)/g,
                replace: "$self.noop"
            }
        },
        {
            find: "handleIdleUpdate(){",
            replacement: {
                match: "handleIdleUpdate(){",
                replace: "handleIdleUpdate(){return;"
            }
        }
    ],

    noop() { }
});
