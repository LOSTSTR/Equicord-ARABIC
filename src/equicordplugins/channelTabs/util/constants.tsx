/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Heading } from "@components/Heading";
import { Paragraph } from "@components/Paragraph";
import { ChannelTabsPreview } from "@equicordplugins/channelTabs/components/ChannelTabsContainer";
import { KeybindSettings } from "@equicordplugins/channelTabs/components/KeybindSettings";
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
    const animationOptions: DynamicDropdownSettingOption[] = [
        { label: "Tab Hover Effects (lift + scale)", value: "hover", selected: settings.store.animationHover },
        { label: "Selected Tab Lift Animation", value: "selection", selected: settings.store.animationSelection },
        { label: "Tab Drag & Drop (ghost + reorder)", value: "drag-drop", selected: settings.store.animationDragDrop },
        { label: "Tab Enter/Exit Slides (creation + closing)", value: "enter-exit", selected: settings.store.animationEnterExit },
        { label: "Icon Pop on Selection (icon scale-up)", value: "icon-pop", selected: settings.store.animationIconPop },
        { label: "Close Button Rotation", value: "close-rotation", selected: settings.store.animationCloseRotation },
        { label: "Plus Button Pulse", value: "plus-pulse", selected: settings.store.animationPlusPulse },
        { label: "Mention Badge Glow", value: "mention-glow", selected: settings.store.animationMentionGlow },
        { label: "Compact Mode Expansion", value: "compact-expand", selected: settings.store.animationCompactExpand },
        { label: "Selected Tab Blue Border", value: "selected-border", selected: settings.store.animationSelectedBorder },
        { label: "Selected Tab Background Color", value: "selected-background", selected: settings.store.animationSelectedBackground },
        { label: "Tab Shadow Effects", value: "tab-shadows", selected: settings.store.animationTabShadows },
        { label: "Tab Repositioning (smooth position changes)", value: "tab-positioning", selected: settings.store.animationTabPositioning },
        { label: "Resize Handle Fade", value: "resize-handle", selected: settings.store.animationResizeHandle },
        { label: "Active Quests Gradient", value: "quests-active", selected: settings.store.animationQuestsActive }
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
        description: "استخدام أسماء العرض بدلاً من أسماء المستخدمين في الرسائل الخاصة",
        type: OptionType.BOOLEAN,
        default: false
    },
    showStatusIndicators: {
        description: "عرض مؤشرات الحالة في الرسائل الخاصة",
        type: OptionType.BOOLEAN,
        default: true
    },
    showBookmarkBar: {
        description: "",
        type: OptionType.BOOLEAN,
        default: true
    },
    bookmarkNotificationDot: {
        description: "عرض نقطة الإشعار للإشارات المرجعية",
        type: OptionType.BOOLEAN,
        default: true
    },
    persistUnreadCountFallback: {
        description: "الاحتفاظ بشارات الرسائل غير المقروءة عبر إعادة التحميل للتبويبات والإشارات المرجعية",
        type: OptionType.BOOLEAN,
        default: true,
        restartNeeded: false
    },
    widerTabsAndBookmarks: {
        description: "توسيع عرض التبويبات والإشارات المرجعية للشاشات الكبيرة",
        type: OptionType.BOOLEAN,
        default: false,
        restartNeeded: false
    },
    tabWidthScale: {
        type: OptionType.NUMBER,
        description: "مقياس عرض التبويب (بالنسبة المئوية) - قابل للتعديل بسحب حواف التبويب",
        default: 100,
        hidden: true,
        restartNeeded: false
    },
    tabHeightScale: {
        type: OptionType.NUMBER,
        description: "مقياس ارتفاع التبويب (بالنسبة المئوية).",
        default: 100,
        restartNeeded: false
    },
    renderAllTabs: {
        type: OptionType.BOOLEAN,
        description: "الاحتفاظ بجميع التبويبات في الذاكرة للتبديل الأسرع (يحفظ موضع التمرير والحالة)",
        default: false,
        restartNeeded: false
    },
    switchToExistingTab: {
        type: OptionType.BOOLEAN,
        description: "التبديل إلى التبويب إذا كان موجوداً للقناة التي تتصفحها",
        default: false,
        restartNeeded: false
    },
    createNewTabIfNotExists: {
        type: OptionType.BOOLEAN,
        description: "إنشاء تبويب جديد إذا لم يكن موجوداً للقناة التي تتصفحها",
        default: false,
        restartNeeded: false
    },
    enableRapidNavigation: {
        type: OptionType.BOOLEAN,
        description: "تفعيل التنقل السريع - التنقل السريع بين القنوات سيستبدل التبويب الحالي بدلاً من إنشاء تبويبات جديدة",
        default: false,
        restartNeeded: false
    },
    rapidNavigationThreshold: {
        type: OptionType.SLIDER,
        description: "النافذة الزمنية (بالثواني) للتنقل السريع. خلال هذه المدة تستبدل القنوات الجديدة التبويب الحالي بدلاً من إنشاء جديدة.",
        markers: [1, 2, 3, 5, 10, 20, 30, 40, 50, 60],
        default: 3,
        stickToMarkers: false,
    },
    tabBarPosition: {
        type: OptionType.SELECT,
        description: "مكان عرض شريط التبويبات.",
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
        description: "عدد التبويبات القابلة للوصول عبر مفاتيح الأرقام (1-9)",
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
        description: "عرض شارات الأرقام على التبويبات للإشارة إلى اختصارات لوحة المفاتيح",
        default: false,
        restartNeeded: false
    },
    tabNumberPosition: {
        type: OptionType.SELECT,
        description: "مكان عرض الشارة المرقمة على التبويبات",
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
        description: "تفعيل تأثيرات الرفع والتكبير عند التحريك",
        default: true,
        hidden: true
    },
    animationSelection: {
        type: OptionType.BOOLEAN,
        description: "تفعيل تأثيرات اختيار التبويب (توهج الحدود، الرفع)",
        default: true,
        hidden: true
    },
    animationDragDrop: {
        type: OptionType.BOOLEAN,
        description: "تفعيل تأثيرات السحب والإسقاط",
        default: true,
        hidden: true
    },
    animationEnterExit: {
        type: OptionType.BOOLEAN,
        description: "تفعيل تأثيرات الانزلاق عند فتح/إغلاق التبويبات",
        default: true,
        hidden: true
    },
    animationIconPop: {
        type: OptionType.BOOLEAN,
        description: "تفعيل تأثير تكبير الأيقونة عند الاختيار",
        default: true,
        hidden: true
    },
    animationCloseRotation: {
        type: OptionType.BOOLEAN,
        description: "تفعيل تأثير الدوران لأزرار الإغلاق",
        default: true,
        hidden: true
    },
    animationPlusPulse: {
        type: OptionType.BOOLEAN,
        description: "تفعيل تأثير النبض لزر الإضافة",
        default: true,
        hidden: true
    },
    animationMentionGlow: {
        type: OptionType.BOOLEAN,
        description: "تفعيل توهج أحمر نابض عند الإشارة",
        default: true,
        hidden: true
    },
    animationCompactExpand: {
        type: OptionType.BOOLEAN,
        description: "تفعيل التوسع السلس للتبويبات المدمجة",
        default: true,
        hidden: true
    },
    animationSelectedBorder: {
        type: OptionType.BOOLEAN,
        description: "تفعيل تنسيق الحدود والتوهج للتبويبات المحددة",
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
        description: "تفعيل تأثير التلاشي لمقبض تغيير الحجم",
        default: true,
        hidden: true
    },
    animationQuestsActive: {
        type: OptionType.BOOLEAN,
        description: "تفعيل تأثيرات التدرج على تبويب المهام عند تشغيل المهام",
        default: true,
        hidden: true
    },
    compactAutoExpandSelected: {
        type: OptionType.BOOLEAN,
        description: "توسيع التبويبات المدمجة تلقائياً عند تحديدها لعرض اسم القناة كاملاً",
        default: true,
        restartNeeded: false
    },
    compactAutoExpandOnHover: {
        type: OptionType.BOOLEAN,
        description: "توسيع التبويبات المدمجة تلقائياً عند التحريك عليها لعرض اسم القناة كاملاً",
        default: true,
        restartNeeded: false
    },
    openInNewTabAutoSwitch: {
        type: OptionType.BOOLEAN,
        description: "التبديل تلقائياً إلى التبويبات الجديدة المفتوحة من قائمة 'فتح في تبويب جديد'",
        default: true,
        restartNeeded: false
    },
    bookmarksIndependentFromTabs: {
        type: OptionType.BOOLEAN,
        description: "تتنقل الإشارات المرجعية بشكل مستقل دون التأثير على شريط التبويبات النشط",
        default: true,
        restartNeeded: false
    },
    showResizeHandle: {
        type: OptionType.BOOLEAN,
        description: "عرض مقبض تغيير الحجم عند التحريك على التبويبات لضبط عرضها",
        default: true,
        restartNeeded: false
    },
    openNewTabsInCompactMode: {
        type: OptionType.BOOLEAN,
        description: "فتح جميع التبويبات الجديدة في الوضع المدمج افتراضياً",
        default: false,
        restartNeeded: false
    },
    newTabButtonBehavior: {
        type: OptionType.BOOLEAN,
        description: "يتبع زر التبويب الجديد (+) التبويبات بدلاً من البقاء ثابتاً على اليمين",
        default: true,
        restartNeeded: false
    },
    oneTabPerServer: {
        type: OptionType.BOOLEAN,
        description: "تقييد تبويب واحد لكل سيرفر، بحيث يستخدم فتح قناة جديدة في نفس السيرفر التبويب الموجود.",
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
