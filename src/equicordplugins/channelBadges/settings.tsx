/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

export const settings = definePluginSettings({
    oneBadgePerChannel: {
        type: OptionType.BOOLEAN,
        default: false,
        description: "عرض شارة واحدة فقط لكل قناة",
        restartNeeded: true,
    },
    showTextBadge: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "عرض شارة النص",
        restartNeeded: true,
    },
    showVoiceBadge: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "عرض شارة الصوت",
        restartNeeded: true,
    },
    showCategoryBadge: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "عرض شارة الفئة",
        restartNeeded: true,
    },
    showDirectoryBadge: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "عرض شارة الدليل",
        restartNeeded: true,
    },
    showAnnouncementThreadBadge: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "عرض شارة خيط الإعلانات",
        restartNeeded: true,
    },
    showPublicThreadBadge: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "عرض شارة الخيط العام",
        restartNeeded: true,
    },
    showPrivateThreadBadge: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "عرض شارة الخيط الخاص",
        restartNeeded: true,
    },
    showStageBadge: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "عرض شارة المنصة",
        restartNeeded: true,
    },
    showAnnouncementBadge: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "عرض شارة الإعلانات",
        restartNeeded: true,
    },
    showForumBadge: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "عرض شارة المنتدى",
        restartNeeded: true,
    },
    showMediaBadge: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "عرض شارة الوسائط",
        restartNeeded: true,
    },
    showNSFWBadge: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "عرض شارة NSFW",
        restartNeeded: true,
    },
    showLockedBadge: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "عرض شارة القناة المقفلة",
        restartNeeded: true,
    },
    showRulesBadge: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "عرض شارة قناة القواعد",
        restartNeeded: true,
    },
    showUnknownBadge: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "عرض شارة النوع المجهول",
        restartNeeded: true,
    },

    textBadgeLabel: {
        type: OptionType.STRING,
        default: "Text",
        description: "تسمية شارة النص",
        restartNeeded: true,
    },
    voiceBadgeLabel: {
        type: OptionType.STRING,
        default: "Voice",
        description: "تسمية شارة الصوت",
        restartNeeded: true,
    },
    categoryBadgeLabel: {
        type: OptionType.STRING,
        default: "Category",
        description: "تسمية شارة الفئة",
        restartNeeded: true,
    },
    announcementBadgeLabel: {
        type: OptionType.STRING,
        default: "News",
        description: "تسمية شارة الإعلانات",
        restartNeeded: true,
    },
    announcementThreadBadgeLabel: {
        type: OptionType.STRING,
        default: "News Thread",
        description: "تسمية شارة خيط الإعلانات",
        restartNeeded: true,
    },
    publicThreadBadgeLabel: {
        type: OptionType.STRING,
        default: "Thread",
        description: "تسمية شارة الخيط العام",
        restartNeeded: true,
    },
    privateThreadBadgeLabel: {
        type: OptionType.STRING,
        default: "Private Thread",
        description: "تسمية شارة الخيط الخاص",
        restartNeeded: true,
    },
    stageBadgeLabel: {
        type: OptionType.STRING,
        default: "Stage",
        description: "تسمية شارة المنصة",
        restartNeeded: true,
    },
    directoryBadgeLabel: {
        type: OptionType.STRING,
        default: "Directory",
        description: "تسمية شارة الدليل",
        restartNeeded: true,
    },
    forumBadgeLabel: {
        type: OptionType.STRING,
        default: "Forum",
        description: "تسمية شارة المنتدى",
        restartNeeded: true,
    },
    mediaBadgeLabel: {
        type: OptionType.STRING,
        default: "Media",
        description: "تسمية شارة الوسائط",
        restartNeeded: true,
    },
    nsfwBadgeLabel: {
        type: OptionType.STRING,
        default: "NSFW",
        description: "تسمية شارة NSFW",
        restartNeeded: true,
    },
    lockedBadgeLabel: {
        type: OptionType.STRING,
        default: "Locked",
        description: "تسمية شارة القناة المقفلة",
        restartNeeded: true,
    },
    rulesBadgeLabel: {
        type: OptionType.STRING,
        default: "Rules",
        description: "تسمية شارة قناة القواعد",
        restartNeeded: true,
    },
    unknownBadgeLabel: {
        type: OptionType.STRING,
        default: "Unknown",
        description: "تسمية شارة النوع المجهول",
        restartNeeded: true,
    },

    textBadgeColor: {
        type: OptionType.STRING,
        description: "لون شارة النص",
        restartNeeded: true,
    },
    voiceBadgeColor: {
        type: OptionType.STRING,
        description: "لون شارة الصوت",
        restartNeeded: true,
    },
    categoryBadgeColor: {
        type: OptionType.STRING,
        description: "لون شارة الفئة",
        restartNeeded: true,
    },
    announcementBadgeColor: {
        type: OptionType.STRING,
        description: "لون شارة الإعلانات",
        restartNeeded: true,
    },
    announcementThreadBadgeColor: {
        type: OptionType.STRING,
        description: "لون شارة خيط الإعلانات",
        restartNeeded: true,
    },
    publicThreadBadgeColor: {
        type: OptionType.STRING,
        description: "لون شارة الخيط العام",
        restartNeeded: true,
    },
    privateThreadBadgeColor: {
        type: OptionType.STRING,
        description: "لون شارة الخيط الخاص",
        restartNeeded: true,
    },
    stageBadgeColor: {
        type: OptionType.STRING,
        description: "لون شارة المنصة",
        restartNeeded: true,
    },
    directoryBadgeColor: {
        type: OptionType.STRING,
        description: "لون شارة الدليل",
        restartNeeded: true,
    },
    forumBadgeColor: {
        type: OptionType.STRING,
        description: "لون شارة المنتدى",
        restartNeeded: true,
    },
    mediaBadgeColor: {
        type: OptionType.STRING,
        description: "لون شارة الوسائط",
        restartNeeded: true,
    },
    nsfwBadgeColor: {
        type: OptionType.STRING,
        description: "لون شارة NSFW",
        restartNeeded: true,
    },
    lockedBadgeColor: {
        type: OptionType.STRING,
        description: "لون شارة القناة المقفلة",
        restartNeeded: true,
    },
    rulesBadgeColor: {
        type: OptionType.STRING,
        description: "لون شارة قناة القواعد",
        restartNeeded: true,
    },
    unknownBadgeColor: {
        type: OptionType.STRING,
        description: "لون شارة النوع المجهول",
        restartNeeded: true,
    },
});

