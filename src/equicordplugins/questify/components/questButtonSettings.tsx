/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { useSettings } from "@api/Settings";
import { t } from "@utils/esharqI18n";
import { QuestRewardType, QuestTaskType } from "@vencord/discord-types/enums";
import type { JSX } from "react";

import { enabledOnStartup } from "..";
import { getQuestifySettings, useQuestifySettings } from "../settings/access";
import { type QuestButtonAction, type QuestButtonDisplayMode, type QuestButtonIncludedTypes, type QuestButtonIndicatorMode } from "../settings/def";
import { startAutoFetchingQuests } from "../settings/fetching";
import { validateIgnoredQuests } from "../settings/ignoredQuests";
import { canShowBadge, canShowButton, canShowPill } from "../utils/ui";
import { DummyQuestButton } from "./questButton";
import { type ManaSelectOption, SettingsCard, SettingsColorPicker, SettingsDescription, SettingsHeader, SettingsRow, SettingsRowItem, SettingsSelect, SettingsSubheader } from "./shared";

interface QuestButtonIncludedTypeOption {
    label: string;
    value: QuestTaskType | QuestRewardType;
}

function getQuestButtonDisplayOptions(): readonly { label: string; value: QuestButtonDisplayMode; }[] {
    return [
        { label: t("دائماً", "Always"), value: "always" },
        { label: t("غير مطالَب", "Unclaimed"), value: "unclaimed" },
        { label: t("أبداً", "Never"), value: "never" },
    ];
}

function getQuestButtonIndicatorOptions(): readonly { label: string; value: QuestButtonIndicatorMode; }[] {
    return [
        { label: t("شريط", "Pill"), value: "pill" },
        { label: t("شارة", "Badge"), value: "badge" },
        { label: t("كلاهما", "Both"), value: "both" },
        { label: t("لا شيء", "Nothing"), value: "none" },
    ];
}

function getQuestButtonClickOptions(): readonly { label: string; value: QuestButtonAction; }[] {
    return [
        { label: t("فتح المهام", "Open Quests"), value: "open-quests" },
        { label: t("قائمة السياق", "Context Menu"), value: "context-menu" },
        { label: t("إعدادات الإضافة", "Plugin Settings"), value: "plugin-settings" },
        { label: t("لا شيء", "Nothing"), value: "nothing" },
    ];
}

function getQuestButtonRewardTypeOptions(): readonly QuestButtonIncludedTypeOption[] {
    return [
        { label: t("كرات", "Coins"), value: QuestRewardType.VIRTUAL_CURRENCY },
        { label: t("أكواد Nitro", "Nitro Codes"), value: QuestRewardType.FRACTIONAL_PREMIUM },
        { label: t("أكواد المكافآت", "Reward Codes"), value: QuestRewardType.REWARD_CODE },
        { label: t("عناصر داخل اللعبة", "In-Game Items"), value: QuestRewardType.IN_GAME },
        { label: t("مقتنيات الملف الشخصي", "Profile Collectibles"), value: QuestRewardType.COLLECTIBLE },
    ];
}

function getQuestButtonQuestTypeOptions(): readonly QuestButtonIncludedTypeOption[] {
    return [
        { label: t("مشاهدة فيديو", "Watch Video"), value: QuestTaskType.WATCH_VIDEO },
        { label: t("مشاهدة فيديو على الجوال", "Watch Video on Mobile"), value: QuestTaskType.WATCH_VIDEO_ON_MOBILE },
        { label: t("إنجاز في نشاط", "Achievement in Activity"), value: QuestTaskType.ACHIEVEMENT_IN_ACTIVITY },
        { label: t("إنجاز في لعبة", "Achievement in Game"), value: QuestTaskType.ACHIEVEMENT_IN_GAME },
        { label: t("تشغيل نشاط", "Play Activity"), value: QuestTaskType.PLAY_ACTIVITY },
        { label: t("اللعب على سطح المكتب", "Play on Desktop"), value: QuestTaskType.PLAY_ON_DESKTOP },
        { label: t("اللعب على سطح المكتب V2", "Play on Desktop V2"), value: QuestTaskType.PLAY_ON_DESKTOP_V2 },
        { label: t("البث على سطح المكتب", "Stream on Desktop"), value: QuestTaskType.STREAM_ON_DESKTOP },
        { label: t("اللعب على PlayStation", "Play on PlayStation"), value: QuestTaskType.PLAY_ON_PLAYSTATION },
        { label: t("اللعب على Xbox", "Play on Xbox"), value: QuestTaskType.PLAY_ON_XBOX },
    ];
}

function toManaOptions<T extends string | number>(options: readonly { label: string; value: T; }[]): ManaSelectOption[] {
    return options.map(({ label, value }) => ({
        id: String(value),
        label,
        value: String(value),
    }));
}

