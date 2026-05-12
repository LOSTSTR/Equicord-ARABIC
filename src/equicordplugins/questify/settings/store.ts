/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings, PlainSettings, SettingsStore } from "@api/Settings";
import ErrorBoundary from "@components/ErrorBoundary";
import { OptionType } from "@utils/types";

import { QuestButtonSetting } from "../components/questButtonSettings";
import { QuestFeaturesSetting } from "../components/questFeaturesSetting";
import { QuestNotificationsSetting } from "../components/questNotificationsSetting";
import { QuestTilesSetting } from "../components/questTilesSetting";
import { ReorderQuestsSetting } from "../components/reorderQuestsSetting";
import { defaultAllowChangingDangerousSettings, defaultAutoCompleteQuestsSimultaneously, defaultAutoCompleteQuestTypes, defaultClaimedSubsort, defaultCompleteVideoQuestsQuicker, defaultDisableAccountPanelPromo, defaultDisableAccountPanelQuestProgress, defaultDisableFriendsListPromo, defaultDisableMembersListPromo, defaultDisableOrbsAndQuestsBadges, defaultDisableQuestsEverything, defaultDisableRelocationNotices, defaultDisableSponsoredBanner, defaultExpiredSubsort, defaultIgnoredQuestIDs, defaultIgnoredSubsort, defaultIsOnQuestsPage, defaultLastQuestPageFilters, defaultLastQuestPageSort, defaultLeftClickAction, defaultMakeMobileVideoQuestsDesktopCompatible, defaultMiddleClickAction, defaultNewExcludedQuestAlertSound, defaultNewExcludedQuestAlertVolume, defaultNewQuestAlertSound, defaultNewQuestAlertVolume, defaultNotifyOnNewExcludedQuests, defaultNotifyOnNewQuests, defaultNotifyOnQuestComplete, defaultQuestButtonBadgeColor, defaultQuestButtonBadgeCount, defaultQuestButtonDisplay, defaultQuestButtonIncludedTypes, defaultQuestButtonIndicator, defaultQuestCompletedAlertSound, defaultQuestCompletedAlertVolume, defaultQuestFetchInterval, defaultQuestOrder, defaultQuestTileClaimedColorSetting, defaultQuestTileExpiredColorSetting, defaultQuestTileGradient, defaultQuestTileIgnoredColorSetting, defaultQuestTilePreload, defaultQuestTileUnclaimedColorSetting, defaultRememberQuestPageFilters, defaultRememberQuestPageSort, defaultResumeInterruptedQuests, defaultResumeQuestIDs, defaultRightClickAction, defaultUnclaimedSubsort, type QuestButtonAction, type QuestButtonDisplayMode, type QuestButtonIncludedTypes, type QuestButtonIndicatorMode, type QuestOrderStatus } from "./def";

const MIGRATION_TARGET = 1;
const CURRENT_SETTINGS = PlainSettings.plugins.Questify;

if (CURRENT_SETTINGS) {
    let migrationVersion = CURRENT_SETTINGS.migrationVersion ?? 0;

    // 0 -> 1: Reset Settings
    if (migrationVersion === 0) {
        PlainSettings.plugins.Questify = { enabled: CURRENT_SETTINGS.enabled, migrationVersion: 1 };
        migrationVersion = 1;
    }

    if (migrationVersion !== CURRENT_SETTINGS.migrationVersion) {
        SettingsStore.markAsChanged();
    }
}

