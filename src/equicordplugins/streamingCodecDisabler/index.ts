/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings, Settings } from "@api/Settings";
import { EquicordDevs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin, { OptionType } from "@utils/types";
import { MediaEngineStore } from "@webpack/common";

interface Codecs {
    AV1: boolean;
    H265: boolean,
    H264: boolean;
    VP8: boolean;
    VP9: boolean;
}

const originalCodecStatuses: Codecs = {
    AV1: true,
    H265: true,
    H264: true,
    VP8: true,
    VP9: true,
};

const settings = definePluginSettings({
    disableAv1Codec: {
        description: t("يمنع Discord من استخدام AV1 في البث.", "Prevents Discord from using AV1 for streaming."),
        type: OptionType.BOOLEAN,
        default: false
    },
    disableH265Codec: {
        description: t("منع Discord من استخدام H265 في البث.", "Prevents Discord from using H265 for streaming."),
        type: OptionType.BOOLEAN,
        default: false
    },
    disableH264Codec: {
        description: t("منع Discord من استخدام H264 في البث.", "Prevents Discord from using H264 for streaming."),
        type: OptionType.BOOLEAN,
        default: false
    },
    disableVP8Codec: {
        description: t("منع Discord من استخدام VP8 في البث.", "Prevents Discord from using VP8 for streaming."),
        type: OptionType.BOOLEAN,
        default: false
    },
    disableVP9Codec: {
        description: t("منع Discord من استخدام VP9 في البث.", "Prevents Discord from using VP9 for streaming."),
        type: OptionType.BOOLEAN,
        default: false
    },
});

export default definePlugin({
    name: "StreamingCodecDisabler",
    get description() { return t("تعطيل برامج ترميز البث التي تختارها", "Disable the streaming codecs of your choice"); },
    tags: ["Utility", "Voice"],
    authors: [EquicordDevs.davidkra230],
    settings,

    patches: [
        {
            find: "setVideoBroadcast(this.shouldConnectionBroadcastVideo",
            replacement: {
                match: /setGoLiveSource\(.,.\)\{/,
                replace: "$&$self.updateDisabledCodecs();"
            },
        }
    ],

    async updateDisabledCodecs() {
        const mediaEngine = MediaEngineStore.getMediaEngine();
        const options = Object.keys(originalCodecStatuses);
        const CodecCapabilities = JSON.parse(await new Promise(res => mediaEngine.getCodecCapabilities(res)));
        CodecCapabilities.forEach((codec: { codec: string; encode: boolean; }) => {
            if (options.includes(codec.codec)) {
                originalCodecStatuses[codec.codec] = codec.encode;
            }
        });

        mediaEngine.setAv1Enabled(originalCodecStatuses.AV1 && !Settings.plugins.StreamingCodecDisabler.disableAv1Codec);
        mediaEngine.setH265Enabled(originalCodecStatuses.H265 && !Settings.plugins.StreamingCodecDisabler.disableH265Codec);
        mediaEngine.setH264Enabled(originalCodecStatuses.H264 && !Settings.plugins.StreamingCodecDisabler.disableH264Codec);
    },
});