export function QuestButtonSetting(): JSX.Element {
    useSettings(["plugins.Settings.arabicMode"]);

    const questButton = useQuestifySettings([
        "disableQuestsEverything",
        "questButtonDisplay",
        "questButtonIncludedTypes",
        "questButtonIndicator",
        "questButtonBadgeCount",
        "questButtonBadgeColor",
        "questButtonLeftClickAction",
        "questButtonMiddleClickAction",
        "questButtonRightClickAction",
    ]);

    const questButtonDisplayOptions = getQuestButtonDisplayOptions();
    const questButtonIndicatorOptions = getQuestButtonIndicatorOptions();
    const questButtonClickOptions = getQuestButtonClickOptions();
    const questButtonRewardTypeOptions = getQuestButtonRewardTypeOptions();
    const questButtonQuestTypeOptions = getQuestButtonQuestTypeOptions();

    const questButtonDisplayManaOptions = toManaOptions(questButtonDisplayOptions);
    const questButtonIndicatorManaOptions = toManaOptions(questButtonIndicatorOptions);
    const questButtonClickManaOptions = toManaOptions(questButtonClickOptions);
    const questButtonRewardTypeManaOptions = toManaOptions(questButtonRewardTypeOptions);
    const questButtonQuestTypeManaOptions = toManaOptions(questButtonQuestTypeOptions);

    const disabled = questButton.disableQuestsEverything;
    const includedTypes = questButton.questButtonIncludedTypes as QuestButtonIncludedTypes;

    const selectedRewardTypes = questButtonRewardTypeOptions
        .filter(({ value }) => includedTypes[value])
        .map(({ value }) => String(value));

    const selectedQuestTypes = questButtonQuestTypeOptions
        .filter(({ value }) => includedTypes[value])
        .map(({ value }) => String(value));

    function updateQuestButtonDisplay(value: string | string[] | null) {
        if (typeof value !== "string") return;

        getQuestifySettings().questButtonDisplay = value as QuestButtonDisplayMode;
        startAutoFetchingQuests(true);
    }

    function updateQuestButtonIndicator(value: string | string[] | null) {
        if (typeof value !== "string") return;

        getQuestifySettings().questButtonIndicator = value as QuestButtonIndicatorMode;
        startAutoFetchingQuests(true);
    }

    function updateQuestButtonAction(key: "questButtonLeftClickAction" | "questButtonMiddleClickAction" | "questButtonRightClickAction", value: string | string[] | null) {
        if (typeof value !== "string") return;

        getQuestifySettings()[key] = value as QuestButtonAction;
    }

    function updateBadgeColor(value: number | null) {
        getQuestifySettings().questButtonBadgeColor = value;
    }

    function updateIncludedTypes(options: readonly QuestButtonIncludedTypeOption[], value: string | string[] | null) {
        const selectedValues = new Set(Array.isArray(value) ? value : value ? [value] : []);
        const nextIncludedTypes = { ...getQuestifySettings().questButtonIncludedTypes };

        for (const option of options) {
            nextIncludedTypes[option.value] = selectedValues.has(String(option.value));
        }

        getQuestifySettings().questButtonIncludedTypes = nextIncludedTypes;
        validateIgnoredQuests();
    }

    return (
        <SettingsCard>
            <SettingsRow>
                <SettingsRowItem>
                    <SettingsHeader>{t("زر المهام", "Quests Button")}</SettingsHeader>
                    <SettingsDescription>{t("إظهار زر المهام في قائمة الخوادم مع مؤشر اختياري للمهام غير المطالَب بها.", "Show a quest button in the server list with an optional indicator for unclaimed quests.")}</SettingsDescription>
                </SettingsRowItem>
                {enabledOnStartup && <SettingsRowItem width="content">
                    <DummyQuestButton
                        badgeColor={questButton.questButtonBadgeColor}
                        leftClickAction={questButton.questButtonLeftClickAction}
                        middleClickAction={questButton.questButtonMiddleClickAction}
                        rightClickAction={questButton.questButtonRightClickAction}
                        showBadge={canShowBadge(questButton.questButtonIndicator)}
                        showPill={canShowPill(questButton.questButtonIndicator)}
                        visible={canShowButton(questButton.questButtonDisplay)}
                    />
                </SettingsRowItem>}
            </SettingsRow>
            <SettingsSubheader className="no-top-margin">{t("سلوك الزر", "Button Behavior")}</SettingsSubheader>
            <SettingsRow>
                <SettingsRowItem>
                    <SettingsSelect
                        label={t("إجراء النقر الأيسر:", "Left Click Action:")}
                        options={questButtonClickManaOptions}
                        value={questButton.questButtonLeftClickAction}
                        selectionMode="single"
                        disabled={disabled}
                        fullWidth={true}
                        onSelectionChange={value => updateQuestButtonAction("questButtonLeftClickAction", value)}
                    />
                </SettingsRowItem>
                <SettingsRowItem>
                    <SettingsSelect
                        label={t("إجراء النقر الأوسط:", "Middle Click Action:")}
                        options={questButtonClickManaOptions}
                        value={questButton.questButtonMiddleClickAction}
                        selectionMode="single"
                        disabled={disabled}
                        fullWidth={true}
                        onSelectionChange={value => updateQuestButtonAction("questButtonMiddleClickAction", value)}
                    />
                </SettingsRowItem>
                <SettingsRowItem>
                    <SettingsSelect
                        label={t("إجراء النقر الأيمن:", "Right Click Action:")}
                        options={questButtonClickManaOptions}
                        value={questButton.questButtonRightClickAction}
                        selectionMode="single"
                        disabled={disabled}
                        fullWidth={true}
                        onSelectionChange={value => updateQuestButtonAction("questButtonRightClickAction", value)}
                    />
                </SettingsRowItem>
            </SettingsRow>
            <SettingsRow>
                <SettingsRowItem>
                    <SettingsSelect
                        label={t("ظهور الزر:", "Button Visibility:")}
                        options={questButtonDisplayManaOptions}
                        value={questButton.questButtonDisplay}
                        selectionMode="single"
                        disabled={disabled}
                        fullWidth={true}
                        onSelectionChange={updateQuestButtonDisplay}
                        tooltip={{
                            position: "top",
                            text: t(
                                "دائماً يُظهر زر المهام متى كانت هذه الميزة مُفعَّلة."
                                    + "\n\nغير مطالَب يُظهره فقط عند وجود مكافآت مهام غير مطالَب بها."
                                    + "\n\nأبداً يُخفي زر المهام.",
                                "Always shows the quest button whenever this feature is enabled.\n\nUnclaimed shows it only when there are unclaimed quest rewards.\n\nNever hides the quest button."
                            )
                        }}
                    />
                </SettingsRowItem>
                <SettingsRowItem>
                    <SettingsSelect
                        label={t("مؤشر غير المطالَب:", "Unclaimed Indicator:")}
                        options={questButtonIndicatorManaOptions}
                        value={questButton.questButtonIndicator}
                        selectionMode="single"
                        disabled={disabled}
                        fullWidth={true}
                        onSelectionChange={updateQuestButtonIndicator}
                        tooltip={{
                            position: "top",
                            text: t(
                                "الشريط يُظهر علامة Discord لغير المقروء بجانب زر المهام."
                                    + "\n\nالشارة تُظهر عدد مكافآت المهام غير المطالَب بها."
                                    + "\n\nكلاهما يُظهر الشريط والشارة معاً."
                                    + "\n\nلا شيء يُخفي المؤشرات.",
                                "Pill shows Discord's unread indicator next to the quest button.\n\nBadge shows the count of unclaimed quest rewards.\n\nBoth shows the pill and badge together.\n\nNothing hides the indicators."
                            )
                        }}
                    />
                </SettingsRowItem>
                <SettingsRowItem>
                    <SettingsColorPicker
                        label={t("لون الشارة:", "Badge Color:")}
                        className="quest-button-color-picker"
                        color={questButton.questButtonBadgeColor}
                        disabled={disabled}
                        onChange={updateBadgeColor}
                        showEyeDropper={true}
                    />
                </SettingsRowItem>
            </SettingsRow>
            <SettingsSubheader>{t("صلة المهام", "Quest Relevance")}</SettingsSubheader>
            <SettingsSelect
                label={t("أنواع المكافآت المُضمَّنة:", "Included Reward Types:")}
                wrapTags={true}
                options={questButtonRewardTypeManaOptions}
                value={selectedRewardTypes}
                closeOnSelect={false}
                maxOptionsVisible={questButtonRewardTypeManaOptions.length}
                selectionMode="multiple"
                disabled={disabled}
                fullWidth={true}
                onSelectionChange={value => updateIncludedTypes(questButtonRewardTypeOptions, value)}
                tooltip={{
                    position: "top",
                    text: t(
                        "احسب فقط المهام ذات هذه الأنواع من المكافآت كغير مطالَب بها عند تحديد ظهور الزر وعدد الشارة وسلوك التنبيه.",
                        "Only count quests with these reward types as unclaimed when determining button visibility, badge count, and alert behavior."
                    )
                }}
            />
            <SettingsSelect
                label={t("أنواع المهام المُضمَّنة:", "Included Quest Types:")}
                labelClassName="margin-top-9"
                wrapTags={true}
                options={questButtonQuestTypeManaOptions}
                value={selectedQuestTypes}
                closeOnSelect={false}
                maxOptionsVisible={questButtonQuestTypeManaOptions.length}
                selectionMode="multiple"
                disabled={disabled}
                fullWidth={true}
                onSelectionChange={value => updateIncludedTypes(questButtonQuestTypeOptions, value)}
                tooltip={{
                    position: "top",
                    text: t(
                        "احسب فقط المهام ذات هذه الأنواع كغير مطالَب بها عند تحديد ظهور الزر وعدد الشارة وسلوك التنبيه.",
                        "Only count quests of these types as unclaimed when determining button visibility, badge count, and alert behavior."
                    )
                }}
            />
        </SettingsCard>
    );
}
