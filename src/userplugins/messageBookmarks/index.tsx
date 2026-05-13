/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./styles.css";

import { NavContextMenuPatchCallback } from "@api/ContextMenu";
import { HeaderBarButton } from "@api/HeaderBar";
import { DataStore } from "@api/index";
import { classNameFactory } from "@utils/css";
import { closeModal, ModalCloseButton, ModalContent, ModalHeader, ModalRoot, ModalSize, openModal } from "@utils/modal";
import definePlugin from "@utils/types";
import type { Message } from "@vencord/discord-types";
import { Menu, NavigationRouter, Popout, React, Text, useRef, useState } from "@webpack/common";

import type { JSX } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Bookmark {
    messageId: string;
    channelId: string;
    guildId: string | null;
    authorName: string;
    snippet: string;
    savedAt: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STORE_KEY = "LoststrHeart_bookmarks";
const MAX_SNIPPET = 80;
const cl = classNameFactory("lh-");

// ─── DataStore helpers ────────────────────────────────────────────────────────

async function getBookmarks(): Promise<Bookmark[]> {
    return (await DataStore.get<Bookmark[]>(STORE_KEY)) ?? [];
}

async function saveBookmarks(bookmarks: Bookmark[]): Promise<void> {
    await DataStore.set(STORE_KEY, bookmarks);
}

async function addBookmark(msg: Message & { guild_id?: string; }): Promise<boolean> {
    const bookmarks = await getBookmarks();
    if (bookmarks.some(b => b.messageId === msg.id)) return false;

    const snippet = (msg.content ?? "").slice(0, MAX_SNIPPET).trimEnd()
        + ((msg.content?.length ?? 0) > MAX_SNIPPET ? "…" : "");

    bookmarks.unshift({
        messageId: msg.id,
        channelId: msg.channel_id,
        guildId: msg.guild_id ?? null,
        authorName: (msg.author as any)?.globalName ?? (msg.author as any)?.username ?? "مجهول",
        snippet: snippet || "(لا يوجد نص)",
        savedAt: Date.now(),
    });

    await saveBookmarks(bookmarks);
    return true;
}

async function removeBookmark(messageId: string): Promise<void> {
    const bookmarks = await getBookmarks();
    await saveBookmarks(bookmarks.filter(b => b.messageId !== messageId));
}

// ─── Heart SVG Icon ───────────────────────────────────────────────────────────

function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" width={20} height={20} {...props}>
            <path
                fill="currentColor"
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
        </svg>
    );
}

function HeartOutlineIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" width={16} height={16} {...props}>
            <path
                fill="currentColor"
                d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"
            />
        </svg>
    );
}

// ─── Bookmarks Modal ──────────────────────────────────────────────────────────

