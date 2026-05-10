/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings, Settings } from "@api/Settings";
import { Button } from "@components/Button";
import ErrorBoundary from "@components/ErrorBoundary";
import { OptionType } from "@utils/types";
import { Alerts, useState } from "@webpack/common";

import { clearLogs, Native } from ".";
import { ImageCacheDir, LogsDir } from "./components/FolderSelectInput";
import { openLogModal } from "./components/LogsModal";
import { blockedExts } from "./list";
import { DEFAULT_IMAGE_CACHE_DIR } from "./utils/constants";
import { exportLogs, importLogs } from "./utils/settingsUtils";

function ImportLogsButton() {
    const [loading, setLoading] = useState(false);

    return (
        <Button
            disabled={loading}
            onClick={async () => {
                setLoading(true);
                try {
                    await importLogs();
                } finally {
                    setLoading(false);
                }
            }}
        >
            {loading ? "Importing..." : "Import Logs"}
        </Button>
    );
}

function ExportLogsButton() {
    const [loading, setLoading] = useState(false);

    return (
        <Button
            disabled={loading}
            onClick={async () => {
                setLoading(true);
                try {
                    await exportLogs();
                } finally {
                    setLoading(false);
                }
            }}
        >
            {loading ? "Exporting..." : "Export Logs"}
        </Button>
    );
}

