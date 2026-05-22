/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { UserAreaRenderProps } from "@api/UserArea";
import { t } from "@utils/esharqI18n";
import definePlugin from "@utils/types";
import { UserStore } from "@webpack/common";

import { SendCustomScreenSharePreviewImageButton } from "./components/SendCustomScreenSharePreviewImageButton";
import { StreamPreviewChangeIcon } from "./components/StreamPreviewChangeIcon";
import { CustomStreamPreviewState } from "./state";
import { StreamCreateEvent, StreamDeleteEvent } from "./types";
import { parseStreamKey, stopSendingScreenSharePreview } from "./utilities";


export default definePlugin({
    name: "CustomScreenSharePreview",
    get description() { return t("يضيف إمكانية اختيار صورتك الخاصة كمعاينة لمشاركة الشاشة.", "Adds the ability to choose your own image as a screen share preview."); },
    tags: ["Voice", "Utility"],
    authors: [{
        name: "no one",
        id: 238416205193847602n,
    }],
    dependencies: ["UserAreaAPI"],

    userAreaButton: {
        icon: StreamPreviewChangeIcon,
        render: (props: UserAreaRenderProps) => SendCustomScreenSharePreviewImageButton(props),
    },

    flux: {
        async STREAM_CREATE({ streamKey }: StreamCreateEvent): Promise<void> {
            const { userId } = parseStreamKey(streamKey);

            if (userId !== UserStore.getCurrentUser().id) {
                return;
            }

            CustomStreamPreviewState.setState({
                isStreaming: true,
            });
        },
        async STREAM_DELETE({ streamKey }: StreamDeleteEvent): Promise<void> {
            const { userId } = parseStreamKey(streamKey);

            if (userId !== UserStore.getCurrentUser().id) {
                return;
            }

            CustomStreamPreviewState.setState({
                isStreaming: false,
            });
            stopSendingScreenSharePreview();
        },
    },
});
