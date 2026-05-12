/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { JSX } from "react";

import { getQuestifySettings, useQuestifySettings } from "../settings/access";
import { defaultQuestOrder, type QuestOrderStatus, type QuestSubsort } from "../settings/def";
import { rerenderQuests } from "../settings/rerender";
import { type ManaSelectOption, SettingsCard, SettingsDescription, SettingsHeader, SettingsRow, SettingsRowItem, SettingsSelect, SettingsSubheader, SettingsSubtleSwitch } from "./shared";

const questStatusOptions = [
    { label: "غير مطالَب", value: "UNCLAIMED" },
    { label: "مطالَب", value: "CLAIMED" },
    { label: "مُتجاهَل", value: "IGNORED" },
    { label: "منتهي", value: "EXPIRED" },
] as const satisfies readonly { label: string, value: QuestOrderStatus; }[];

const questStatusManaOptions: ManaSelectOption[] = questStatusOptions.map(({ label, value }) => ({
    id: value,
    label,
    value,
}));

const baseSubsortOptions = [
    { label: "الأحدث إضافةً", value: "Recent DESC" },
    { label: "الأقدم إضافةً", value: "Recent ASC" },
] as const satisfies readonly { label: string, value: QuestSubsort; }[];

const expiringSubsortOptions = [
    ...baseSubsortOptions,
    { label: "الأقرب انتهاءً", value: "Expiring ASC" },
    { label: "الأبعد انتهاءً", value: "Expiring DESC" },
] as const satisfies readonly { label: string, value: QuestSubsort; }[];

const expiredSubsortOptions = [
    ...baseSubsortOptions,
    { label: "الأحدث انتهاءً", value: "Expiring DESC" },
    { label: "الأقدم انتهاءً", value: "Expiring ASC" },
] as const satisfies readonly { label: string, value: QuestSubsort; }[];

const claimedSubsortOptions = [
    ...baseSubsortOptions,
    { label: "الأحدث مطالبةً", value: "Claimed DESC" },
    { label: "الأقدم مطالبةً", value: "Claimed ASC" },
] as const satisfies readonly { label: string, value: QuestSubsort; }[];

function toManaOptions(options: readonly { label: string, value: QuestSubsort; }[]): ManaSelectOption[] {
    return options.map(({ label, value }) => ({
        id: value,
        label,
        value,
    }));
}

const unclaimedSubsortManaOptions = toManaOptions(expiringSubsortOptions);
const claimedSubsortManaOptions = toManaOptions(claimedSubsortOptions);
const ignoredSubsortManaOptions = toManaOptions(expiringSubsortOptions);
const expiredSubsortManaOptions = toManaOptions(expiredSubsortOptions);
const positionLabels = ["الأول", "الثاني", "الثالث", "الرابع"] as const;
const subsortTooltips = {
    unclaimedSubsort: "تبقى المهام المكتملة وغير المطالَب بها أسفل المهام غير المكتملة، ثم يُطبَّق هذا الترتيب الفرعي داخل كل مجموعة.",
    claimedSubsort: "يمكن ترتيب المهام المطالَب بها حسب وقت المطالبة أو وقت إضافة المهمة.",
    ignoredSubsort: "تحتفظ المهام المُتجاهَلة بموضعها ضمن المجموعة المتجاهلة، ويتحكم هذا الترتيب في ترتيبها داخل تلك المجموعة.",
    expiredSubsort: "يمكن ترتيب المهام المنتهية حسب وقت الانتهاء أو وقت الإضافة.",
} as const;

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
            <SettingsHeader> إعادة ترتيب المهام </SettingsHeader>
            <SettingsDescription> رتّب المهام حسب حالتها عند تحديد خيار الترتيب Questify في صفحة المهام. </SettingsDescription>
            <SettingsSubheader> ترتيب الحالة </SettingsSubheader>
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
                                text: "لا يمكن تكرار الحالة في أكثر من موضع. اختيار حالة مستخدمة في موضع آخر يُبادل الموضعين."
                            }}
                        />
                    </SettingsRowItem>
                ))}
            </SettingsRow>
            <SettingsSubheader> الترتيب الفرعي </SettingsSubheader>
            <SettingsRow>
                <SettingsRowItem>
                    <SettingsSelect
                        label="ترتيب غير المطالَب فرعياً:"
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
                        label="ترتيب المطالَب فرعياً:"
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
                        label="ترتيب المُتجاهَل فرعياً:"
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
                        label="ترتيب المنتهي فرعياً:"
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
            <SettingsSubheader> ذاكرة صفحة المهام </SettingsSubheader>
            <SettingsSubtleSwitch
                checked={reorderQuests.rememberQuestPageSort}
                disabled={disabled}
                label="تذكر ترتيب صفحة المهام المحدد:"
                onChange={checked => updateRememberSetting("rememberQuestPageSort", checked)}
                bottomSpacing="5"
                tooltip={{
                    position: "top",
                    text: "عند التعطيل، تفتح صفحة المهام دائماً بخيار الترتيب Questify."
                }}
            />
            <SettingsSubtleSwitch
                checked={reorderQuests.rememberQuestPageFilters}
                disabled={disabled}
                label="تذكر فلاتر صفحة المهام المحددة:"
                onChange={checked => updateRememberSetting("rememberQuestPageFilters", checked)}
                tooltip={{
                    position: "top",
                    text: "عند التعطيل، تفتح صفحة المهام بدون فلاتر مهام أو مكافآت في كل مرة."
                }}
            />
        </SettingsCard>
    );
}
