/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./styles.css";

import { createAudioPlayer } from "@api/AudioPlayer";
import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin, { OptionType } from "@utils/types";
import { createRoot, FluxDispatcher, useCallback, useEffect, useState } from "@webpack/common";
import { Root } from "react-dom/client";

let jumpscareRoot: Root | undefined;

const settings = definePluginSettings({
    imageSource: {
        type: OptionType.STRING,
        description: t("رابط صورة المفاجأة المرعبة", "Jumpscare image URL"),
        default: "https://github.com/Equicord/Equibored/blob/main/icons/jumpscare/troll.gif?raw=true"
    },
    audioSource: {
        type: OptionType.STRING,
        description: t("رابط صوت المفاجأة المرعبة", "Jumpscare audio URL"),
        default: "https://github.com/Equicord/Equibored/raw/main/sounds/jumpscare/trollolol.mp3?raw=true"
    },
    chance: {
        type: OptionType.NUMBER,
        description: t("احتمالية حدوث المفاجأة المرعبة (1 من X، مثال: 100 = 1/100 أي 1%، 50 = 1/50 أي 2%، إلخ)", "Jumpscare chance (1 in X, example: 100 = 1/100 i.e. 1%, 50 = 1/50 i.e. 2%, etc)"),
        default: 1000
    }
});

function getJumpscareRoot(): Root {
    if (!jumpscareRoot) {
        const element = document.createElement("div");
        element.id = "jumpscare-root";
        element.classList.add("jumpscare-root");
        document.body.append(element);
        jumpscareRoot = createRoot(element);
    }

    return jumpscareRoot;
}

export default definePlugin({
    name: "Jumpscare",
    get description() { return t("يضيف احتمالية قابلة للإعداد لإخافتك في كل مرة تفتح فيها قناة. مستوحى من Geometry Dash Mega Hack", "Adds a configurable chance to jumpscare you every time you open a channel. Inspired by Geometry Dash Mega Hack"); },
    tags: ["Fun"],
    authors: [Devs.surgedevs],
    dependencies: ["AudioPlayerAPI"],
    settings,

    start() {
        getJumpscareRoot().render(
            <this.JumpscareComponent />
        );
    },

    stop() {
        jumpscareRoot?.unmount();
        jumpscareRoot = undefined;
    },

    JumpscareComponent() {
        const [isPlaying, setIsPlaying] = useState(false);
        const jumpscareAudio = createAudioPlayer(settings.store.audioSource, { volume: 100, onEnded: () => { setIsPlaying(false); } });

        const jumpscare = useCallback(event => {
            if (isPlaying) return;

            const chance = 1 / settings.store.chance;
            if (Math.random() > chance) return;

            setIsPlaying(true);
            jumpscareAudio.play();
        }, [isPlaying]);

        useEffect(() => {
            FluxDispatcher.subscribe("CHANNEL_SELECT", jumpscare);

            return () => {
                FluxDispatcher.unsubscribe("CHANNEL_SELECT", jumpscare);
            };
        }, [jumpscare]);

        return <img className={`jumpscare-img ${isPlaying ? "jumpscare-animate" : ""}`} src={settings.store.imageSource} />;
    }
});