export const settings = definePluginSettings({
    saveMessages: {
        default: true,
        type: OptionType.BOOLEAN,
        description: "حفظ الرسائل المحذوفة والمعدّلة",
    },

    saveImages: {
        type: OptionType.BOOLEAN,
        description: "حفظ المرفقات المحذوفة",
        default: false
    },

    sortNewest: {
        default: true,
        type: OptionType.BOOLEAN,
        description: "ترتيب السجلات من الأحدث إلى الأقدم",
    },

    cacheMessagesFromServers: {
        default: false,
        type: OptionType.BOOLEAN,
        description: "عادةً يسجّل المكوّن الرسائل من المعرّفات المدرجة في القائمة البيضاء والرسائل المباشرة فقط، وتفعيل هذا سيجعله يسجّل من جميع السيرفرات. قد يتسبب ذلك في تجاوز حد الذاكرة المؤقتة مما يؤدي لفقدان بعض الرسائل.",
    },

    ignoreBots: {
        type: OptionType.BOOLEAN,
        description: "تجاهل رسائل البوتات",
        default: false,
        onChange() {
            // we will be handling the ignoreBots now (enabled or not) so the original messageLogger shouldnt
            Settings.plugins.MessageLogger.ignoreBots = false;
        }
    },

    ignoreWebhooks: {
        type: OptionType.BOOLEAN,
        description: "تجاهل رسائل الـ webhooks",
        default: false,
    },

    ignoreSelf: {
        type: OptionType.BOOLEAN,
        description: "تجاهل رسائلك الخاصة",
        default: false,
        onChange() {
            Settings.plugins.MessageLogger.ignoreSelf = false;
        }
    },

    ignoreMutedGuilds: {
        default: false,
        type: OptionType.BOOLEAN,
        description: "لن يتم تسجيل الرسائل في السيرفرات المكتومة. المستخدمون/القنوات المُدرجون في القائمة البيضاء سيتم تسجيلهم على أي حال."
    },

    ignoreMutedCategories: {
        default: false,
        type: OptionType.BOOLEAN,
        description: "لن يتم تسجيل الرسائل في القنوات التابعة للفئات المكتومة. المستخدمون/القنوات المُدرجون في القائمة البيضاء سيتم تسجيلهم على أي حال."
    },

    ignoreMutedChannels: {
        default: false,
        type: OptionType.BOOLEAN,
        description: "لن يتم تسجيل الرسائل في القنوات المكتومة. المستخدمون/القنوات المُدرجون في القائمة البيضاء سيتم تسجيلهم على أي حال."
    },

    alwaysLogDirectMessages: {
        default: true,
        type: OptionType.BOOLEAN,
        description: "تسجيل الرسائل المباشرة دائماً",
    },

    alwaysLogCurrentChannel: {
        default: true,
        type: OptionType.BOOLEAN,
        description: "تسجيل القناة المحددة حالياً دائماً. القنوات/المستخدمون في القائمة السوداء سيتم تجاهلهم على أي حال.",
    },

    permanentlyRemoveLogByDefault: {
        default: false,
        type: OptionType.BOOLEAN,
        description: "زر حذف السجل في MessageLogger الأساسي سيحذف السجلات بشكل دائم",
    },

    hideMessageFromMessageLoggers: {
        default: false,
        type: OptionType.BOOLEAN,
        description: "عند التفعيل، يضاف زر في قائمة السياق يسمح بحذف رسائل دون تسجيلها من قِبل مسجّلات أخرى. استخدم على مسؤوليتك الخاصة."
    },

    ShowLogsButton: {
        default: true,
        type: OptionType.BOOLEAN,
        description: "إظهار أو إخفاء زر لوحة السجلات",
        restartNeeded: true,
    },

    ShowWhereMessageIsFrom: {
        default: false,
        type: OptionType.BOOLEAN,
        description: "إظهار اسم القناة/المؤلف واسم السيرفر",
    },

    messagesToDisplayAtOnceInLogs: {
        default: 100,
        type: OptionType.NUMBER,
        description: "عدد الرسائل المعروضة دفعةً واحدة في السجلات وعدد الرسائل المحمّلة عند تحميل المزيد",
    },

    hideMessageFromMessageLoggersDeletedMessage: {
        default: "redacted eh",
        type: OptionType.STRING,
        description: "نص الرسالة الذي يحل محل المحتوى الأصلي عند استخدام ميزة إخفاء الرسالة من المسجّلات",
    },

    messageLimit: {
        default: 200,
        type: OptionType.NUMBER,
        description: "الحد الأقصى لعدد الرسائل المحفوظة. يتم حذف الأقدم عند بلوغ الحد. 0 يعني لا حد"
    },

    attachmentSizeLimitInMegabytes: {
        default: 12,
        type: OptionType.NUMBER,
        description: "الحد الأقصى لحجم المرفق بالميغابايت. المرفقات الأكبر من هذا الحجم لن تُحفظ.",
    },

    attachmentFileExtensions: {
        default: "png,jpg,jpeg,gif,webp,mp4,webm,mp3,ogg,wav",
        type: OptionType.STRING,
        description: "قائمة امتدادات الملفات للحفظ مفصولة بفاصلة. المرفقات بامتدادات غير موجودة في القائمة لن تُحفظ. اتركها فارغة لحفظ جميع المرفقات.",
        onChange: (value: string) => {
            if (!value) return;
            const exts = value.split(",").map(ext => ext.trim().toLowerCase());

            const invalid = exts.filter(ext => blockedExts.includes(ext));
            if (invalid.length > 0) {
                console.warn("Rejected invalid file extensions:", invalid);
                return exts.filter(ext => !blockedExts.includes(ext)).join(",");
            }

            return exts.join(",");
        }
    },

    cacheLimit: {
        default: 1000,
        type: OptionType.NUMBER,
        description: "الحد الأقصى لعدد الرسائل في الذاكرة المؤقتة. يتم حذف الأقدم عند بلوغ الحد. يساعد في تقليل استهلاك الذاكرة. 0 يعني لا حد",
    },

    timeBasedCleanupMinutes: {
        default: 0,
        type: OptionType.NUMBER,
        description: "إزالة تلقائية للرسائل من السيرفرات الأقدم من هذا العدد من الدقائق. اضبط 0 لتعطيل التنظيف بالوقت.",
    },

    preserveCurrentChannel: {
        default: true,
        type: OptionType.BOOLEAN,
        description: "عند التفعيل، لن تتأثر رسائل القناة المحددة حالياً بالتنظيف الزمني التلقائي",
    },

    whitelistedIds: {
        default: "",
        type: OptionType.STRING,
        description: "معرّفات السيرفرات والقنوات والمستخدمين في القائمة البيضاء"
    },

    blacklistedIds: {
        default: "",
        type: OptionType.STRING,
        description: "معرّفات السيرفرات والقنوات والمستخدمين في القائمة السوداء"
    },

    imageCacheDir: {
        type: OptionType.COMPONENT,
        description: "اختر مجلد حفظ الصور",
        component: ErrorBoundary.wrap(ImageCacheDir) as any
    },

    logsDir: {
        type: OptionType.COMPONENT,
        description: "اختر مجلد السجلات",
        component: ErrorBoundary.wrap(LogsDir) as any
    },

    importLogs: {
        type: OptionType.COMPONENT,
        description: "استيراد السجلات من ملف",
        component: ImportLogsButton
    },

    exportLogs: {
        type: OptionType.COMPONENT,
        description: "تصدير السجلات من IndexedDB",
        component: ExportLogsButton
    },

    clearLogsOnRestart: {
        type: OptionType.BOOLEAN,
        description: "مسح السجلات عند إعادة تشغيل Discord",
        default: false,
        restartNeeded: true,
    },

    openLogs: {
        type: OptionType.COMPONENT,
        description: "فتح السجلات",
        component: () =>
            <Button onClick={() => openLogModal()}>
                Open Logs
            </Button>
    },
    openImageCacheFolder: {
        type: OptionType.COMPONENT,
        description: "فتح مجلد ذاكرة الصور المؤقتة",
        component: () =>
            <Button
                disabled={
                    IS_WEB
                    || settings.store.imageCacheDir == null
                    || settings.store.imageCacheDir === DEFAULT_IMAGE_CACHE_DIR
                }
                onClick={() => Native.showItemInFolder(settings.store.imageCacheDir)}
            >
                Open Image Cache Folder
            </Button>
    },

    clearLogs: {
        type: OptionType.COMPONENT,
        description: "مسح السجلات",
        component: () =>
            <Button
                variant="dangerPrimary"
                onClick={() => Alerts.show({
                    title: "Clear Logs",
                    body: "Are you sure you want to clear all logs?",
                    // @ts-expect-error not typed
                    confirmVariant: "critical-primary",
                    confirmText: "Clear",
                    cancelText: "Cancel",
                    onConfirm: async () => {
                        await clearLogs();
                    },
                })}
            >
                Clear Logs
            </Button>
    },

});
