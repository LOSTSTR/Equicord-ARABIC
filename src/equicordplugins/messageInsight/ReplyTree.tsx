/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { t } from "@utils/esharqI18n";
import { findByPropsLazy } from "@webpack";
import { Modal, React } from "@webpack/common";

import { avatarUrl, formatTime, sanitizeContent } from "./utils";

const jumper = findByPropsLazy("jumpToMessage");

export function ReplyTreeModal({ modalProps, message, replies }: {
    modalProps: any;
    message: any;
    replies: any[];
}) {
    const preview = sanitizeContent(message.content ?? "");

    return (
        <Modal
            {...modalProps}
            size="lg"
            title={t("الردود على الرسالة", "Message Replies")}
        >
            <div style={{ padding: "16px 0" }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
                    {t(
                        `الرسالة: "${preview.slice(0, 80)}${preview.length > 80 ? "…" : ""}"`,
                        `Message: "${preview.slice(0, 80)}${preview.length > 80 ? "…" : ""}"`
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
                        {replies.map((reply: any) => {
                            const sanitized = sanitizeContent(reply.content ?? "");
                            const hasAttachments = (reply.attachments?.length ?? 0) > 0;
                            const time = formatTime(reply.timestamp);

                            return (
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
                                    <div className="mi-reply-header">
                                        {reply.author && (
                                            <img
                                                className="mi-reply-avatar"
                                                src={avatarUrl(reply.author)}
                                                alt=""
                                            />
                                        )}
                                        <span className="mi-reply-author">
                                            {reply.author?.username ?? "Unknown"}
                                        </span>
                                        {time && <span className="mi-reply-time">{time}</span>}
                                        {hasAttachments && (
                                            <span
                                                className="mi-reply-attachment"
                                                title={t("يحتوي على مرفقات", "Has attachments")}
                                            >
                                                📎
                                            </span>
                                        )}
                                    </div>
                                    {(sanitized || hasAttachments) && (
                                        <span className="mi-reply-content">
                                            {sanitized
                                                ? sanitized.slice(0, 140) + (sanitized.length > 140 ? "…" : "")
                                                : t("مرفق", "Attachment")}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </>
                )}
            </div>
        </Modal>
    );
}