export const settings = definePluginSettings({
    migrationVersion: {
        type: OptionType.NUMBER,
        description: "إصدار الترحيل الحالي للإعدادات.",
        default: MIGRATION_TARGET,
        hidden: true,
    },
    questFeatures: {
        type: OptionType.COMPONENT,
        component: ErrorBoundary.wrap(QuestFeaturesSetting) as any,
        description: "اختر ميزات المهام التي تريد تعطيلها.",
    },
    disableQuestsEverything: {
        type: OptionType.BOOLEAN,
        description: "تعطيل جميع ميزات المهام.",
        default: defaultDisableQuestsEverything,
        restartNeeded: true,
        hidden: true,
    },
    disableRelocationNotices: {
        type: OptionType.BOOLEAN,
        description: "تعطيل إشعارات نقل المهام في صفحة الاكتشاف.",
        default: defaultDisableRelocationNotices,
        restartNeeded: true,
        hidden: true,
    },
    disableSponsoredBanner: {
        type: OptionType.BOOLEAN,
        description: "تعطيل البانر الممول في صفحة المهام.",
        default: defaultDisableSponsoredBanner,
        restartNeeded: true,
        hidden: true,
    },
    disableAccountPanelPromo: {
        type: OptionType.BOOLEAN,
        description: "تعطيل نافذة المهمة المروّجة فوق لوحة الحساب.",
        default: defaultDisableAccountPanelPromo,
        restartNeeded: true,
        hidden: true,
    },
    disableAccountPanelQuestProgress: {
        type: OptionType.BOOLEAN,
        description: "تعطيل تقدم المهام النشطة والمكتملة فوق لوحة الحساب.",
        default: defaultDisableAccountPanelQuestProgress,
        restartNeeded: true,
        hidden: true,
    },
    disableOrbsAndQuestsBadges: {
        type: OptionType.BOOLEAN,
        description: "تعطيل شارة المهام في ملفات المستخدمين الشخصية.",
        default: defaultDisableOrbsAndQuestsBadges,
        restartNeeded: true,
        hidden: true,
    },
    disableFriendsListPromo: {
        type: OptionType.BOOLEAN,
        description: "تعطيل الترويج للمهام في الألعاب التي يلعبها الأصدقاء.",
        default: defaultDisableFriendsListPromo,
        restartNeeded: true,
        hidden: true,
    },
    disableMembersListPromo: {
        type: OptionType.BOOLEAN,
        description: "تعطيل أيقونة اللعب النشط في عناصر قائمة الأعضاء.",
        default: defaultDisableMembersListPromo,
        restartNeeded: true,
        hidden: true,
    },
    allowChangingDangerousSettings: {
        type: OptionType.BOOLEAN,
        description: "السماح بتغيير الإعدادات الخطرة.",
        default: defaultAllowChangingDangerousSettings,
        hidden: true,
    },
    resumeInterruptedQuests: {
        type: OptionType.BOOLEAN,
        description: "استئناف الإكمال التلقائي للمهام بعد إعادة التحميل أو إعادة التشغيل.",
        default: defaultResumeInterruptedQuests,
        restartNeeded: true,
        hidden: true,
    },
    makeMobileVideoQuestsDesktopCompatible: {
        type: OptionType.BOOLEAN,
        description: "جعل مهام الفيديو الخاصة بالجوال متوافقة مع سطح المكتب.",
        default: defaultMakeMobileVideoQuestsDesktopCompatible,
        restartNeeded: true,
        hidden: true,
    },
    autoCompleteQuestsSimultaneously: {
        type: OptionType.BOOLEAN,
        description: "إكمال المهام في آن واحد بدلاً من إكمالها بالتسلسل.",
        default: defaultAutoCompleteQuestsSimultaneously,
        restartNeeded: true,
        hidden: true,
    },
    completeVideoQuestsQuicker: {
        type: OptionType.BOOLEAN,
        description: "استخدام هامش التقدم في Discord والوقت المنقضي منذ التسجيل لإكمال مهام الفيديو تلقائياً.",
        default: defaultCompleteVideoQuestsQuicker,
        restartNeeded: true,
        hidden: true,
    },
    autoCompleteQuestTypes: {
        type: OptionType.CUSTOM,
        description: "أنواع المهام التي يتم إكمالها تلقائياً في الخلفية.",
        default: defaultAutoCompleteQuestTypes,
        restartNeeded: true,
        hidden: true,
    },
    questButton: {
        type: OptionType.COMPONENT,
        component: ErrorBoundary.wrap(QuestButtonSetting) as any,
        description: "تخصيص زر المهام في قائمة الخوادم.",
    },
    questButtonDisplay: {
        type: OptionType.CUSTOM,
        description: "نوع العرض المستخدم لزر المهام في قائمة الخوادم.",
        default: defaultQuestButtonDisplay as QuestButtonDisplayMode,
        restartNeeded: true,
        hidden: true,
    },
    questButtonIncludedTypes: {
        type: OptionType.CUSTOM,
        description: "أنواع المكافآت وأنواع المهام التي تُحتسب عند عرض عدد المهام على زر المهام.",
        default: defaultQuestButtonIncludedTypes as QuestButtonIncludedTypes,
        hidden: true,
    },
    questButtonIndicator: {
        type: OptionType.CUSTOM,
        description: "نوع العرض المستخدم لمؤشر المهام غير المطالب بها على زر المهام في قائمة الخوادم.",
        default: defaultQuestButtonIndicator as QuestButtonIndicatorMode,
        hidden: true,
    },
    questButtonBadgeCount: {
        type: OptionType.NUMBER,
        description: "العدد الحالي للمهام غير المطالب بها ذات الصلة.",
        default: defaultQuestButtonBadgeCount,
        hidden: true,
    },
    questButtonBadgeColor: {
        type: OptionType.NUMBER | OptionType.CUSTOM,
        description: "لون شارة زر المهام في قائمة الخوادم.",
        default: defaultQuestButtonBadgeColor as number | null,
        hidden: true,
    },
    questButtonLeftClickAction: {
        type: OptionType.CUSTOM,
        description: "الإجراء الذي يُنفَّذ عند النقر بالزر الأيسر على زر المهام في قائمة الخوادم.",
        default: defaultLeftClickAction as QuestButtonAction,
        hidden: true,
    },
    questButtonMiddleClickAction: {
        type: OptionType.CUSTOM,
        description: "الإجراء الذي يُنفَّذ عند النقر بالزر الأوسط على زر المهام في قائمة الخوادم.",
        default: defaultMiddleClickAction as QuestButtonAction,
        hidden: true,
    },
    questButtonRightClickAction: {
        type: OptionType.CUSTOM,
        description: "الإجراء الذي يُنفَّذ عند النقر بالزر الأيمن على زر المهام في قائمة الخوادم.",
        default: defaultRightClickAction as QuestButtonAction,
        hidden: true,
    },
    questNotifications: {
        type: OptionType.COMPONENT,
        component: ErrorBoundary.wrap(QuestNotificationsSetting) as any,
        description: "ضبط إشعارات اكتمال المهام واكتشاف مهام جديدة.",
    },
    notifyOnQuestComplete: {
        type: OptionType.BOOLEAN,
        description: "عرض إشعار عند اكتمال مهمة.",
        default: defaultNotifyOnQuestComplete,
        hidden: true,
    },
    notifyOnNewQuests: {
        type: OptionType.BOOLEAN,
        description: "عرض إشعار عند اكتشاف مهام جديدة.",
        default: defaultNotifyOnNewQuests,
        hidden: true,
    },
    notifyOnNewExcludedQuests: {
        type: OptionType.BOOLEAN,
        description: "عرض إشعار عند اكتشاف مهام مستثناة جديدة.",
        default: defaultNotifyOnNewExcludedQuests,
        hidden: true,
    },
    questCompletedAlertSound: {
        type: OptionType.STRING | OptionType.CUSTOM,
        description: "الصوت الذي يُشغَّل عند اكتمال مهمة.",
        default: defaultQuestCompletedAlertSound as string | null,
        hidden: true,
    },
    questCompletedAlertVolume: {
        type: OptionType.NUMBER,
        description: "مستوى صوت تنبيه اكتمال المهمة.",
        default: defaultQuestCompletedAlertVolume,
        hidden: true,
    },
    questFetchInterval: {
        type: OptionType.NUMBER,
        description: "الفترة الزمنية بالثواني لجلب المهام من Discord.",
        default: defaultQuestFetchInterval,
        hidden: true,
    },
    newQuestAlertSound: {
        type: OptionType.STRING | OptionType.CUSTOM,
        description: "الصوت الذي يُشغَّل عند اكتشاف مهام جديدة.",
        default: defaultNewQuestAlertSound as string | null,
        hidden: true,
    },
    newQuestAlertVolume: {
        type: OptionType.NUMBER,
        description: "مستوى صوت تنبيه المهام الجديدة.",
        default: defaultNewQuestAlertVolume,
        hidden: true,
    },
    newExcludedQuestAlertSound: {
        type: OptionType.STRING | OptionType.CUSTOM,
        description: "الصوت الذي يُشغَّل عند اكتشاف مهام مستثناة جديدة.",
        default: defaultNewExcludedQuestAlertSound as string | null,
        hidden: true,
    },
    newExcludedQuestAlertVolume: {
        type: OptionType.NUMBER,
        description: "مستوى صوت تنبيه المهام المستثناة الجديدة.",
        default: defaultNewExcludedQuestAlertVolume,
        hidden: true,
    },
    questTiles: {
        type: OptionType.COMPONENT,
        component: ErrorBoundary.wrap(QuestTilesSetting) as any,
        description: "تخصيص مظهر بلاطات المهام في صفحة المهام.",
    },
    questTileUnclaimedColor: {
        type: OptionType.CUSTOM,
        description: "لون بلاطات المهام غير المطالب بها في صفحة المهام.",
        default: { ...defaultQuestTileUnclaimedColorSetting },
        hidden: true,
    },
    questTileClaimedColor: {
        type: OptionType.CUSTOM,
        description: "لون بلاطات المهام المطالب بها في صفحة المهام.",
        default: { ...defaultQuestTileClaimedColorSetting },
        hidden: true,
    },
    questTileIgnoredColor: {
        type: OptionType.CUSTOM,
        description: "لون بلاطات المهام المتجاهلة في صفحة المهام.",
        default: { ...defaultQuestTileIgnoredColorSetting },
        hidden: true,
    },
    questTileExpiredColor: {
        type: OptionType.CUSTOM,
        description: "لون بلاطات المهام المنتهية الصلاحية في صفحة المهام.",
        default: { ...defaultQuestTileExpiredColorSetting },
        hidden: true,
    },
    questTileGradient: {
        type: OptionType.STRING,
        description: "نمط التدرج المستخدم في بلاطات المهام.",
        default: defaultQuestTileGradient,
        hidden: true,
    },
    questTilePreload: {
        type: OptionType.BOOLEAN,
        description: "محاولة تحميل أصول بلاطات المهام مسبقاً.",
        default: defaultQuestTilePreload,
        hidden: true,
    },
    reorderQuests: {
        type: OptionType.COMPONENT,
        description: "ترتيب المهام حسب حالتها.",
        component: ErrorBoundary.wrap(ReorderQuestsSetting) as any,
    },
    questOrder: {
        type: OptionType.CUSTOM,
        description: "ترتيب الفرز لمجموعات حالة المهام.",
        default: Array.from(defaultQuestOrder) as QuestOrderStatus[],
        hidden: true,
    },
    unclaimedSubsort: {
        type: OptionType.STRING,
        description: "طريقة الترتيب الفرعي للمهام غير المطالب بها.",
        default: defaultUnclaimedSubsort,
        hidden: true,
    },
    claimedSubsort: {
        type: OptionType.STRING,
        description: "طريقة الترتيب الفرعي للمهام المطالب بها.",
        default: defaultClaimedSubsort,
        hidden: true,
    },
    ignoredSubsort: {
        type: OptionType.STRING,
        description: "طريقة الترتيب الفرعي للمهام المتجاهلة.",
        default: defaultIgnoredSubsort,
        hidden: true,
    },
    expiredSubsort: {
        type: OptionType.STRING,
        description: "طريقة الترتيب الفرعي للمهام المنتهية الصلاحية.",
        default: defaultExpiredSubsort,
        hidden: true,
    },
    isOnQuestsPage: {
        type: OptionType.BOOLEAN,
        description: "ما إذا كان المستخدم على صفحة المهام حالياً.",
        default: defaultIsOnQuestsPage,
        hidden: true,
    },
    rememberQuestPageSort: {
        type: OptionType.BOOLEAN,
        description: "تذكّر آخر ترتيب فرز مستخدم في صفحة المهام.",
        default: defaultRememberQuestPageSort,
        hidden: true,
    },
    rememberQuestPageFilters: {
        type: OptionType.BOOLEAN,
        description: "تذكّر آخر فلاتر مستخدمة في صفحة المهام.",
        default: defaultRememberQuestPageFilters,
        hidden: true,
    },
    lastQuestPageSort: {
        type: OptionType.STRING,
        description: "آخر ترتيب فرز مستخدم في صفحة المهام.",
        default: defaultLastQuestPageSort,
        hidden: true,
    },
    lastQuestPageFilters: {
        type: OptionType.CUSTOM,
        description: "آخر فلاتر مستخدمة في صفحة المهام.",
        default: defaultLastQuestPageFilters,
        hidden: true,
    },
    ignoredQuestIDs: {
        type: OptionType.CUSTOM,
        description: "مصفوفة من معرّفات المهام المتجاهلة.",
        default: defaultIgnoredQuestIDs,
        hidden: true,
    },
    resumeQuestIDs: {
        type: OptionType.CUSTOM,
        description: "مصفوفة من معرّفات المهام التي يجري إكمالها تلقائياً أو المُجدولة للإكمال في الخلفية.",
        default: defaultResumeQuestIDs,
        hidden: true,
    },
});
