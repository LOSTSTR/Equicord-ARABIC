/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { QuestTaskType } from "@vencord/discord-types/enums";
import type { JSX } from "react";

import { getQuestifySettings, useQuestifySettings } from "../settings/access";
import { autoCompleteQuestTaskTypes, defaultAllowChangingDangerousSettings, defaultAutoCompleteQuestsSimultaneously, defaultAutoCompleteQuestTypes, defaultCompleteVideoQuestsQuicker, defaultMakeMobileVideoQuestsDesktopCompatible, defaultResumeInterruptedQuests, isDesktopCompatible } from "../settings/def";
import { Alerts, q } from "../utils/ui";
import { ManaButton, type ManaSelectOption, SettingsCard, SettingsDescription, SettingsHeader, SettingsNotice, SettingsParagraph, SettingsSelect, SettingsSubheader, SettingsSubtleSwitch } from "./shared";

type QuestDisableSettingKey =
    | "disableAccountPanelPromo"
    | "disableAccountPanelQuestProgress"
    | "disableFriendsListPromo"
    | "disableMembersListPromo"
    | "disableOrbsAndQuestsBadges"
    | "disableRelocationNotices"
    | "disableSponsoredBanner";

type QuestModifySettingKey =
    | "autoCompleteQuestsSimultaneously"
    | "resumeInterruptedQuests"
    | "completeVideoQuestsQuicker"
    | "makeMobileVideoQuestsDesktopCompatible";

interface QuestDisableOption {
    key: QuestDisableSettingKey;
    label: string;
}

const disableFeatureOptions = [
    {
        key: "disableSponsoredBanner",
        label: "البانر الممول",
    },
    {
        key: "disableRelocationNotices",
        label: "إشعارات نقل المهام",
    },
    {
        key: "disableFriendsListPromo",
        label: "عروض قائمة الأصدقاء",
    },
    {
        key: "disableMembersListPromo",
        label: "عروض قائمة الأعضاء",
    },
    {
        key: "disableAccountPanelPromo",
        label: "عرض لوحة الحساب",
    },
    {
        key: "disableAccountPanelQuestProgress",
        label: "تقدّم لوحة الحساب",
    },
    {
        key: "disableOrbsAndQuestsBadges",
        label: "شارات المهام والكرات",
    },
] as const satisfies readonly QuestDisableOption[];

const disableManaOptions: ManaSelectOption[] = disableFeatureOptions.map(({ key, label }) => ({
    id: key,
    label,
    value: key,
}));

const autoCompleteQuestTypeLabels = {
    [QuestTaskType.WATCH_VIDEO]: "مشاهدة فيديو",
    [QuestTaskType.WATCH_VIDEO_ON_MOBILE]: "مشاهدة فيديو على الجوال",
    [QuestTaskType.ACHIEVEMENT_IN_ACTIVITY]: "إنجاز في نشاط",
    [QuestTaskType.PLAY_ACTIVITY]: "تشغيل نشاط",
    [QuestTaskType.PLAY_ON_DESKTOP]: "اللعب على سطح المكتب",
    [QuestTaskType.PLAY_ON_PLAYSTATION]: "اللعب على PlayStation",
    [QuestTaskType.PLAY_ON_XBOX]: "اللعب على Xbox",
} as const satisfies Record<typeof autoCompleteQuestTaskTypes[number], string>;

const autoCompleteQuestTypeOptions = autoCompleteQuestTaskTypes.map(questType => ({
    label: autoCompleteQuestTypeLabels[questType],
    value: questType,
})) satisfies { label: string; value: QuestTaskType; }[];

const autoCompleteQuestTypeManaOptions: ManaSelectOption[] = autoCompleteQuestTypeOptions.map(({ label, value }) => ({
    id: String(value),
    label,
    value: String(value),
    disabled: !isDesktopCompatible(value),
}));

interface SettingsAllowDangerousButtonProps {
    allowed: boolean;
    disabled?: boolean;
    onClick?: (e: React.MouseEvent) => void;
}

function SettingsAllowDangerousButton({
    allowed,
    disabled,
    onClick,
}: SettingsAllowDangerousButtonProps): JSX.Element {
    return (
        <div className={q("settings-button", "allow-dangerous-button")}>
            <ManaButton
                text={allowed
                    ? "إعادة الضبط وحظر تغيير الإعدادات الخطرة..."
                    : "السماح بتغيير الإعدادات الخطرة..."}
                variant={allowed ? "critical-secondary" : "critical-primary"}
                fullWidth={true}
                disabled={disabled}
                onClick={onClick}
                size="sm"
            />
        </div>
    );
}

