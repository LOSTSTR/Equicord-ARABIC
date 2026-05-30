/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginI18n } from "@utils/i18n/types";

export default definePluginI18n({
    "description": {
        "ar": "يعرض ما تستمع إليه على Last.fm كحالة",
        "en": "Shows what you're listening to on Last.fm as a status."
    },
    "options": {
        "apiKey": {
            "ar": "مفتاح API خاص بـ Last.fm. اختياري لكن يُنصح به لتجنب تجاوز حد الطلبات المشتركة",
            "en": "Your Last.fm API key."
        },
        "username": {
            "ar": "اسم مستخدم Last.fm",
            "en": "Your Last.fm username."
        },
        "shareUsername": {
            "ar": "إظهار رابط ملف Last.fm الشخصي",
            "en": "Show your Last.fm profile button in your status."
        },
        "clickableLinks": {
            "ar": "جعل أسماء المقطع والفنان والألبوم روابط قابلة للنقر",
            "en": "Make album and song titles clickable."
        },
        "hideWithSpotify": {
            "ar": "إخفاء حضور Last.fm إذا كان Spotify يعمل",
            "en": "Hide Last.fm presence if Spotify is running."
        },
        "hideWithActivity": {
            "ar": "إخفاء حضور Last.fm إذا كان لديك أي حضور آخر",
            "en": "Hide Last.fm presence if you have another activity."
        },
        "statusName": {
            "ar": "نص الحالة المخصص. يمكنك استخدام المتغيرات: {artist} | {album} | {title}",
            "en": "Custom activity status name."
        },
        "statusDisplayType": {
            "ar": "إظهار اسم المقطع / الفنان في قائمة الأعضاء",
            "en": "What to show in the status — artist, album, or track."
        },
        "nameFormat": {
            "ar": "إظهار اسم الأغنية والفنان في اسم الحالة",
            "en": "How to format the activity name."
        },
        "useListeningStatus": {
            "ar": "إظهار حالة \"يستمع إلى\" بدلاً من \"يلعب\"",
            "en": "Use LISTENING status type instead of PLAYING."
        },
        "missingArt": {
            "ar": "عند غياب الألبوم أو صورة الألبوم",
            "en": "What to show when album art is missing."
        },
        "showLastFmLogo": {
            "ar": "إظهار شعار Last.fm بجانب غلاف الألبوم",
            "en": "Show the Last.fm logo as the small image."
        },
        "showAlbumCover": {
            "ar": "إظهار غلاف الألبوم. تعطيله سيعرض صورة بديلة. مفيد إذا كانت موسيقاك تحتوي على فن غير لائق",
            "en": "Show the album cover as the large image."
        }
    }
});
