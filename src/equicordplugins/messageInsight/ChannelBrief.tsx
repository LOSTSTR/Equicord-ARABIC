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

export function ChannelBriefModal({ modalProps, newMessages, totalCount, elapsed }: {
    modalProps: any;
    newMessages: any[];
    totalCount: number;
    elapsed: number;
}) {
    const showing = newMessages.length;
    const hasMore = totalCount > showing;

    return (
        <Modal
            {...modalProps}
            size="sm"
            title={t("ملخص القناة", "Channel Brief")}
        >
            <div className="vc-messageinsight-brief-body">
                <div className="vc-messageinsight-brief-header">
                    {hasMore
                        ? t(
                            `${totalCount} رسالة جديدة خلال ${elapsed} دقيقة — آخر ${showing}`,
                            `${totalCount} new messages in the last ${elapsed} min — showing last ${showing}`
                        )
                        : t(
                            `${totalCount} رسالة جديدة خلال ${elapsed} دقيقة`,
                            `${totalCount} new message${totalCount !== 1 ? "s" : ""} in the last ${elapsed} min`
                        )}
                </div>
                {newMessages.map((msg: any) => {
                    const sanitized = sanitizeContent(msg.content ?? "");
                    const hasAttachments = (msg.attachments?.length ?? 0) > 0;
                    const time = formatTime(msg.timestamp);

                    return (
                        <div key={msg.id} className="vc-messageinsight-brief-item">
                            <div className="vc-messageinsight-reply-header">
                                {msg.author && (
                                    <img
                                        className="vc-messageinsight-reply-avatar"
                                        src={avatarUrl(msg.author)}
                                        alt=""
                                    />
                                )}
                                <span className="vc-messageinsight-reply-author">
                                    {msg.author?.username ?? "Unknown"}
                                </span>
                                {time && <span className="vc-messageinsight-reply-time">{time}</span>}
                                {hasAttachments && (
                                    <span
                                        className="vc-messageinsight-reply-attachment"
                                        title={t("يحتوي على مرفقات", "Has attachments")}
                                    >
                                        📎
                                    </span>
                                )}
                            </div>
                            <div className="vc-messageinsight-brief-content-row">
                                <span className="vc-messageinsight-reply-content">
                                    {sanitized
                                        ? sanitized.slice(0, 120) + (sanitized.length > 120 ? "…" : "")
                                        : t("مرفق", "Attachment")}
                                </span>
                                <button
                                    className="vc-messageinsight-brief-jump"
                                    title={t("الانتقال إلى الرسالة", "Jump to message")}
                                    onClick={() => {
                                        modalProps.onClose();
                                        jumper.jumpToMessage({
                                            channelId: msg.channel_id,
                                            messageId: msg.id,
                                            flash: true,
                                            jumpType: "INSTANT",
                                        });
                                    }}
                                >
                                    ↗
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Modal>
    );
}
