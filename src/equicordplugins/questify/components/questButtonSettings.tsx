/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

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

const questButtonDisplayOptions = [
    { label: "دائماً", value: "always" },
    { label: "غير مطالَب", value: "unclaimed" },
    { label: "أبداً", value: "never" },
] as const satisfies readonly { label: string; value: QuestButtonDisplayMode; }[];

const questButtonIndicatorOptions = [
    { label: "شريط", value: "pill" },
    { label: "شارة", value: "badge" },
    { label: "كلاهما", value: "both" },
    { label: "لا شيء", value: "none" },
] as const satisfies readonly { label: string; value: QuestButtonIndicatorMode; }[];

const questButtonClickOptions = [
    { label: "فتح المهام", value: "open-quests" },
    { label: "قائمة السياق", value: "context-menu" },
    { label: "إعدادات الإضافة", value: "plugin-settings" },
    { label: "لا شيء", value: "nothing" },
] as const satisfies readonly { label: string; value: QuestButtonAction; }[];

const questButtonRewardTypeOptions = [
    { label: "كرات", value: QuestRewardType.VIRTUAL_CURRENCY },
    { label: "أكواد Nitro", value: QuestRewardType.FRACTIONAL_PREMIUM },
    { label: "أكواد المكافآت", value: QuestRewardType.REWARD_CODE },
    { label: "عناصر داخل اللعبة", value: QuestRewardType.IN_GAME },
    { label: "مقتنيات الملف الشخصي", value: QuestRewardType.COLLECTIBLE },
] as const satisfies readonly QuestButtonIncludedTypeOption[];

const questButtonQuestTypeOptions = [
    { label: "مشاهدة فيديو", value: QuestTaskType.WATCH_VIDEO },
    { label: "مشاهدة فيديو على الجوال", value: QuestTaskType.WATCH_VIDEO_ON_MOBILE },
    { label: "إنجاز في نشاط", value: QuestTaskType.ACHIEVEMENT_IN_ACTIVITY },
    { label: "إنجاز في لعبة", value: QuestTaskType.ACHIEVEMENT_IN_GAME },
    { label: "تشغيل نشاط", value: QuestTaskType.PLAY_ACTIVITY },
    { label: "اللعب على سطح المكتب", value: QuestTaskType.PLAY_ON_DESKTOP },
    { label: "اللعب على سطح المكتب V2", value: QuestTaskType.PLAY_ON_DESKTOP_V2 },
    { label: "البث على سطح المكتب", value: QuestTaskType.STREAM_ON_DESKTOP },
    { label: "اللعب على PlayStation", value: QuestTaskType.PLAY_ON_PLAYSTATION },
    { label: "اللعب على Xbox", value: QuestTaskType.PLAY_ON_XBOX },
] as const satisfies readonly QuestButtonIncludedTypeOption[];

function toManaOptions<T extends string | number>(options: readonly { label: string; value: T; }[]): ManaSelectOption[] {
    return options.map(({ label, value }) => ({
        id: String(value),
        label,
        value: String(value),
    }));
}

const questButtonDisplayManaOptions = toManaOptions(questButtonDisplayOptions);
const questButtonIndicatorManaOptions = toManaOptions(questButtonIndicatorOptions);
const questButtonClickManaOptions = toManaOptions(questButtonClickOptions);
const questButtonRewardTypeManaOptions = toManaOptions(questButtonRewardTypeOptions);
const questButtonQuestTypeManaOptions = toManaOptions(questButtonQuestTypeOptions);

export function QuestButtonSetting(): JSX.Element {
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
                    <SettingsHeader> زر المهام </SettingsHeader>
                    <SettingsDescription> إظهار زر المهام في قائمة الخوادم مع مؤشر اختياري للمهام غير المطالَب بها. </SettingsDescription>
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
            <SettingsSubheader className="no-top-margin"> سلوك الزر </SettingsSubheader>
            <SettingsRow>
                <SettingsRowItem>
                    <SettingsSelect
                        label="إجراء النقر الأيسر:"
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
                        label="إجراء النقر الأوسط:"
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
                        label="إجراء النقر الأيمن:"
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
                        label="ظهور الزر:"
                        options={questButtonDisplayManaOptions}
                        value={questButton.questButtonDisplay}
                        selectionMode="single"
                        disabled={disabled}
                        fullWidth={true}
                        onSelectionChange={updateQuestButtonDisplay}
                        tooltip={{
                            position: "top",
                            text: "دائماً يُظهر زر المهام متى كانت هذه الميزة مُفعَّلة."
                                + "\n\nغير مطالَب يُظهره فقط عند وجود مكافآت مهام غير مطالَب بها."
                                + "\n\nأبداً يُخفي زر المهام."
                        }}
                    />
                </SettingsRowItem>
                <SettingsRowItem>
                    <SettingsSelect
                        label="مؤشر غير المطالَب:"
                        options={questButtonIndicatorManaOptions}
                        value={questButton.questButtonIndicator}
                        selectionMode="single"
                        disabled={disabled}
                        fullWidth={true}
                        onSelectionChange={updateQuestButtonIndicator}
                        tooltip={{
                            position: "top",
                            text: "الشريط يُظهر علامة Discord لغير المقروء بجانب زر المهام."
                                + "\n\nالشارة تُظهر عدد مكافآت المهام غير المطالَب بها."
                                + "\n\nكلاهما يُظهر الشريط والشارة معاً."
                                + "\n\nلا شيء يُخفي المؤشرات."
                        }}
                    />
                </SettingsRowItem>
                <SettingsRowItem>
                    <SettingsColorPicker
                        label="لون الشارة:"
                        className="quest-button-color-picker"
                        color={questButton.questButtonBadgeColor}
                        disabled={disabled}
                        onChange={updateBadgeColor}
                        showEyeDropper={true}
                    />
                </SettingsRowItem>
            </SettingsRow>
            <SettingsSubheader> صلة المهام </SettingsSubheader>
            <SettingsSelect
                label="أنواع المكافآت المُضمَّنة:"
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
                    text: "احسب فقط المهام ذات هذه الأنواع من المكافآت كغير مطالَب بها عند تحديد ظهور الزر وعدد الشارة وسلوك التنبيه."
                }}
            />
            <SettingsSelect
                label="أنواع المهام المُضمَّنة:"
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
                    text: "احسب فقط المهام ذات هذه الأنواع كغير مطالَب بها عند تحديد ظهور الزر وعدد الشارة وسلوك التنبيه."
                }}
            />
        </SettingsCard>
    );
}
