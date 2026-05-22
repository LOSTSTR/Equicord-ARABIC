/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { AudioPlayerInterface, createAudioPlayer } from "@api/AudioPlayer";
import { definePluginSettings } from "@api/Settings";
import { Devs, EquicordDevs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin, { OptionType } from "@utils/types";

let clickCount = 0;
let croissant: AudioPlayerInterface | null = null;

function play() {
    const triggerAmount = settings.store.amount;
    clickCount++;

    if (clickCount % triggerAmount === 0) {
        croissant?.play();
        clickCount = 0;
    }
}

const settings = definePluginSettings({
    amount: {
        type: OptionType.NUMBER,
        get description() { return t("عدد النقرات اللازمة لتشغيل الصوت", "Number of clicks required to trigger the sound"); },
        default: 10,
    }
});

export default definePlugin({
    name: "Equissant",
    get description() { return t("يُشغّل صوت الكرواسون عند كل عدد محدد من النقرات :trolley:", "Plays a croissant sound every N clicks :trolley:"); }
    tags: ["Fun"],
    authors: [EquicordDevs.SomeAspy, Devs.thororen],
    dependencies: ["AudioPlayerAPI"],
    settings,
    start() {
        croissant = createAudioPlayer("https://github.com/Equicord/Equibored/raw/main/sounds/equissant/croissant.mp3", { persistent: true });
        document.addEventListener("click", play);
    },
    stop() {
        croissant?.delete();
        document.removeEventListener("click", play);
    }
});
