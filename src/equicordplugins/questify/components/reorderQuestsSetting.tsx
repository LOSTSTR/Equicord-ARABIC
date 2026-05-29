/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { useSettings } from "@api/Settings";
import { t } from "@utils/esharqI18n";
import type { JSX } from "react";

import { getQuestifySettings, useQuestifySettings } from "../settings/access";
import { defaultQuestOrder, type QuestOrderStatus, type QuestSubsort } from "../settings/def";
import { rerenderQuests } from "../settings/rerender";
import { type ManaSelectOption, SettingsCard, SettingsDescription, SettingsHeader, SettingsRow, SettingsRowItem, SettingsSelect, SettingsSubheader, SettingsSubtleSwitch } from "./shared";

function getQuestStatusOptions(): readonly { label: string, value: QuestOrderStatus; }[] {
    return [
        { label: t("غير مطالَب", "Unclaimed"), value: "UNCLAIMED" },
        { label: t("مطالَب", "Claimed"), value: "CLAIMED" },
        { label: t("مُتجاهَل", "Ignored"), value: "IGNORED" },
        { label: t("منتهي", "Expired"), value: "EXPIRED" },
    ];
}

function getBaseSubsortOptions(): readonly { label: string, value: QuestSubsort; }[] {
    return [
        { label: t("الأحدث إضافةً", "Newest added"), value: "Recent DESC" },
        { label: t("الأقدم إضافةً", "Oldest added"), value: "Recent ASC" },
    ];
}

function getExpiringSubsortOptions(): readonly { label: string, value: QuestSubsort; }[] {
    return [
        ...getBaseSubsortOptions(),
        { label: t("الأقرب انتهاءً", "Soonest expiring"), value: "Expiring ASC" },
        { label: t("الأبعد انتهاءً", "Latest expiring"), value: "Expiring DESC" },
    ];
}

function getExpiredSubsortOptions(): readonly { label: string, value: QuestSubsort; }[] {
    return [
        ...getBaseSubsortOptions(),
        { label: t("الأحدث انتهاءً", "Most recently expired"), value: "Expiring DESC" },
        { label: t("الأقدم انتهاءً", "Oldest expired"), value: "Expiring ASC" },
    ];
}

function getClaimedSubsortOptions(): readonly { label: string, value: QuestSubsort; }[] {
    return [
        ...getBaseSubsortOptions(),
        { label: t("الأحدث مطالبةً", "Most recently claimed"), value: "Claimed DESC" },
        { label: t("الأقدم مطالبةً", "Oldest claimed"), value: "Claimed ASC" },
    ];
}

function toManaOptions(options: readonly { label: string, value: QuestSubsort; }[]): ManaSelectOption[] {
    return options.map(({ label, value }) => ({
        id: value,
        label,
        value,
    }));
}

function getPositionLabels(): string[] {
    return [
        t("الأول", "1st"),
        t("الثاني", "2nd"),
        t("الثالث", "3rd"),
        t("الرابع", "4th"),
    ];
}

function getSubsortTooltips() {
    return {
        unclaimedSubsort: t(
            "تبقى المهام المكتملة وغير المطالَب بها أسفل المهام غير المكتملة، ثم يُطبَّق هذا الترتيب الفرعي داخل كل مجموعة.",
            "Completed unclaimed quests remain below incomplete ones, then this sub-sort is applied within each group."
        ),
        claimedSubsort: t(
            "يمكن ترتيب المهام المطالَب بها حسب وقت المطالبة أو وقت إضافة المهمة.",
            "Claimed quests can be sorted by claim time or quest addition time."
        ),
        ignoredSubsort: t(
            "تحتفظ المهام المُتجاهَلة بموضعها ضمن المجموعة المتجاهلة، ويتحكم هذا الترتيب في ترتيبها داخل تلك المجموعة.",
            "Ignored quests retain their position within the ignored group, and this sort controls their order within that group."
        ),
        expiredSubsort: t(
            "يمكن ترتيب المهام المنتهية حسب وقت الانتهاء أو وقت الإضافة.",
            "Expired quests can be sorted by expiry time or addition time."
        ),
    };
}

