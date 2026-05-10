/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Heading } from "@components/Heading";
import { Margins } from "@components/margins";
import { Paragraph } from "@components/Paragraph";
import { Logger } from "@utils/Logger";
import { OptionType } from "@utils/types";
import { findByCodeLazy, findByPropsLazy } from "@webpack";
import { MediaEngineStore, SearchableSelect, useEffect, useState } from "@webpack/common";

interface PickerProps {
    streamMediaSelection: any[];
    streamMedia: any[];
}

const getDesktopSources = findByCodeLazy("desktop sources");
const configModule = findByPropsLazy("getOutputVolume");
const log = new Logger("InstantScreenShare");

export const settings = definePluginSettings({
    streamMedia: {
        type: OptionType.COMPONENT,
        component: SettingSection,
    },
    includeVideoDevices: {
        type: OptionType.BOOLEAN,
        description: "تضمين أجهزة إدخال الفيديو (الكاميرات وكروت الالتقاط) في قائمة المصادر",
        default: false,
    },
    autoMute: {
        type: OptionType.BOOLEAN,
        description: "كتم الميكروفون تلقائياً عند الانضمام إلى قناة صوتية",
        default: false,
    },
    autoDeafen: {
        type: OptionType.BOOLEAN,
        description: "تعطيل الصوت تلقائياً عند الانضمام إلى قناة صوتية (يكتم الميكروفون أيضاً)",
        default: false,
    },
    instantScreenshare: {
        type: OptionType.BOOLEAN,
        description: "تفعيل ميزة مشاركة الشاشة التلقائية",
        default: true,
    },
    keybindScreenshare: {
        type: OptionType.BOOLEAN,
        description: "مشاركة الشاشة باختصار لوحة مفاتيح في إعدادات Discord",
        restartNeeded: true,
        default: false,
    },
    focusDiscord: {
        type: OptionType.BOOLEAN,
        description: "بدء مشاركة الشاشة بالاختصار فقط عندما تكون نافذة Discord محددة",
        default: true,
    },
    toolboxManagement: {
        type: OptionType.BOOLEAN,
        description: "تفعيل/تعطيل مشاركة الشاشة الفورية",
        default: true,
        hidden: true,
    },
});

export async function getCurrentMedia() {
    const media = MediaEngineStore.getMediaEngine();
    const sources = await getDesktopSources(media, ["screen", "window"], null) ?? [];

    if (settings.store.includeVideoDevices) {
        try {
            const videoDevices = Object.values(configModule.getVideoDevices() || {});
            const videoSources = videoDevices.map((device: any) => ({
                id: device.id,
                name: device.name,
                type: "video_device"
            }));
            sources.push(...videoSources);
        } catch (e) {
            new log.warn("Failed to get video devices:", e);
        }
    }

    const streamMedia = sources.find(screen => screen.id === settings.store.streamMedia);
    if (streamMedia) return streamMedia;

    log.error(`Stream Media "${settings.store.streamMedia}" not found. Resetting to default.`);

    settings.store.streamMedia = sources[0];
    return sources[0];
}

function StreamSimplePicker({ streamMediaSelection, streamMedia }: PickerProps) {
    const options = streamMediaSelection.map(screen => ({
        label: screen.name,
        value: screen.id,
        default: streamMediaSelection[0],
    }));

    return (
        <SearchableSelect
            placeholder="Select a media source to stream "
            maxVisibleItems={5}
            options={options}
            value={options.find(o => o.value === streamMedia)?.value}
            onChange={v => settings.store.streamMedia = v}
            closeOnSelect
        />
    );
}

function ScreenSetting() {
    const { streamMedia, includeVideoDevices } = settings.use(["streamMedia", "includeVideoDevices"]);
    const media = MediaEngineStore.getMediaEngine();
    const [streamMediaSelection, setStreamMediaSelection] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        async function fetchMedia() {
            setLoading(true);
            const sources = await getDesktopSources(media, ["screen", "window"], null) ?? [];

            if (includeVideoDevices) {
                try {
                    const videoDevices = Object.values(configModule.getVideoDevices() || {});
                    const videoSources = videoDevices.map((device: any) => ({
                        id: device.id,
                        name: device.name,
                        type: "video_device"
                    }));
                    sources.push(...videoSources);
                } catch (e) {
                    log.warn("Failed to get video devices:", e);
                }
            }

            if (active) {
                setStreamMediaSelection(sources);
                setLoading(false);
            }
        }
        fetchMedia();
        return () => { active = false; };
    }, [includeVideoDevices]);

    if (loading) return <Paragraph>Loading media sources...</Paragraph>;
    if (!streamMediaSelection.length) return <Paragraph>No Media found.</Paragraph>;

    return <StreamSimplePicker streamMediaSelection={streamMediaSelection} streamMedia={streamMedia} />;
}

function SettingSection() {
    return (
        <section>
            <Heading>Media source to stream</Heading>
            <Paragraph className={Margins.bottom20}>Resets to main screen if not found</Paragraph>
            <ScreenSetting />
        </section>
    );
}
