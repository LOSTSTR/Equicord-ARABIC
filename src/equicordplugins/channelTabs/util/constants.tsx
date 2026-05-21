/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings, useSettings } from "@api/Settings";
import { Heading } from "@components/Heading";
import { Paragraph } from "@components/Paragraph";
import { ChannelTabsPreview } from "@equicordplugins/channelTabs/components/ChannelTabsContainer";
import { KeybindSettings } from "@equicordplugins/channelTabs/components/KeybindSettings";
import { t } from "@utils/esharqI18n";
import { Logger } from "@utils/Logger";
import { makeRange, OptionType } from "@utils/types";
import { SearchableSelect, useState } from "@webpack/common";
import { JSX } from "react";

interface DynamicDropdownSettingOption {
    label: string;
    value: string;
    selected: boolean;
}

function AnimationSettings(): JSX.Element {
    useSettings(["plugins.Settings.arabicMode"]);
    const animationOptions: DynamicDropdownSettingOption[] = [
        { label: t("تأثيرات التمرير فوق التبويب (رفع + تكبير)", "Tab hover effects (lift + scale)"), value: "hover", selected: settings.store.animationHover },
        { label: t("حركة رفع التبويب المحدد", "Selected tab lift animation"), value: "selection", selected: settings.store.animationSelection },
        { label: t("سحب وإفلات التبويب (شبح + إعادة ترتيب)", "Tab drag & drop (ghost + reorder)"), value: "drag-drop", selected: settings.store.animationDragDrop },
        { label: t("انزلاق دخول/خروج التبويب (إنشاء + إغلاق)", "Tab enter/exit slide (create + close)"), value: "enter-exit", selected: settings.store.animationEnterExit },
        { label: t("تكبير الأيقونة عند التحديد", "Icon pop on selection"), value: "icon-pop", selected: settings.store.animationIconPop },
        { label: t("دوران زر الإغلاق", "Close button rotation"), value: "close-rotation", selected: settings.store.animationCloseRotation },
        { label: t("نبضة زر الإضافة (+)", "Add button (+) pulse"), value: "plus-pulse", selected: settings.store.animationPlusPulse },
        { label: t("توهج شارة الإشارة", "Mention badge glow"), value: "mention-glow", selected: settings.store.animationMentionGlow },
        { label: t("توسّع الوضع المضغوط", "Compact mode expand"), value: "compact-expand", selected: settings.store.animationCompactExpand },
        { label: t("حد أزرق للتبويب المحدد", "Blue border for selected tab"), value: "selected-border", selected: settings.store.animationSelectedBorder },
        { label: t("لون خلفية التبويب المحدد", "Selected tab background color"), value: "selected-background", selected: settings.store.animationSelectedBackground },
        { label: t("تأثيرات ظل التبويب", "Tab shadow effects"), value: "tab-shadows", selected: settings.store.animationTabShadows },
        { label: t("إعادة تموضع التبويب (انتقالات سلسة)", "Tab repositioning (smooth transitions)"), value: "tab-positioning", selected: settings.store.animationTabPositioning },
        { label: t("تلاشي مقبض تغيير الحجم", "Resize handle fade"), value: "resize-handle", selected: settings.store.animationResizeHandle },
        { label: t("تدرج تبويب المهام النشطة", "Active quests tab gradient"), value: "quests-active", selected: settings.store.animationQuestsActive }
    ];

    const [currentValue, setCurrentValue] = useState(animationOptions.filter(option => option.selected).map(option => option.value));

    function updateSettingsTruthy(enabledValues: string[]) {
        animationOptions.forEach(option => {
            option.selected = enabledValues.includes(option.value);
        });

        settings.store.animationHover = enabledValues.includes("hover");
        settings.store.animationSelection = enabledValues.includes("selection");
        settings.store.animationDragDrop = enabledValues.includes("drag-drop");
        settings.store.animationEnterExit = enabledValues.includes("enter-exit");
        settings.store.animationIconPop = enabledValues.includes("icon-pop");
        settings.store.animationCloseRotation = enabledValues.includes("close-rotation");
        settings.store.animationPlusPulse = enabledValues.includes("plus-pulse");
        settings.store.animationMentionGlow = enabledValues.includes("mention-glow");
        settings.store.animationCompactExpand = enabledValues.includes("compact-expand");
        settings.store.animationSelectedBorder = enabledValues.includes("selected-border");
        settings.store.animationSelectedBackground = enabledValues.includes("selected-background");
        settings.store.animationTabShadows = enabledValues.includes("tab-shadows");
        settings.store.animationTabPositioning = enabledValues.includes("tab-positioning");
        settings.store.animationResizeHandle = enabledValues.includes("resize-handle");
        settings.store.animationQuestsActive = enabledValues.includes("quests-active");

        setCurrentValue(enabledValues);
    }

    function handleChange(values: Array<DynamicDropdownSettingOption | string>) {
        const valueStrings = values.map(v => typeof v === "string" ? v : v.value);
        const toggled = valueStrings.length > currentValue.length
            ? valueStrings.find(v => !currentValue.includes(v))
            : currentValue.find(v => !valueStrings.includes(v));

        if (toggled == null) {
            updateSettingsTruthy(valueStrings);
            return;
        }

        if (currentValue.includes(toggled)) {
            updateSettingsTruthy(currentValue.filter(v => v !== toggled));
        } else {
            updateSettingsTruthy([...currentValue, toggled]);
        }
    }

    return (
        <section>
            <Heading>Animation Controls</Heading>
            <Paragraph>
                Enable or disable specific animations for channel tabs. Each option can be toggled independently.
            </Paragraph>
            <div style={{ marginTop: "8px" }}>
                <SearchableSelect
                    placeholder="Select which animations to enable..."
                    maxVisibleItems={12}
                    clearable={true}
                    multi={true}
                    value={currentValue as any}
                    options={animationOptions}
                    onChange={handleChange}
                    closeOnSelect={false}
                />
            </div>
        </section>
    );
}

