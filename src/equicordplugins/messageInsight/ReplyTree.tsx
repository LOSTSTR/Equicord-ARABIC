/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { t } from "@utils/esharqI18n";
import { findByPropsLazy } from "@webpack";
import { Modal, React } from "@webpack/common";

const jumper = findByPropsLazy("jumpToMessage");

export function ReplyTreeModal({ modalProps, message, replies }: {
    modalProps: any;
    message: any;
    replies: any[];
}) {
    return (
        <Modal
            {...modalProps}
            size="lg"
            title={t("الردود على الرسالة", "Message Replies")}
        >
            <div style={{ padding: "16px 0" }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
                    {t(
                        `الرسالة: "${message.content?.slice(0, 80)}${(message.content?.length ?? 0) > 80 ? "…" : ""}"`,
                        `Message: "${message.content?.slice(0, 80)}${(message.content?.length ?? 0) > 80 ? "…" : ""}"`
                    )}
                </div>
                {replies.length === 0 ? (
                    <p style={{ color: "var(--text-muted)" }}>
                        {t(
                            "لا توجد ردود محملة على هذه الرسالة في القناة الحالية.",
                            "No loaded replies found for this message in the current channel."
                        )}
                    </p>
                ) : (
                    <>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>
                            {t(`${replies.length} رد`, `${replies.length} repl${replies.length === 1 ? "y" : "ies"}`)}
                        </div>
                        {replies.map((reply: any) => (
                            <div
                                key={reply.id}
                                className="mi-reply-item"
                                onClick={() => {
                                    modalProps.onClose();
                                    jumper.jumpToMessage({
                                        channelId: reply.channel_id,
                                        messageId: reply.id,
                                        flash: true,
                                        jumpType: "INSTANT",
                                    });
                                }}
                            >
                                <span className="mi-reply-author">
                                    {reply.author?.username ?? "Unknown"}
                                </span>
                                <span className="mi-reply-content">
                                    {reply.content?.slice(0, 140)}
                                    {(reply.content?.length ?? 0) > 140 ? "…" : ""}
                                </span>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </Modal>
    );
}
