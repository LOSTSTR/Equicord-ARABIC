/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./styles.css";

import { addMessagePopoverButton, removeMessagePopoverButton } from "@api/MessagePopover";
import ErrorBoundary from "@components/ErrorBoundary";
import { EquicordDevs } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import definePlugin from "@utils/types";
import { ChannelStore, openModal, React, showToast, Toasts } from "@webpack/common";

import { BookmarksModal } from "./BookmarksModal";
import { bookmarksCache, clearCache, getBookmarks, saveBookmarks } from "./store";
import type { Bookmark } from "./types";

function BookmarkIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
    );
}

function BookmarkFilledIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
    );
}

function openBookmarksModal() {
    openModal(props => (
        <ErrorBoundary>
            <BookmarksModal modalProps={props} />
        </ErrorBoundary>
    ));
}

async function addBookmark(message: any) {
    const bookmarks = await getBookmarks();
    const channel = ChannelStore.getChannel(message.channel_id);

    const bookmark: Bookmark = {
        id: `${message.id}_${Date.now()}`,
        messageId: message.id,
        channelId: message.channel_id,
        guildId: channel?.guild_id,
        authorId: message.author?.id ?? "",
        authorUsername: message.author?.username ?? "Unknown",
        authorAvatar: message.author?.avatar ?? null,
        content: message.content ?? "",
        attachmentCount: message.attachments?.length ?? 0,
        timestamp: message.timestamp?.toString() ?? new Date().toISOString(),
        category: "general",
        savedAt: Date.now(),
    };

    bookmarks.push(bookmark);
    await saveBookmarks(bookmarks);

    showToast(
        t("✓ تمت إضافة الإشارة المرجعية", "✓ Bookmark saved"),
        Toasts.Type.SUCCESS
    );
}

function renderBookmarkButton(message: any) {
    const isBookmarked = bookmarksCache?.some(b => b.messageId === message.id) ?? false;

    return {
        key: "mb-bookmark",
        label: isBookmarked
            ? t("عرض الإشارات المرجعية", "View Bookmarks")
            : t("إضافة إشارة مرجعية", "Add Bookmark"),
        icon: isBookmarked ? BookmarkFilledIcon : BookmarkIcon,
        message,
        channel: ChannelStore.getChannel(message.channel_id),
        onClick: () => {
            if (isBookmarked) {
                openBookmarksModal();
            } else {
                addBookmark(message);
            }
        },
    };
}

export default definePlugin({
    name: "MessageBookmarks",
    get description() {
        return t(
            "احفظ الرسائل كإشارات مرجعية خاصة وصنّفها ضمن لوحة أنيقة",
            "Save messages as private bookmarks and organize them in a beautiful panel"
        );
    },
    tags: ["Chat", "Utility"],
    authors: [EquicordDevs.LOSTSTR],
    dependencies: ["MessagePopoverAPI"],

    start() {
        addMessagePopoverButton("MessageBookmarks", renderBookmarkButton, BookmarkIcon);
    },

    stop() {
        removeMessagePopoverButton("MessageBookmarks");
        clearCache();
    },
});
