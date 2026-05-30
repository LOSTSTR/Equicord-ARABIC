/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يعرض إحصائيات نشاطك كـ RPC",
        "en": "Displays your activity statistics as an RPC."
    },
    "options": {
        "assetURL": {
            "ar": "الصورة المستخدمة في RPC. يُستخدم صورة ملفك الشخصي إذا تُركت فارغة",
            "en": "Image used in the RPC. Uses your profile picture if left empty."
        },
        "RPCTitle": {
            "ar": "عنوان RPC",
            "en": "RPC title."
        },
        "statDisplay": {
            "ar": "ما الذي يجب أن يعرضه RPC؟ (يمكنك عرض سطر واحد فقط)",
            "en": "What the RPC should display (only one line can be shown at a time)."
        },
        "lastFMApiKey": {
            "ar": "مفتاح API الخاص بـ last.fm",
            "en": "Your Last.fm API key."
        },
        "lastFMUsername": {
            "ar": "اسم المستخدم الخاص بـ last.fm",
            "en": "Your Last.fm username."
        },
        "albumCoverImage": {
            "ar": "هل تريد استخدام غلاف الألبوم كصورة RPC؟ (إذا كنت قد اخترت عرض last.fm)",
            "en": "Use the album cover as the RPC image (when Last.fm display is selected)."
        },
        "lastFMStatFormat": {
            "ar": "كيف يجب تنسيق إحصائية last.fm؟ يُستبدل $album باسم الألبوم، و$artist باسم الفنان",
            "en": "How to format the Last.fm stat. $album is replaced with the album name and $artist with the artist name."
        }
    }
});