function sanitizeQuestOrder(order: unknown): QuestOrderStatus[] {
    const validStatuses = new Set<QuestOrderStatus>(defaultQuestOrder);
    const sanitized = Array.isArray(order)
        ? order.filter((status): status is QuestOrderStatus => validStatuses.has(status as QuestOrderStatus))
        : [];

    for (const status of defaultQuestOrder) {
        if (!sanitized.includes(status)) {
            sanitized.push(status);
        }
    }

    return sanitized.slice(0, defaultQuestOrder.length);
}

export function ReorderQuestsSetting(): JSX.Element {
    useSettings(["plugins.Settings.arabicMode"]);

    const reorderQuests = useQuestifySettings([
        "disableQuestsEverything",
        "questOrder",
        "unclaimedSubsort",
        "claimedSubsort",
        "ignoredSubsort",
        "expiredSubsort",
        "rememberQuestPageSort",
        "rememberQuestPageFilters",
    ]);

    const questStatusOptions = getQuestStatusOptions();
    const questStatusManaOptions: ManaSelectOption[] = questStatusOptions.map(({ label, value }) => ({
        id: value,
        label,
        value,
    }));
    const unclaimedSubsortManaOptions = toManaOptions(getExpiringSubsortOptions());
    const claimedSubsortManaOptions = toManaOptions(getClaimedSubsortOptions());
    const ignoredSubsortManaOptions = toManaOptions(getExpiringSubsortOptions());
    const expiredSubsortManaOptions = toManaOptions(getExpiredSubsortOptions());
    const positionLabels = getPositionLabels();
    const subsortTooltips = getSubsortTooltips();

    const disabled = reorderQuests.disableQuestsEverything;
    const questOrder = sanitizeQuestOrder(reorderQuests.questOrder);

    function updateQuestOrder(index: number, value: string | string[] | null): void {
        if (typeof value !== "string") return;

        const nextStatus = value as QuestOrderStatus;
        const nextOrder = [...questOrder];
        const previousStatus = nextOrder[index];
        const existingIndex = nextOrder.indexOf(nextStatus);

        if (existingIndex !== -1 && existingIndex !== index) {
            nextOrder[existingIndex] = previousStatus;
        }

        nextOrder[index] = nextStatus;
        getQuestifySettings().questOrder = nextOrder;
        rerenderQuests();
    }

    function updateSubsort(key: "unclaimedSubsort" | "claimedSubsort" | "ignoredSubsort" | "expiredSubsort", value: string | string[] | null): void {
        if (typeof value !== "string") return;

        getQuestifySettings()[key] = value;
        rerenderQuests();
    }

    function updateRememberSetting(key: "rememberQuestPageSort" | "rememberQuestPageFilters", checked: boolean): void {
        getQuestifySettings()[key] = checked;
    }

    return (
        <SettingsCard>
            <SettingsHeader>{t("إعادة ترتيب المهام", "Reorder Quests")}</SettingsHeader>
            <SettingsDescription>{t("رتّب المهام حسب حالتها عند تحديد خيار الترتيب Questify في صفحة المهام.", "Sort quests by status when the Questify sort option is selected on the quests page.")}</SettingsDescription>
            <SettingsSubheader>{t("ترتيب الحالة", "Status Order")}</SettingsSubheader>
            <SettingsRow>
                {questOrder.map((status, index) => (
                    <SettingsRowItem key={index}>
                        <SettingsSelect
                            label={`${positionLabels[index]}:`}
                            options={questStatusManaOptions}
                            value={status}
                            selectionMode="single"
                            disabled={disabled}
                            fullWidth={true}
                            maxOptionsVisible={questStatusManaOptions.length}
                            onSelectionChange={value => updateQuestOrder(index, value)}
                            tooltip={{
                                position: "top",
                                text: t(
                                    "لا يمكن تكرار الحالة في أكثر من موضع. اختيار حالة مستخدمة في موضع آخر يُبادل الموضعين.",
                                    "A status cannot appear in more than one position. Selecting a status already used in another position swaps the two positions."
                                )
                            }}
                        />
                    </SettingsRowItem>
                ))}
            </SettingsRow>
            <SettingsSubheader>{t("الترتيب الفرعي", "Sub-sort")}</SettingsSubheader>
            <SettingsRow>
                <SettingsRowItem>
                    <SettingsSelect
                        label={t("ترتيب غير المطالَب فرعياً:", "Unclaimed sub-sort:")}
                        options={unclaimedSubsortManaOptions}
                        value={reorderQuests.unclaimedSubsort}
                        selectionMode="single"
                        disabled={disabled}
                        fullWidth={true}
                        maxOptionsVisible={unclaimedSubsortManaOptions.length}
                        onSelectionChange={value => updateSubsort("unclaimedSubsort", value)}
                        tooltip={{
                            position: "top",
                            text: subsortTooltips.unclaimedSubsort
                        }}
                    />
                </SettingsRowItem>
                <SettingsRowItem>
                    <SettingsSelect
                        label={t("ترتيب المطالَب فرعياً:", "Claimed sub-sort:")}
                        options={claimedSubsortManaOptions}
                        value={reorderQuests.claimedSubsort}
                        selectionMode="single"
                        disabled={disabled}
                        fullWidth={true}
                        maxOptionsVisible={claimedSubsortManaOptions.length}
                        onSelectionChange={value => updateSubsort("claimedSubsort", value)}
                        tooltip={{
                            position: "top",
                            text: subsortTooltips.claimedSubsort
                        }}
                    />
                </SettingsRowItem>
            </SettingsRow>
            <SettingsRow>
                <SettingsRowItem>
                    <SettingsSelect
                        label={t("ترتيب المُتجاهَل فرعياً:", "Ignored sub-sort:")}
                        options={ignoredSubsortManaOptions}
                        value={reorderQuests.ignoredSubsort}
                        selectionMode="single"
                        disabled={disabled}
                        fullWidth={true}
                        maxOptionsVisible={ignoredSubsortManaOptions.length}
                        onSelectionChange={value => updateSubsort("ignoredSubsort", value)}
                        tooltip={{
                            position: "top",
                            text: subsortTooltips.ignoredSubsort
                        }}
                    />
                </SettingsRowItem>
                <SettingsRowItem>
                    <SettingsSelect
                        label={t("ترتيب المنتهي فرعياً:", "Expired sub-sort:")}
                        options={expiredSubsortManaOptions}
                        value={reorderQuests.expiredSubsort}
                        selectionMode="single"
                        disabled={disabled}
                        fullWidth={true}
                        maxOptionsVisible={expiredSubsortManaOptions.length}
                        onSelectionChange={value => updateSubsort("expiredSubsort", value)}
                        tooltip={{
                            position: "top",
                            text: subsortTooltips.expiredSubsort
                        }}
                    />
                </SettingsRowItem>
            </SettingsRow>
            <SettingsSubheader>{t("ذاكرة صفحة المهام", "Quest Page Memory")}</SettingsSubheader>
            <SettingsSubtleSwitch
                checked={reorderQuests.rememberQuestPageSort}
                disabled={disabled}
                label={t("تذكر ترتيب صفحة المهام المحدد:", "Remember selected quest page sort:")}
                onChange={checked => updateRememberSetting("rememberQuestPageSort", checked)}
                bottomSpacing="5"
                tooltip={{
                    position: "top",
                    text: t(
                        "عند التعطيل، تفتح صفحة المهام دائماً بخيار الترتيب Questify.",
                        "When disabled, the quests page always opens with the Questify sort option."
                    )
                }}
            />
            <SettingsSubtleSwitch
                checked={reorderQuests.rememberQuestPageFilters}
                disabled={disabled}
                label={t("تذكر فلاتر صفحة المهام المحددة:", "Remember selected quest page filters:")}
                onChange={checked => updateRememberSetting("rememberQuestPageFilters", checked)}
                tooltip={{
                    position: "top",
                    text: t(
                        "عند التعطيل، تفتح صفحة المهام بدون فلاتر مهام أو مكافآت في كل مرة.",
                        "When disabled, the quests page opens without any quest or reward filters each time."
                    )
                }}
            />
        </SettingsCard>
    );
}
