/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { classNameFactory } from "@utils/css";
import { t } from "@utils/esharqI18n";
import { Message, RenderModalProps } from "@vencord/discord-types";
import { findByPropsLazy } from "@webpack";
import { Modal, React } from "@webpack/common";

import { avatarUrl, formatTime, sanitizeContent } from "./utils";

const cl = classNameFactory("vc-messageinsight-");
const jumper = findByPropsLazy("jumpToMessage");

export function ReplyTreeModal({ modalProps, message, replies }: {
    modalProps: RenderModalProps;
    message: Message;
    replies: Message[];
}) {
    const preview = sanitizeContent(message.content ?? "");

    return (
        <Modal
            {...modalProps}
            size="lg"
            title={t("الردود على الرسالة", "Message Replies")}
        >
            <div className={cl("modal-body")}>
                <div className={cl("meta-text")}>
                    {t(
                        `الرسالة: "${preview.slice(0, 80)}${preview.length > 80 ? "…" : ""}"`,
                        `Message: "${preview.slice(0, 80)}${preview.length > 80 ? "…" : ""}"`
                    )}
                </div>
                {replies.length === 0 ? (
                    <p className={cl("empty-text")}>
                        {t(
                            "لا توجد ردود محملة على هذه الرسالة في القناة الحالية.",
                            "No loaded replies found for this message in the current channel."
                        )}
                    </p>
                ) : (
                    <>
                        <div className={cl("reply-count")}>
                            {t(`${replies.length} رد`, `${replies.length} repl${replies.length === 1 ? "y" : "ies"}`)}
                        </div>
                        {replies.map(reply => {
                            const sanitized = sanitizeContent(reply.content ?? "");
                            const hasAttachments = (reply.attachments?.length ?? 0) > 0;
                            const time = formatTime(reply.timestamp);

                            return (
                                <button
                                    key={reply.id}
                                    className={cl("reply-item")}
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
                                    <div className={cl("reply-header")}>
                                        {reply.author && (
                                            <img
                                                className={cl("reply-avatar")}
                                                src={avatarUrl(reply.author)}
                                                alt=""
                                            />
                                        )}
                                        <span className={cl("reply-author")}>
                                            {reply.author?.username ?? "Unknown"}
                                        </span>
                                        {time && <span className={cl("reply-time")}>{time}</span>}
                                        {hasAttachments && (
                                            <span
                                                className={cl("reply-attachment")}
                                                title={t("يحتوي على مرفقات", "Has attachments")}
                                            >
                                                📎
                                            </span>
                                        )}
                                    </div>
                                    {(sanitized || hasAttachments) && (
                                        <span className={cl("reply-content")}>
                                            {sanitized
                                                ? sanitized.slice(0, 140) + (sanitized.length > 140 ? "…" : "")
                                                : t("مرفق", "Attachment")}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </>
                )}
            </div>
        </Modal>
    );
}