export function QuestFeaturesSetting(): JSX.Element {
    const questFeatures = useQuestifySettings([
        "disableQuestsEverything",
        "disableSponsoredBanner",
        "disableRelocationNotices",
        "disableFriendsListPromo",
        "disableMembersListPromo",
        "disableAccountPanelPromo",
        "disableAccountPanelQuestProgress",
        "disableOrbsAndQuestsBadges",
        "resumeInterruptedQuests",
        "allowChangingDangerousSettings",
        "makeMobileVideoQuestsDesktopCompatible",
        "autoCompleteQuestsSimultaneously",
        "autoCompleteQuestTypes",
        "completeVideoQuestsQuicker",
    ]);

    const selectedDisableValues = disableFeatureOptions
        .filter(({ key }) => questFeatures[key])
        .map(({ key }) => key);

    const selectedAutoCompleteQuestTypeValues = autoCompleteQuestTypeOptions
        .filter(({ value }) => isDesktopCompatible(value) && questFeatures.autoCompleteQuestTypes[value] === true)
        .map(({ value }) => String(value));

    function updateDisableValue(value: string | string[] | null) {
        const selectedKeys = new Set(Array.isArray(value) ? value : value ? [value] : []);

        for (const { key } of disableFeatureOptions) {
            getQuestifySettings()[key] = selectedKeys.has(key);
        }
    }

    function confirmDangerousSettingChange(body: string, onConfirm: () => void) {
        Alerts.show({
            title: "هل أنت متأكد؟",
            body,
            confirmText: "متابعة",
            confirmVariant: "critical-primary",
            cancelText: "إلغاء",
            onConfirm,
        });
    }

    function updateAutoCompleteQuestTypes(value: string | string[] | null) {
        const selectedValues = new Set(Array.isArray(value) ? value : value ? [value] : []);
        const nextAutoCompleteQuestTypes = { ...defaultAutoCompleteQuestTypes };

        for (const { value: questType } of autoCompleteQuestTypeOptions) {
            const nextValue = selectedValues.has(String(questType))
                && isDesktopCompatible(questType);

            nextAutoCompleteQuestTypes[questType] = nextValue;
        }

        getQuestifySettings().autoCompleteQuestTypes = nextAutoCompleteQuestTypes;
    }

    function updateDisableEverything(checked: boolean) {
        function setDisableEverything() {
            getQuestifySettings().disableQuestsEverything = checked;
        }

        if (checked) {
            confirmDangerousSettingChange(
                "سيؤدي هذا إلى تعطيل وظائف المهام بالكامل.",
                () => {
                    resetDangerousSettings();
                    setDisableEverything();
                }
            );
        } else {
            setDisableEverything();
        }
    }

    function resetDangerousSettings() {
        const settings = getQuestifySettings();

        settings.allowChangingDangerousSettings = defaultAllowChangingDangerousSettings;
        settings.autoCompleteQuestsSimultaneously = defaultAutoCompleteQuestsSimultaneously;
        settings.completeVideoQuestsQuicker = defaultCompleteVideoQuestsQuicker;
        settings.makeMobileVideoQuestsDesktopCompatible = defaultMakeMobileVideoQuestsDesktopCompatible;
        settings.resumeInterruptedQuests = defaultResumeInterruptedQuests;
        settings.autoCompleteQuestTypes = { ...defaultAutoCompleteQuestTypes };
    }

    function updateDangerousAccess(checked: boolean) {
        function setDangerousAccess() {
            getQuestifySettings().allowChangingDangerousSettings = checked;
        }

        if (checked) {
            confirmDangerousSettingChange(
                "سيسمح هذا بتغيير الإعدادات الخطرة.",
                setDangerousAccess
            );
        } else {
            resetDangerousSettings();
            setDangerousAccess();
        }
    }

    function updateModifyValue(key: QuestModifySettingKey, checked: boolean) {
        getQuestifySettings()[key] = checked;
    }

    return (
        <SettingsCard>
            <SettingsHeader> ميزات المهام </SettingsHeader>
            <SettingsDescription> عدّل سلوك المهام لتحسين الوظائف أو إزالتها. </SettingsDescription>
            <SettingsSubheader> تعطيل الميزات </SettingsSubheader>
            <SettingsSubtleSwitch
                checked={questFeatures.disableQuestsEverything}
                label="تعطيل وظائف المهام بالكامل:"
                onChange={updateDisableEverything}
                bottomSpacing="10"
                tooltip={{
                    position: "top",
                    text: "سيؤدي هذا إلى تعطيل جميع تحسينات الإضافة، وإخفاء صفحة المهام وعناصرها في Discord، ومنع Discord من جلب بيانات المهام. لن يؤثر هذا على المتجر لأن الكرات مرتبطة به بشكل أساسي كعملة ثانوية."
                }}
            />
            <SettingsSelect
                label="تعطيل ميزات محددة:"
                wrapTags={true}
                options={disableManaOptions}
                value={selectedDisableValues}
                closeOnSelect={false}
                maxOptionsVisible={7}
                selectionMode="multiple"
                disabled={questFeatures.disableQuestsEverything}
                onSelectionChange={updateDisableValue}
                tooltip={{
                    position: "top",
                    text: "البانر الممول هو بانر مهام مدفوع يظهر في أعلى صفحة المهام."
                        + "\n\nإشعارات نقل المهام هي مؤشرات في صفحة الاستكشاف تشير إلى نقل المهام إلى الرسائل المباشرة."
                        + "\n\nعروض قائمة الأصدقاء هي بطاقة تظهر في قسم \"نشط الآن\" بينما يلعب أحد أصدقائك لعبة بها مهمة نشطة."
                        + "\n\nعروض قائمة الأعضاء هي أيقونة تظهر على الأعضاء في قائمة الخادم بينما يلعبون لعبة بها مهمة نشطة."
                        + "\n\nعرض لوحة الحساب هو ترويج مدفوع للمهام يظهر فوق لوحة حسابك."
                        + "\n\nتقدّم لوحة الحساب هو عرض تقدّم المهمة النشطة أو المكتملة فوق لوحة حسابك."
                        + "\n\nشارات المهام والكرات هي شارات على ملفات المستخدمين لمن أتمّ مهمة واحدة على الأقل أو اشترى شارة الكرات."
                }}
            />
            <SettingsSubheader> تعديل الميزات </SettingsSubheader>
            <SettingsNotice className={["notice-card-red", questFeatures.disableQuestsEverything ? "dimmed-settings-item" : undefined, questFeatures.allowChangingDangerousSettings ? undefined : "notice-card-solo", "no-bottom-margin"].filter(c => c !== undefined)}>
                <SettingsParagraph>
                    بدأ Discord بإصدار تحذيرات للمستخدمين الذين يستخدمون سكريبتات أو إضافات تعدّل طريقة إكمال المهام، وهو ما يتعارض مع <a href="https://discord.com/safety/platform-manipulation-policy-explainer" target="_blank" rel="noreferrer">شروط الخدمة</a>.
                </SettingsParagraph>
                <br />
                <SettingsParagraph>
                    تبدو التحذيرات مقتصرة على التهديد بفقدان الوصول إلى المهام أو مكافآتها، لكن Discord قد يتخذ إجراءات أشد في أي وقت.
                </SettingsParagraph>
                <br />
                <SettingsParagraph>
                    نظراً للأساليب المتعددة التي يستخدمها Discord لتتبع المستخدمين، لا توجد طريقة واقعية لتجنب الاكتشاف. إذا تابعت، فافهم أن Discord على الأرجح سيكتشف ذلك في مرحلة ما.
                </SettingsParagraph>
                <br />
                <SettingsParagraph>
                    استخدم التبديل التالي للوصول إلى الإعدادات الخطرة على مسؤوليتك الخاصة.
                </SettingsParagraph>
                <SettingsAllowDangerousButton
                    allowed={questFeatures.allowChangingDangerousSettings}
                    disabled={questFeatures.disableQuestsEverything}
                    onClick={() => updateDangerousAccess(!questFeatures.allowChangingDangerousSettings)}
                />
                {questFeatures.allowChangingDangerousSettings && <>
                    <SettingsSubtleSwitch
                        disabled={questFeatures.disableQuestsEverything || !questFeatures.allowChangingDangerousSettings}
                        checked={questFeatures.completeVideoQuestsQuicker}
                        label="تسريع الإكمال التلقائي لمهام الفيديو:"
                        onChange={checked => updateModifyValue("completeVideoQuestsQuicker", checked)}
                        topSpacing="10"
                        bottomSpacing="5"
                        tooltip={{
                            position: "top",
                            text: "يسمح Discord بإكمال مهام الفيديو بعد مرور 24 ثانية أقل من مدة الفيديو منذ تسجيلك في المهمة."
                                + "\n\nهذا يعني أنه إذا كانت مهمة الفيديو 24 ثانية أو أقل، أو إذا سجّلت في مهمة فيديو وعدت لاحقاً لإكمالها، يمكن إكمالها فوراً."
                                + "\n\nينطبق هذا الإعداد فقط على الإكمال التلقائي لمهام الفيديو ويعتمد على إعداد الإكمال التلقائي أدناه. إكمال مهام الفيديو يدوياً سيظل يتطلب الانتظار المدة الكاملة."
                        }}
                    />
                    <SettingsSubtleSwitch
                        disabled={questFeatures.disableQuestsEverything || !questFeatures.allowChangingDangerousSettings}
                        checked={questFeatures.makeMobileVideoQuestsDesktopCompatible}
                        label="جعل بعض مهام الفيديو للجوال قابلة للإكمال على سطح المكتب:"
                        onChange={checked => updateModifyValue("makeMobileVideoQuestsDesktopCompatible", checked)}
                        bottomSpacing="5"
                        tooltip={{
                            position: "top",
                            text: "بعض مهام الفيديو للجوال يمكن التسجيل فيها على سطح المكتب، لكن يجب إكمالها على الجوال. سيتيح هذا الإعداد إكمالها على سطح المكتب."
                                + "\n\nبعض مهام الفيديو للجوال تقتصر على التسجيل عبر الجوال. للتأثير عليها بهذا الإعداد، يجب التسجيل فيها أولاً على جهازك المحمول."
                                + "\n\nعند تمكينه بشكل مستقل، ينطبق هذا الإعداد فقط على إكمال مهام الفيديو يدوياً."
                        }}
                    />
                    <SettingsSubtleSwitch
                        disabled={questFeatures.disableQuestsEverything || !questFeatures.allowChangingDangerousSettings}
                        checked={questFeatures.autoCompleteQuestsSimultaneously}
                        label="إكمال المهام تلقائياً في آنٍ واحد بدلاً من الترتيب:"
                        onChange={checked => updateModifyValue("autoCompleteQuestsSimultaneously", checked)}
                        bottomSpacing="5"
                        tooltip={{
                            position: "top",
                            text: "افتراضياً، محاولة الإكمال التلقائي لعدة مهام ستضعها في طابور للإكمال بالترتيب."
                                + "\n\nسيتيح هذا الإعداد تشغيل جميع مهام الإكمال التلقائي في نفس الوقت."
                                + "\n\nينطبق هذا الإعداد فقط على الإكمال التلقائي للمهام."
                        }}
                    />
                    <SettingsSubtleSwitch
                        disabled={questFeatures.disableQuestsEverything || !questFeatures.allowChangingDangerousSettings}
                        checked={questFeatures.resumeInterruptedQuests}
                        label="استئناف الإكمال التلقائي المنقطع بعد إعادة التحميل أو التشغيل:"
                        onChange={checked => updateModifyValue("resumeInterruptedQuests", checked)}
                        bottomSpacing="5"
                        tooltip={{
                            position: "top",
                            text: "سيستأنف هذا الإعداد تلقائياً أي إكمال تلقائي منقطع بسبب إعادة التحميل أو إعادة التشغيل، بما في ذلك إعادة وضع المهام في الطابور."
                        }}
                    />
                    <SettingsSelect
                        label="الإكمال التلقائي لأنواع مهام محددة:"
                        labelClassName="margin-top-9"
                        wrapTags={true}
                        options={autoCompleteQuestTypeManaOptions}
                        value={selectedAutoCompleteQuestTypeValues}
                        closeOnSelect={false}
                        maxOptionsVisible={7}
                        selectionMode="multiple"
                        disabled={questFeatures.disableQuestsEverything || !questFeatures.allowChangingDangerousSettings}
                        onSelectionChange={updateAutoCompleteQuestTypes}
                        tooltip={{
                            position: "top",
                            wider: true,
                            text: "مهام مشاهدة الفيديو على الجوال تعمل فقط مع المهام القابلة للتسجيل على سطح المكتب. إذا كانت المهمة مقيدة بالتسجيل عبر الجوال، يجب التسجيل فيها أولاً على جهازك المحمول."
                                + "\n\nجميع مهام الفيديو ترسل عادةً stack trace مع تقارير التقدم. تمحو Questify هذا الـ stack trace، لكن غيابه سيكون دليلاً مثل وجوده."
                                + "\n\nمهام اللعب على سطح المكتب وPlayStation وXbox والأنشطة متاحة فقط على العملاء الرسميين. العملاء الخارجيون كـ Vesktop وEquibop لا يدعمون الإكمال التلقائي لهذه الأنواع."
                                + "\n\nمهام الإنجاز في النشاط يمكن إكمالها تلقائياً فوراً فقط. قد تُعطَّل هذه الطريقة في أي وقت."
                                + "\n\nالإكمال التلقائي يتم بالنقر على أزرار المهام في صفحة المهام. ستُكمَل بالترتيب ما لم يُفعَّل إعداد الإكمال المتزامن."
                                + "\n\nالإكمال التلقائي للمهام هو الإعداد الخطر الأكثر خطورة. فعّله على مسؤوليتك الخاصة."
                        }}
                    />
                </>}
            </SettingsNotice>
        </SettingsCard>
    );
}
