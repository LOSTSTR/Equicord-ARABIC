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

import { definePluginSettings } from "@api/Settings";
import { t } from "@utils/esharqI18n";
import { OptionType } from "@utils/types";

export default definePluginSettings({
    notices: {
        type: OptionType.BOOLEAN,
        description: t("اعرض إشعاراً في أعلى الشاشة عند الإزالة (مفيد لعدم تفويت أي تنبيه).", "Show a notice at the top of the screen when removed (useful for not missing any notifications)."),
        default: false
    },
    offlineRemovals: {
        type: OptionType.BOOLEAN,
        description: t("إشعارك عند بدء Discord إذا تمت إزالتك أثناء عدم الاتصال.", "Notify you on Discord startup if you were removed while offline."),
        default: true
    },
    friends: {
        type: OptionType.BOOLEAN,
        description: t("إشعارك عند إزالتك من قائمة أصدقاء شخص ما", "Notify you when you are removed from someone's friend list"),
        default: true
    },
    friendRequestCancels: {
        type: OptionType.BOOLEAN,
        description: t("إشعارك عند إلغاء طلب صداقة", "Notify you when a friend request is cancelled"),
        default: true
    },
    servers: {
        type: OptionType.BOOLEAN,
        description: t("إشعارك عند إزالتك من سيرفر", "Notify you when you are removed from a server"),
        default: true
    },
    groups: {
        type: OptionType.BOOLEAN,
        description: t("إشعارك عند إزالتك من مجموعة محادثة", "Notify you when you are removed from a group conversation"),
        default: true
    }
});
