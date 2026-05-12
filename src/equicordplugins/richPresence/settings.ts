/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

import { SettingsPanel } from "./SettingsPanel";
import { NameFormat } from "./types";

export let onServiceChange: (() => void) | null = null;
export function setOnServiceChange(fn: (() => void) | null) { onServiceChange = fn; }

export const settings = definePluginSettings({
    enabled: {
        description: "تفعيل خدمات Rich Presence.",
        type: OptionType.BOOLEAN,
        default: true,
        restartNeeded: false,
        onChange: () => onServiceChange?.(),
    },
    serviceSettings: {
        type: OptionType.COMPONENT,
        description: "إعداد الخدمة.",
        component: SettingsPanel,
    },

    // Per-service enable toggles
    abs_enabled: {
        description: "تفعيل حضور AudioBookShelf.",
        type: OptionType.BOOLEAN,
        default: false,
        hidden: true,
        onChange: () => onServiceChange?.(),
    },
    tosu_enabled: {
        description: "تفعيل حضور osu! (tosu).",
        type: OptionType.BOOLEAN,
        default: false,
        hidden: true,
        onChange: () => onServiceChange?.(),
    },
    sfm_enabled: {
        description: "تفعيل حضور stats.fm.",
        type: OptionType.BOOLEAN,
        default: false,
        hidden: true,
        onChange: () => onServiceChange?.(),
    },
    jf_enabled: {
        description: "تفعيل حضور Jellyfin.",
        type: OptionType.BOOLEAN,
        default: false,
        hidden: true,
        onChange: () => onServiceChange?.(),
    },
    lb_enabled: {
        description: "تفعيل حضور ListenBrainz.",
        type: OptionType.BOOLEAN,
        default: false,
        hidden: true,
        onChange: () => onServiceChange?.(),
    },
    gr_enabled: {
        description: "تفعيل حضور Gensokyo Radio.",
        type: OptionType.BOOLEAN,
        default: false,
        hidden: true,
        onChange: () => onServiceChange?.(),
    },

    // AudioBookShelf
    abs_serverUrl: {
        description: "رابط خادم AudioBookShelf.",
        type: OptionType.STRING,
        default: "",
        hidden: true,
    },
    abs_username: {
        description: "اسم مستخدم AudioBookShelf.",
        type: OptionType.STRING,
        default: "",
        hidden: true,
    },
    abs_password: {
        description: "كلمة مرور AudioBookShelf.",
        type: OptionType.STRING,
        default: "",
        hidden: true,
    },

    // stats.fm
    sfm_username: {
        description: "اسم مستخدم Stats.fm.",
        type: OptionType.STRING,
        default: "",
        hidden: true,
    },
    sfm_shareUsername: {
        description: "إظهار رابط الملف الشخصي في stats.fm.",
        type: OptionType.BOOLEAN,
        default: false,
        hidden: true,
    },
    sfm_shareSong: {
        description: "إظهار رابط الأغنية في stats.fm.",
        type: OptionType.BOOLEAN,
        default: true,
        hidden: true,
    },
    sfm_hideWithSpotify: {
        description: "إخفاء حضور stats.fm إذا كان Spotify يعمل.",
        type: OptionType.BOOLEAN,
        default: false,
        hidden: true,
    },
    sfm_hideWithExternalRPC: {
        description: "إخفاء حضور stats.fm إذا كان RPC خارجي يعمل.",
        type: OptionType.BOOLEAN,
        default: false,
        hidden: true,
    },
    sfm_statusName: {
        description: "نص الحالة المخصص.",
        type: OptionType.STRING,
        default: "Stats.fm",
        hidden: true,
    },
    sfm_nameFormat: {
        description: "تنسيق الاسم.",
        type: OptionType.SELECT,
        options: [
            { label: "Use custom status name", value: NameFormat.StatusName, default: true },
            { label: "Use format 'artist - song'", value: NameFormat.ArtistFirst },
            { label: "Use format 'song - artist'", value: NameFormat.SongFirst },
            { label: "Use artist name only", value: NameFormat.ArtistOnly },
            { label: "Use song name only", value: NameFormat.SongOnly },
            { label: "Use album name", value: NameFormat.AlbumName },
        ],
        hidden: true,
    },
    sfm_useListeningStatus: {
        description: "إظهار حالة الاستماع.",
        type: OptionType.BOOLEAN,
        default: true,
        hidden: true,
    },
    sfm_missingArt: {
        description: "بديل عند غياب الصورة الفنية.",
        type: OptionType.SELECT,
        options: [
            { label: "Use large Stats.fm logo", value: "StatsFmLogo", default: true },
            { label: "Use generic placeholder", value: "placeholder" },
        ],
        hidden: true,
    },
    sfm_showLogo: {
        description: "إظهار شعار Stats.fm بجانب صورة الألبوم.",
        type: OptionType.BOOLEAN,
        default: true,
        hidden: true,
    },
    sfm_alwaysHideArt: {
        description: "تعطيل تنزيل صور الألبومات.",
        type: OptionType.BOOLEAN,
        default: false,
        hidden: true,
    },

    // Jellyfin
    jf_serverUrl: {
        description: "رابط خادم Jellyfin.",
        type: OptionType.STRING,
        default: "",
        hidden: true,
    },
    jf_apiKey: {
        description: "مفتاح API لـ Jellyfin.",
        type: OptionType.STRING,
        default: "",
        hidden: true,
    },
    jf_userId: {
        description: "معرف مستخدم Jellyfin.",
        type: OptionType.STRING,
        default: "",
        hidden: true,
    },
    jf_nameDisplay: {
        description: "تنسيق عرض الاسم.",
        type: OptionType.SELECT,
        options: [
            { label: "Series/Movie Name", value: "default", default: true },
            { label: "Series - Episode/Track/Movie Name", value: "full" },
            { label: "Custom", value: "custom" },
        ],
        hidden: true,
    },
    jf_customName: {
        description: "قالب الاسم المخصص.",
        type: OptionType.STRING,
        default: "",
        hidden: true,
    },
    jf_coverType: {
        description: "نوع الغلاف لمسلسلات التلفزيون.",
        type: OptionType.SELECT,
        options: [
            { label: "Series Cover", value: "series", default: true },
            { label: "Episode Cover", value: "episode" },
        ],
        hidden: true,
    },
    jf_episodeFormat: {
        description: "تنسيق رقم الحلقة.",
        type: OptionType.SELECT,
        options: [
            { label: "S01E01", value: "long", default: true },
            { label: "1x01", value: "short" },
            { label: "Season 1 Episode 1", value: "fulltext" },
        ],
        hidden: true,
    },
    jf_showEpisodeName: {
        description: "إظهار اسم الحلقة بعد معلومات الموسم/الحلقة.",
        type: OptionType.BOOLEAN,
        default: false,
        hidden: true,
    },
    jf_overrideType: {
        description: "تجاوز نوع الحضور الغني.",
        type: OptionType.SELECT,
        options: [
            { label: "Off", value: "off", default: true },
            { label: "Listening", value: "2" },
            { label: "Playing", value: "0" },
            { label: "Streaming", value: "1" },
            { label: "Watching", value: "3" },
        ],
        hidden: true,
    },
    jf_showPausedState: {
        description: "إظهار الحضور عند إيقاف الوسائط مؤقتاً.",
        type: OptionType.BOOLEAN,
        default: true,
        hidden: true,
    },
    jf_privacyMode: {
        description: "إخفاء تفاصيل الوسائط.",
        type: OptionType.BOOLEAN,
        default: false,
        hidden: true,
    },

    // ListenBrainz
    lb_username: {
        description: "اسم مستخدم ListenBrainz.",
        type: OptionType.STRING,
        default: "",
        hidden: true,
    },
    lb_mbContact: {
        description: "معلومات الاتصال بـ MusicBrainz لوكيل المستخدم.",
        type: OptionType.STRING,
        default: "",
        hidden: true,
    },
    lb_shareUsername: {
        description: "إظهار رابط الملف الشخصي في ListenBrainz.",
        type: OptionType.BOOLEAN,
        default: false,
        hidden: true,
    },
    lb_shareSong: {
        description: "إظهار رابط الأغنية في ListenBrainz.",
        type: OptionType.BOOLEAN,
        default: true,
        hidden: true,
    },
    lb_hideWithSpotify: {
        description: "إخفاء الحضور إذا كان Spotify يعمل.",
        type: OptionType.BOOLEAN,
        default: true,
        hidden: true,
    },
    lb_hideWithActivity: {
        description: "إخفاء الحضور إذا كان أي حضور آخر موجوداً.",
        type: OptionType.BOOLEAN,
        default: false,
        hidden: true,
    },
    lb_useTimeBar: {
        description: "استخدام مدة المقطع لعرض شريط الوقت.",
        type: OptionType.BOOLEAN,
        default: true,
        hidden: true,
    },
    lb_statusName: {
        description: "نص الحالة المخصص.",
        type: OptionType.STRING,
        default: "some music",
        hidden: true,
    },
    lb_nameFormat: {
        description: "تنسيق الاسم.",
        type: OptionType.SELECT,
        options: [
            { label: "Use custom status name", value: NameFormat.StatusName, default: true },
            { label: "Use format 'artist - song'", value: NameFormat.ArtistFirst },
            { label: "Use format 'song - artist'", value: NameFormat.SongFirst },
            { label: "Use artist name only", value: NameFormat.ArtistOnly },
            { label: "Use song name only", value: NameFormat.SongOnly },
            { label: "Use album name", value: NameFormat.AlbumName },
        ],
        hidden: true,
    },
    lb_useListeningStatus: {
        description: "إظهار حالة الاستماع.",
        type: OptionType.BOOLEAN,
        default: true,
        hidden: true,
    },
    lb_missingArt: {
        description: "بديل عند غياب الصورة الفنية.",
        type: OptionType.SELECT,
        options: [
            { label: "Use large ListenBrainz logo", value: "listenbrainzLogo", default: true },
            { label: "Use generic placeholder", value: "placeholder" },
        ],
        hidden: true,
    },
    lb_useLogo: {
        description: "إظهار شعار ListenBrainz على صورة الألبوم.",
        type: OptionType.BOOLEAN,
        default: true,
        hidden: true,
    },

    // Gensokyo Radio
    gr_refreshInterval: {
        description: "فترة التحديث بالثواني.",
        type: OptionType.SLIDER,
        markers: [1, 2, 2.5, 3, 5, 10, 15],
        default: 15,
        hidden: true,
    },
});

export type SettingsStore = typeof settings["store"];
