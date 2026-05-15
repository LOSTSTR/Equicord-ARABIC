/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Flex } from "@components/Flex";
import { ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalProps, ModalRoot, ModalSize } from "@utils/modal";
import { Button, Forms, React, Text, useCallback, useEffect, useMemo, useState } from "@webpack/common";

import { CustomStreamPreviewState } from "../state";
import { imageFileToStreamPreview, sendCustomPreview, stopSendingScreenSharePreview } from "../utilities";

export function ScreenSharePreviewImageModal({ modalProps, close }: { modalProps: ModalProps; close: () => void; }) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isStreamPreviewSending, setIsStreamPreviewSending] = useState(() => {
        return CustomStreamPreviewState
            .getState()
            .isSendingCustomStreamPreview;
    });

    useEffect(() => {
        return CustomStreamPreviewState.subscribeToField(
            "isSendingCustomStreamPreview",
            setIsStreamPreviewSending
        );
    }, []);

    const uploadButtonDisabled = useMemo(() => previewImage === null, [previewImage]);

    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        const base64 = await imageFileToStreamPreview(file);
        setPreviewImage(base64);
    }, []);

    const uploadButtonOnClick = useCallback(() => {
        if (previewImage) {
            sendCustomPreview(previewImage);
        }
        close();
    }, [previewImage, close]);

    const stopReUploadPreviewButtonOnClick = useCallback(() => {
        stopSendingScreenSharePreview();
        close();
    }, [close]);

    const uploadImageButtonOnClick = useCallback(() => {
        const input = document.getElementById("screen-share-preview-image-upload") as HTMLInputElement;
        if (input) {
            input.click();
        }
    }, []);

    return (
        <ModalRoot {...modalProps} size={ModalSize.SMALL}>
            <ModalHeader>
                <Text variant="heading-lg/semibold" style={{ flexGrow: 1 }}>معاينة مشاركة الشاشة</Text>
                <ModalCloseButton onClick={close} />
            </ModalHeader>

            <ModalContent>
                <Forms.FormText>
                    اختر صورة لاستخدامها كمعاينة لمشاركة شاشتك.
                </Forms.FormText>

                <br />

                <Forms.FormText>
                    ملاحظة: يجب تفعيل "إخفاء معاينة البث" في إعدادات البث، وإلا لن تظهر الصورة المخصصة.
                </Forms.FormText>

                <br />

                <Forms.FormText>
                    ملاحظة: يمكن تحديث صورة المعاينة مرة واحدة كل 60 ثانية كحد أقصى (قيد Discord).
                </Forms.FormText>

                <Button
                    style={{ marginTop: "1rem", marginBottom: "1rem" }}
                    onClick={uploadImageButtonOnClick}
                >
                    اختيار صورة
                </Button>
                <input
                    id="screen-share-preview-image-upload"
                    style={{ display: "none" }}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                {previewImage && (
                    <>
                        <Forms.FormDivider style={{ marginTop: "1rem", marginBottom: "1rem" }} />

                        <img
                            src={previewImage}
                            alt="معاينة"
                            style={{ marginTop: "1rem", marginBottom: "1rem", maxWidth: "100%" }}
                        />
                    </>
                )}
            </ModalContent>

            <ModalFooter>
                <Flex style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
                    {isStreamPreviewSending && (
                        <Button
                            disabled={!isStreamPreviewSending}
                            color={Button.Colors.RED}
                            onClick={stopReUploadPreviewButtonOnClick}
                        >
                            إيقاف إعادة إرسال المعاينة
                        </Button>
                    )}

                    <Button
                        style={{ marginLeft: "auto" }}
                        disabled={uploadButtonDisabled}
                        onClick={uploadButtonOnClick}
                    >
                        رفع
                    </Button>
                </Flex>
            </ModalFooter>
        </ModalRoot>
    );
}
