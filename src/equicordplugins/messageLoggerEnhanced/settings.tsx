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
        description: "حفظ المرفقات المحذوفة.",
        default: false
    },

    sortNewest: {
        default: true,
        type: OptionType.BOOLEAN,
        description: "ترتيب السجلات من الأحدث إلى الأقدم.",
    },

    cacheMessagesFromServers: {
        default: false,
        type: OptionType.BOOLEAN,
        description: "عادةً يسجّل مسجّل الرسائل من المعرّفات المدرجة في القائمة البيضاء والرسائل المباشرة فقط، وتفعيل هذا الخيار سيجعله يسجّل الرسائل من جميع السيرفرات أيضاً. لاحظ أن هذا قد يؤدي إلى تجاوز حد الذاكرة المؤقتة مما قد يتسبب في تفويت بعض الرسائل. إذا كنت في عدد كبير من السيرفرات فقد يزيد هذا بشكل ملحوظ من حجم السجلات.",
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
        description: "تجاهل رسائل Webhooks",
        default: false,
    },

    ignoreSelf: {
        type: OptionType.BOOLEAN,
        description: "تجاهل رسائلك أنت",
        default: false,
        onChange() {
            Settings.plugins.MessageLogger.ignoreSelf = false;
        }
    },

    ignoreMutedGuilds: {
        default: false,
        type: OptionType.BOOLEAN,
        description: "لن تُسجَّل الرسائل في السيرفرات المكتومة. سيظل المستخدمون/القنوات في القائمة البيضاء داخل السيرفرات المكتومة مسجَّلين."
    },

    ignoreMutedCategories: {
        default: false,
        type: OptionType.BOOLEAN,
        description: "لن تُسجَّل الرسائل في القنوات التابعة للتصنيفات المكتومة. سيظل المستخدمون/القنوات في القائمة البيضاء مسجَّلين."
    },

    ignoreMutedChannels: {
        default: false,
        type: OptionType.BOOLEAN,
        description: "لن تُسجَّل الرسائل في القنوات المكتومة. سيظل المستخدمون/القنوات في القائمة البيضاء مسجَّلين.",
    },

    alwaysLogDirectMessages: {
        default: true,
        type: OptionType.BOOLEAN,
        description: "تسجيل الرسائل المباشرة دائماً",
    },

    alwaysLogCurrentChannel: {
        default: true,
        type: OptionType.BOOLEAN,
        description: "تسجيل القناة المحددة حالياً دائماً. ستظل القنوات/المستخدمون في القائمة السوداء مستثنين.",
    },

    permanentlyRemoveLogByDefault: {
        default: false,
        type: OptionType.BOOLEAN,
        description: "زر حذف السجل الأصلي في MessageLogger سيحذف السجلات بشكل دائم",
    },

    hideMessageFromMessageLoggers: {
        default: false,
        type: OptionType.BOOLEAN,
        description: "عند التفعيل، سيُضاف زر في قائمة السياق للرسائل يتيح لك حذفها دون تسجيلها بواسطة مسجّلات أخرى. قد لا يكون آمناً، استخدمه على مسؤوليتك."
    },

    ShowLogsButton: {
        default: true,
        type: OptionType.BOOLEAN,
        description: "تبديل إظهار صندوق الأدوات أو إخفائه",
        restartNeeded: true,
    },

    ShowWhereMessageIsFrom: {
        default: false,
        type: OptionType.BOOLEAN,
        description: "إظهار اسم القناة/المؤلف واسم السيرفر للرسالة",
    },

    messagesToDisplayAtOnceInLogs: {
        default: 100,
        type: OptionType.NUMBER,
        description: "عدد الرسائل المعروضة في السجلات دفعةً واحدة وعدد الرسائل التي تُحمَّل عند تحميل المزيد.",
    },

    hideMessageFromMessageLoggersDeletedMessage: {
        default: "redacted eh",
        type: OptionType.STRING,
        description: "محتوى الرسالة الذي سيحل محل الرسالة الأصلية عند استخدام ميزة إخفاء الرسائل عن المسجّلات.",
    },

    messageLimit: {
        default: 200,
        type: OptionType.NUMBER,
        description: "الحد الأقصى لعدد الرسائل المحفوظة. تُحذف الرسائل القديمة عند بلوغ الحد. 0 يعني بلا حد"
    },

    attachmentSizeLimitInMegabytes: {
        default: 12,
        type: OptionType.NUMBER,
        description: "الحد الأقصى لحجم المرفق بالميغابايت للحفظ. لن تُحفظ المرفقات التي تتجاوز هذا الحجم."
    },

    attachmentFileExtensions: {
        default: "png,jpg,jpeg,gif,webp,mp4,webm,mp3,ogg,wav",
        type: OptionType.STRING,
        description: "قائمة امتدادات الملفات المفصولة بفواصل للحفظ. لن تُحفظ المرفقات ذات الامتدادات غير الموجودة في القائمة. اتركها فارغة لحفظ جميع المرفقات.",
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
        description: "الحد الأقصى لعدد الرسائل المخزّنة في الذاكرة المؤقتة. تُحذف الرسائل القديمة عند بلوغ الحد. هذا يساعد في تقليل استخدام الذاكرة وتحسين الأداء. 0 يعني بلا حد",
    },

    timeBasedCleanupMinutes: {
        default: 0,
        type: OptionType.NUMBER,
        description: "حذف الرسائل تلقائياً من السيرفرات التي مضى عليها هذا العدد من الدقائق. اضبطه على 0 لتعطيل التنظيف المبني على الوقت.",
    },

    preserveCurrentChannel: {
        default: true,
        type: OptionType.BOOLEAN,
        description: "عند التفعيل، لن تتأثر رسائل القناة المحددة حالياً بالتنظيف المبني على الوقت.",
    },

    whitelistedIds: {
        default: "",
        type: OptionType.STRING,
        description: "معرّفات السيرفرات أو القنوات أو المستخدمين في القائمة البيضاء."
    },

    blacklistedIds: {
        default: "",
        type: OptionType.STRING,
        description: "معرّفات السيرفرات أو القنوات أو المستخدمين في القائمة السوداء."
    },

    imageCacheDir: {
        type: OptionType.COMPONENT,
        description: "اختيار مجلد حفظ الصور",
        component: ErrorBoundary.wrap(ImageCacheDir) as any
    },

    logsDir: {
        type: OptionType.COMPONENT,
        description: "اختيار مجلد السجلات",
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
        description: "مسح السجلات عند إعادة تشغيل Discord.",
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
        description: "فتح مجلد ذاكرة التخزين المؤقت للصور",
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
