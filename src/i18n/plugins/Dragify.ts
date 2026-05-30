/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "اسحب المستخدمين أو القنوات أو السيرفرات إلى الدردشة لإدراج إشارات أو دعوات.",
        "en": "Drag users, channels, or servers into the chat to insert mentions or invites."
    },
    "options": {
        "userOutput": {
            "ar": "ناتج إفلات المستخدم.",
            "en": "Output format when dragging a user."
        },
        "channelOutput": {
            "ar": "ناتج إفلات القناة.",
            "en": "Output format when dragging a channel."
        },
        "inviteExpireAfter": {
            "ar": "انتهاء صلاحية الدعوة.",
            "en": "Invite expiry duration."
        },
        "inviteMaxUses": {
            "ar": "الحد الأقصى لاستخدام الدعوة.",
            "en": "Maximum invite uses."
        },
        "inviteTemporaryMembership": {
            "ar": "منح عضوية مؤقتة.",
            "en": "Create temporary membership invites."
        },
        "reuseExistingInvites": {
            "ar": "إعادة استخدام الدعوة الموجودة بدلاً من إنشاء دعوة جديدة.",
            "en": "Reuse existing invites when possible."
        },
        "allowChatBodyDrop": {
            "ar": "السماح بالإفلات في جسم الدردشة الرئيسي لإدراج نص.",
            "en": "Allow dropping into the chat body (not just the input box)."
        }
    }
});
