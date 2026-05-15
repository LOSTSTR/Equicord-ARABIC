/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { UserAreaButton, UserAreaRenderProps } from "@api/UserArea";
import ErrorBoundary from "@components/ErrorBoundary";
import { closeModal, openModal } from "@utils/modal";
import { React, useEffect, useState } from "@webpack/common";

import { CustomStreamPreviewState } from "../state";
import { ScreenSharePreviewImageModal } from "./ScreenSharePreviewImageModal";
import { StreamPreviewChangeIcon } from "./StreamPreviewChangeIcon";


export function SendCustomScreenSharePreviewImageButton({ hideTooltips, iconForeground }: UserAreaRenderProps) {
    const [isStreaming, setIsStreaming] = useState(() => {
        return CustomStreamPreviewState
            .getState()
            .isStreaming;
    });

    useEffect(() => {
        return CustomStreamPreviewState.subscribeToField(
            "isStreaming",
            setIsStreaming
        );
    }, []);

    if (!isStreaming) return null;

    const openScreenSharePreviewImageModal = () => {
        const key = openModal(modalProps => (
            <ScreenSharePreviewImageModal
                modalProps={modalProps}
                close={() => closeModal(key)}
            />
        ));
    };

    return (
        <ErrorBoundary noop>
            <UserAreaButton
                tooltipText={hideTooltips ? void 0 : "معاينة مشاركة الشاشة"}
                icon={<StreamPreviewChangeIcon className={iconForeground} />}
                onClick={openScreenSharePreviewImageModal}
            />
        </ErrorBoundary>
    );
}