export const logger = new Logger("ChannelTabs");

export const bookmarkFolderColors = {
    Red: "#f23f42",
    Blue: "#0052b6",
    Yellow: "#f0b132",
    Green: "#24934f",
    Black: "#000",
    White: "#fff",
    Orange: "#e67e22",
    Pink: "#ff73fa"
} as const;

export const settings = definePluginSettings({
    onStartup: {
        type: OptionType.SELECT,
        description: "عند بدء التشغيل",
        options: [{
            label: "Do nothing (open on the friends tab)",
            value: "nothing",
            default: true
        }, {
            label: "Remember tabs from last session",
            value: "remember"
        }, {
            label: "Open on a specific set of tabs",
            value: "preset"
        }],
    },
    tabSet: {
        component: ChannelTabsPreview,
        type: OptionType.COMPONENT,
        default: {}
    },
    noPomeloNames: {
        description: "استخدام الأسماء المعروضة بدلاً من أسماء المستخدمين في الرسائل المباشرة",
        type: OptionType.BOOLEAN,
        default: false
    },
    showStatusIndicators: {
        description: "إظهار مؤشرات الحالة في الرسائل المباشرة",
        type: OptionType.BOOLEAN,
        default: true
    },
    showBookmarkBar: {
        description: "",
        type: OptionType.BOOLEAN,
        default: true
    },
    bookmarkNotificationDot: {
        description: "إظهار نقطة الإشعار للإشارات المرجعية",
        type: OptionType.BOOLEAN,
        default: true
    },
    persistUnreadCountFallback: {
        description: "الحفاظ على شارات الرسائل غير المقروءة الاحتياطية عبر إعادة التحميل للتبويبات والإشارات المرجعية",
        type: OptionType.BOOLEAN,
        default: true,
        restartNeeded: false
    },
    widerTabsAndBookmarks: {
        description: "تمديد طول التبويبات والإشارات المرجعية للشاشات الكبيرة",
        type: OptionType.BOOLEAN,
        default: false,
        restartNeeded: false
    },
    tabWidthScale: {
        type: OptionType.NUMBER,
        description: "مقياس عرض التبويب (نسبة مئوية) - قابل للتعديل بسحب حواف التبويب",
        default: 100,
        hidden: true,
        restartNeeded: false
    },
    tabHeightScale: {
        type: OptionType.NUMBER,
        description: "مقياس ارتفاع التبويب (نسبة مئوية).",
        default: 100,
        restartNeeded: false
    },
    renderAllTabs: {
        type: OptionType.BOOLEAN,
        description: "الاحتفاظ بجميع التبويبات في الذاكرة المؤقتة للتبديل الأسرع (يحفظ موضع التمرير والحالة)",
        default: false,
        restartNeeded: false
    },
    switchToExistingTab: {
        type: OptionType.BOOLEAN,
        description: "التبديل إلى التبويب إذا كان موجوداً للقناة التي تنتقل إليها",
        default: false,
        restartNeeded: false
    },
    createNewTabIfNotExists: {
        type: OptionType.BOOLEAN,
        description: "إنشاء تبويب جديد إذا لم يكن موجوداً للقناة التي تنتقل إليها",
        default: false,
        restartNeeded: false
    },
    enableRapidNavigation: {
        type: OptionType.BOOLEAN,
        description: "تفعيل سلوك التنقل السريع - التنقل السريع بين القنوات سيستبدل التبويب الحالي بدلاً من إنشاء تبويبات جديدة",
        default: false,
        restartNeeded: false
    },
    rapidNavigationThreshold: {
        type: OptionType.SLIDER,
        description: "النافذة الزمنية (بالثواني) للتنقل السريع. خلال هذا الوقت، تستبدل القنوات الجديدة التبويب الحالي بدلاً من إنشاء تبويبات جديدة.",
        markers: [1, 2, 3, 5, 10, 20, 30, 40, 50, 60],
        default: 3,
        stickToMarkers: false,
    },
    tabBarPosition: {
        type: OptionType.SELECT,
        description: "مكان إظهار شريط التبويبات.",
        options: [
            { label: "Top", value: "top", default: true },
            { label: "Bottom", value: "bottom" }
        ],
        restartNeeded: true
    },
    enableNumberKeySwitching: {
        type: OptionType.BOOLEAN,
        description: "تفعيل مفاتيح الأرقام (1-9) للتبديل بين التبويبات",
        default: true,
        restartNeeded: false
    },
    numberKeySwitchCount: {
        type: OptionType.SLIDER,
        description: "عدد التبويبات المتاحة عبر مفاتيح الأرقام (1-9)",
        markers: makeRange(1, 9, 1),
        default: 3,
        stickToMarkers: true,
    },
    enableCloseTabShortcut: {
        type: OptionType.BOOLEAN,
        description: "تفعيل اختصار لوحة المفاتيح لإغلاق التبويب",
        default: true,
        restartNeeded: false
    },
    enableNewTabShortcut: {
        type: OptionType.BOOLEAN,
        description: "تفعيل اختصار لوحة المفاتيح لفتح تبويب جديد",
        default: true,
        restartNeeded: false
    },
    enableTabCycleShortcut: {
        type: OptionType.BOOLEAN,
        description: "تفعيل اختصار لوحة المفاتيح للتنقل الدوري بين التبويبات",
        default: true,
        restartNeeded: false
    },
    keybindsSection: {
        type: OptionType.COMPONENT,
        component: KeybindSettings
    },
    // me when storage yes for keybinds
    closeTabKeybind: {
        type: OptionType.STRING,
        description: "اختصار لوحة المفاتيح لإغلاق التبويب الحالي",
        default: "CTRL+W",
        hidden: true
    },
    newTabKeybind: {
        type: OptionType.STRING,
        description: "اختصار لوحة المفاتيح لفتح تبويب جديد",
        default: "CTRL+T",
        hidden: true
    },
    cycleTabForwardKeybind: {
        type: OptionType.STRING,
        description: "اختصار لوحة المفاتيح للانتقال إلى التبويب التالي",
        default: "CTRL+TAB",
        hidden: true
    },
    cycleTabBackwardKeybind: {
        type: OptionType.STRING,
        description: "اختصار لوحة المفاتيح للانتقال إلى التبويب السابق",
        default: "CTRL+SHIFT+TAB",
        hidden: true
    },
    showTabNumbers: {
        type: OptionType.BOOLEAN,
        description: "إظهار شارات مرقّمة على التبويبات للإشارة إلى اختصارات لوحة المفاتيح",
        default: false,
        restartNeeded: false
    },
    tabNumberPosition: {
        type: OptionType.SELECT,
        description: "مكان عرض الشارة المرقّمة على التبويبات",
        options: [
            { label: "Left side (before icon)", value: "left", default: true },
            { label: "Right side (after content)", value: "right" }
        ],
        restartNeeded: false
    },
    animations: {
        type: OptionType.COMPONENT,
        component: AnimationSettings
    },
    // me when storage yes
    animationHover: {
        type: OptionType.BOOLEAN,
        description: "تفعيل تأثيرات الرفع والتكبير عند التمرير",
        default: true,
        hidden: true
    },
    animationSelection: {
        type: OptionType.BOOLEAN,
        description: "تفعيل حركات التحديد (توهج الحد، الرفع)",
        default: true,
        hidden: true
    },
    animationDragDrop: {
        type: OptionType.BOOLEAN,
        description: "تفعيل تأثيرات الشبح عند السحب والإفلات",
        default: true,
        hidden: true
    },
    animationEnterExit: {
        type: OptionType.BOOLEAN,
        description: "تفعيل حركات الانزلاق عند إنشاء/إغلاق التبويبات",
        default: true,
        hidden: true
    },
    animationIconPop: {
        type: OptionType.BOOLEAN,
        description: "تفعيل حركة تكبير الأيقونة عند التحديد",
        default: true,
        hidden: true
    },
    animationCloseRotation: {
        type: OptionType.BOOLEAN,
        description: "تفعيل حركة الدوران لأزرار الإغلاق",
        default: true,
        hidden: true
    },
    animationPlusPulse: {
        type: OptionType.BOOLEAN,
        description: "تفعيل حركة النبض لزر الإضافة",
        default: true,
        hidden: true
    },
    animationMentionGlow: {
        type: OptionType.BOOLEAN,
        description: "تفعيل التوهج الأحمر النابض للإشارات",
        default: true,
        hidden: true
    },
    animationCompactExpand: {
        type: OptionType.BOOLEAN,
        description: "تفعيل التوسّع السلس للتبويبات المضغوطة",
        default: true,
        hidden: true
    },
    animationSelectedBorder: {
        type: OptionType.BOOLEAN,
        description: "تفعيل تنسيق الحد والتوهج للتبويبات المحددة",
        default: true,
        hidden: true
    },
    animationSelectedBackground: {
        type: OptionType.BOOLEAN,
        description: "تفعيل تغيير لون الخلفية للتبويبات المحددة",
        default: true,
        hidden: true
    },
    animationTabShadows: {
        type: OptionType.BOOLEAN,
        description: "تفعيل تأثيرات الظل على التبويبات",
        default: true,
        hidden: true
    },
    animationTabPositioning: {
        type: OptionType.BOOLEAN,
        description: "تفعيل الانتقالات السلسة عند تحريك التبويبات",
        default: true,
        hidden: true
    },
    animationResizeHandle: {
        type: OptionType.BOOLEAN,
        description: "تفعيل حركة التلاشي لمقبض تغيير الحجم",
        default: true,
        hidden: true
    },
    animationQuestsActive: {
        type: OptionType.BOOLEAN,
        description: "تفعيل حركات التدرج في تبويب المهام عند تشغيل المهام بنشاط",
        default: true,
        hidden: true
    },
    compactAutoExpandSelected: {
        type: OptionType.BOOLEAN,
        description: "توسيع التبويبات المضغوطة تلقائياً عند تحديدها لإظهار اسم القناة كاملاً",
        default: true,
        restartNeeded: false
    },
    compactAutoExpandOnHover: {
        type: OptionType.BOOLEAN,
        description: "توسيع التبويبات المضغوطة تلقائياً عند التمرير فوقها لإظهار اسم القناة كاملاً",
        default: true,
        restartNeeded: false
    },
    openInNewTabAutoSwitch: {
        type: OptionType.BOOLEAN,
        description: "التبديل تلقائياً إلى التبويبات الجديدة المفتوحة من قائمة السياق 'فتح في تبويب جديد'",
        default: true,
        restartNeeded: false
    },
    bookmarksIndependentFromTabs: {
        type: OptionType.BOOLEAN,
        description: "الإشارات المرجعية تتنقل باستقلالية دون التأثير على شريط التبويبات النشط",
        default: true,
        restartNeeded: false
    },
    showResizeHandle: {
        type: OptionType.BOOLEAN,
        description: "إظهار مقبض تغيير الحجم عند التمرير فوق التبويبات لضبط عرضها",
        default: true,
        restartNeeded: false
    },
    openNewTabsInCompactMode: {
        type: OptionType.BOOLEAN,
        description: "فتح جميع التبويبات الجديدة في الوضع المضغوط افتراضياً",
        default: false,
        restartNeeded: false
    },
    newTabButtonBehavior: {
        type: OptionType.BOOLEAN,
        description: "زر التبويب الجديد (+) يتبع التبويبات بدلاً من البقاء مثبتاً على اليمين",
        default: true,
        restartNeeded: false
    },
    oneTabPerServer: {
        type: OptionType.BOOLEAN,
        description: "الحد بتبويب واحد لكل سيرفر، بحيث يستخدم فتح قناة جديدة في ذلك السيرفر التبويب الموجود.",
        default: false,
        restartNeeded: false
    },
    maxOpenTabs: {
        type: OptionType.SLIDER,
        description: "الحد الأقصى لعدد التبويبات المفتوحة (0 = بلا حد)",
        markers: makeRange(0, 20, 1),
        default: 0,
        stickToMarkers: true,
        restartNeeded: false
    }
});
