/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { t } from "@utils/esharqI18n";
import { OptionType } from "@utils/types";

export const settings = definePluginSettings({
    editDiff: {
        type: OptionType.BOOLEAN,
        get description() { return t("إظهار زر مقارنة التعديلات على الرسائل المعدّلة", "Show word-level diff button on edited messages"); },
        default: true,
    },
    replyTree: {
        type: OptionType.BOOLEAN,
        get description() { return t("إضافة زر لعرض جميع الردود على رسالة معينة", "Show reply tree button to list all replies to a message"); },
        default: true,
    },
    channelBrief: {
        type: OptionType.BOOLEAN,
        get description() { return t("عرض ملخص الرسائل الجديدة عند العودة إلى قناة بعد فترة غياب", "Show new messages preview when returning to a channel after inactivity"); },
        default: true,
    },
    briefThresholdMinutes: {
        type: OptionType.NUMBER,
        get description() { return t("عدد دقائق الغياب قبل عرض ملخص القناة (الافتراضي: 15)", "Minutes of inactivity before showing channel brief (default: 15)"); },
        default: 15,
    },
    briefPreviewCount: {
        type: OptionType.NUMBER,
        get description() { return t("عدد الرسائل المعروضة في ملخص القناة (3، 5، أو 10)", "Number of messages to preview in channel brief (3, 5, or 10)"); },
        default: 5,
    },
});