function BookmarksModal({ modalProps, onClose }: { modalProps: any; onClose: () => void; }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        getBookmarks().then(list => {
            setBookmarks(list);
            setLoading(false);
        });
    }, []);

    function jumpTo(b: Bookmark) {
        const path = b.guildId
            ? `/channels/${b.guildId}/${b.channelId}/${b.messageId}`
            : `/channels/@me/${b.channelId}/${b.messageId}`;
        NavigationRouter.transitionTo(path);
        onClose();
    }

    async function remove(b: Bookmark, e: React.MouseEvent) {
        e.stopPropagation();
        await removeBookmark(b.messageId);
        setBookmarks(prev => prev.filter(x => x.messageId !== b.messageId));
    }

    function formatDate(ts: number) {
        return new Date(ts).toLocaleDateString("ar-SA", { day: "numeric", month: "short", year: "numeric" });
    }

    return (
        <ModalRoot {...modalProps} size={ModalSize.MEDIUM}>
            <ModalHeader className={cl("modal-header")}>
                <HeartIcon style={{ marginInlineEnd: 8, color: "var(--red-400, #ed4245)" }} />
                <Text variant="heading-lg/semibold">المفضلة ({bookmarks.length})</Text>
                <ModalCloseButton onClick={onClose} />
            </ModalHeader>
            <ModalContent className={cl("modal-content")}>
                {loading ? (
                    <Text variant="text-md/normal" className={cl("empty")}>جارٍ التحميل…</Text>
                ) : bookmarks.length === 0 ? (
                    <div className={cl("empty-state")}>
                        <HeartOutlineIcon style={{ color: "var(--text-muted)", width: 40, height: 40, marginBottom: 12 }} />
                        <Text variant="text-md/normal" style={{ color: "var(--text-muted)" }}>
                            لا توجد رسائل في المفضلة بعد.
                        </Text>
                        <Text variant="text-sm/normal" style={{ color: "var(--text-muted)", marginTop: 4 }}>
                            انقر بزر الماوس الأيمن على أي رسالة واختر «إضافة للمفضلة».
                        </Text>
                    </div>
                ) : (
                    <div className={cl("list")}>
                        {bookmarks.map(b => (
                            <div
                                key={b.messageId}
                                className={cl("entry")}
                                onClick={() => jumpTo(b)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={e => e.key === "Enter" && jumpTo(b)}
                            >
                                <div className={cl("entry-body")}>
                                    <Text variant="text-sm/semibold" className={cl("author")}>
                                        {b.authorName}
                                    </Text>
                                    <Text variant="text-sm/normal" className={cl("snippet")}>
                                        {b.snippet}
                                    </Text>
                                    <Text variant="text-xs/normal" className={cl("date")}>
                                        {formatDate(b.savedAt)}
                                    </Text>
                                </div>
                                <button
                                    className={cl("remove-btn")}
                                    onClick={e => remove(b, e)}
                                    title="إزالة من المفضلة"
                                    aria-label="إزالة من المفضلة"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </ModalContent>
        </ModalRoot>
    );
}

// ─── Header Bar Button ────────────────────────────────────────────────────────

function HeartHeaderButton(): JSX.Element {
    const buttonRef = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState(false);

    function openBookmarksModal() {
        setShow(false);
        const key = openModal(props => (
            <BookmarksModal
                modalProps={props}
                onClose={() => closeModal(key)}
            />
        ));
    }

    return (
        <Popout
            position="bottom"
            align="right"
            spacing={8}
            animation={Popout.Animation.SCALE}
            shouldShow={show}
            onRequestClose={() => setShow(false)}
            targetElementRef={buttonRef}
            renderPopout={() => (
                <div className={cl("quick-popout")}>
                    <Text variant="text-sm/semibold" className={cl("quick-title")}>المفضلة</Text>
                    <QuickPopoutContent onOpen={openBookmarksModal} />
                </div>
            )}
        >
            {(_, { isShown }) => (
                <HeaderBarButton
                    ref={buttonRef}
                    onClick={() => setShow(v => !v)}
                    tooltip={isShown ? null : "المفضلة"}
                    icon={HeartIcon}
                    selected={isShown}
                    aria-label="فتح المفضلة"
                />
            )}
        </Popout>
    );
}

// ─── Quick Popout (mini preview) ──────────────────────────────────────────────

function QuickPopoutContent({ onOpen }: { onOpen: () => void; }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        getBookmarks().then(list => {
            setBookmarks(list.slice(0, 5));
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <Text variant="text-sm/normal" className={cl("qp-empty")}>جارٍ التحميل…</Text>;
    }

    return (
        <div className={cl("qp-body")}>
            {bookmarks.length === 0 ? (
                <Text variant="text-sm/normal" className={cl("qp-empty")}>لا توجد مفضلة بعد.</Text>
            ) : (
                bookmarks.map(b => (
                    <div
                        key={b.messageId}
                        className={cl("qp-entry")}
                        onClick={() => {
                            const path = b.guildId
                                ? `/channels/${b.guildId}/${b.channelId}/${b.messageId}`
                                : `/channels/@me/${b.channelId}/${b.messageId}`;
                            NavigationRouter.transitionTo(path);
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => e.key === "Enter" && NavigationRouter.transitionTo(
                            b.guildId
                                ? `/channels/${b.guildId}/${b.channelId}/${b.messageId}`
                                : `/channels/@me/${b.channelId}/${b.messageId}`
                        )}
                    >
                        <Text variant="text-xs/semibold" className={cl("qp-author")}>{b.authorName}</Text>
                        <Text variant="text-xs/normal" className={cl("qp-snippet")}>{b.snippet}</Text>
                    </div>
                ))
            )}
            <button className={cl("qp-open-all")} onClick={onOpen}>
                عرض الكل ({bookmarks.length > 5 ? `${bookmarks.length}+` : bookmarks.length})
            </button>
        </div>
    );
}

// ─── Context Menu Patch ───────────────────────────────────────────────────────

const messageContextMenuPatch: NavContextMenuPatchCallback = (children, props) => {
    const { message } = props as { message: Message & { guild_id?: string; }; };
    if (!message?.id) return;

    children.push(
        <Menu.MenuItem
            key="lh-bookmark"
            id="lh-bookmark"
            label="إضافة للمفضلة"
            icon={HeartOutlineIcon}
            action={async () => {
                const added = await addBookmark(message);
                if (!added) {
                    // already bookmarked — remove it (toggle)
                    await removeBookmark(message.id);
                }
            }}
        />
    );
};

// ─── Plugin ────────────────────────────────────────────────────────────────────

export default definePlugin({
    name: "MessageBookmarks",
    description: "احفظ رسائلك المفضلة وانتقل إليها بنقرة واحدة.",
    authors: [{ name: "LOSTSTR", id: 1072961475125182564n }],
    dependencies: ["HeaderBarAPI"],

    contextMenus: {
        message: messageContextMenuPatch,
    },

    headerBarButton: {
        icon: HeartIcon,
        render: HeartHeaderButton,
        priority: 100,
    },
});