export const defaultValues = {
    showTextBadge: true,
    showVoiceBadge: true,
    showCategoryBadge: true,
    showAnnouncementBadge: true,
    showAnnouncementThreadBadge: true,
    showPublicThreadBadge: true,
    showPrivateThreadBadge: true,
    showStageBadge: true,
    showDirectoryBadge: true,
    showForumBadge: true,
    showMediaBadge: true,
    showNSFWBadge: true,
    showLockedBadge: true,
    showRulesBadge: true,
    showUnknownBadge: true,

    channelBadges: {
        text: "Text",
        voice: "Voice",
        category: "Category",
        announcement: "News",
        announcement_thread: "News Thread",
        public_thread: "Thread",
        private_thread: "Private Thread",
        stage: "Stage",
        directory: "Directory",
        forum: "Forum",
        media: "Media",
        nsfw: "NSFW",
        locked: "Locked",
        rules: "Rules",
        unknown: "Unknown"
    },
    lockedBadgeTooltip: "This channel is locked.",
    nsfwBadgeTooltip: "This channel is marked as NSFW.",
};

export function isEnabled(type: number) {
    const fromValues = settings.store;

    switch (type) {
        case 0:
            return fromValues.showTextBadge;
        case 2:
            return fromValues.showVoiceBadge;
        case 4:
            return fromValues.showCategoryBadge;
        case 5:
            return fromValues.showAnnouncementBadge;
        case 10:
            return fromValues.showAnnouncementThreadBadge;
        case 11:
            return fromValues.showPublicThreadBadge;
        case 12:
            return fromValues.showPrivateThreadBadge;
        case 13:
            return fromValues.showStageBadge;
        case 14:
            return fromValues.showDirectoryBadge;
        case 15:
            return fromValues.showForumBadge;
        case 16:
            return fromValues.showMediaBadge;
        case 6100:
            return fromValues.showNSFWBadge;
        case 6101:
            return fromValues.showLockedBadge;
        case 6102:
            return fromValues.showRulesBadge;
        default:
            return fromValues.showUnknownBadge;
    }
}

export function returnChannelBadge(type: number) {
    switch (type) {
        case 0:
            return { css: "text", label: settings.store.textBadgeLabel, color: settings.store.textBadgeColor };
        case 2:
            return { css: "voice", label: settings.store.voiceBadgeLabel, color: settings.store.voiceBadgeColor };
        case 4:
            return { css: "category", label: settings.store.categoryBadgeLabel, color: settings.store.categoryBadgeColor };
        case 5:
            return { css: "announcement", label: settings.store.announcementBadgeLabel, color: settings.store.announcementBadgeColor };
        case 10:
            return { css: "announcement-thread", label: settings.store.announcementThreadBadgeLabel, color: settings.store.announcementThreadBadgeColor };
        case 11:
            return { css: "thread", label: settings.store.publicThreadBadgeLabel, color: settings.store.publicThreadBadgeColor };
        case 12:
            return { css: "private-thread", label: settings.store.privateThreadBadgeLabel, color: settings.store.privateThreadBadgeColor };
        case 13:
            return { css: "stage", label: settings.store.stageBadgeLabel, color: settings.store.stageBadgeColor };
        case 14:
            return { css: "directory", label: settings.store.directoryBadgeLabel, color: settings.store.directoryBadgeColor };
        case 15:
            return { css: "forum", label: settings.store.forumBadgeLabel, color: settings.store.forumBadgeColor };
        case 16:
            return { css: "media", label: settings.store.mediaBadgeLabel, color: settings.store.mediaBadgeColor };
        case 6100:
            return { css: "nsfw", label: settings.store.nsfwBadgeLabel, color: settings.store.nsfwBadgeColor };
        case 6101:
            return { css: "locked", label: settings.store.lockedBadgeLabel, color: settings.store.lockedBadgeColor };
        case 6102:
            return { css: "rules", label: settings.store.rulesBadgeLabel, color: settings.store.rulesBadgeColor };
        default:
            return { css: "unknown", label: settings.store.unknownBadgeLabel, color: settings.store.unknownBadgeColor };
    }
}
