/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { useSettings } from "@api/Settings";
import ErrorBoundary from "@components/ErrorBoundary";
import { Heading } from "@components/Heading";
import { Margins } from "@components/margins";
import { Paragraph } from "@components/Paragraph";
import { IS_WINDOWS } from "@utils/constants";
import { t } from "@utils/esharqI18n";
import { Select } from "@webpack/common";

export function WindowsMaterialSettings() {
    const settings = useSettings(["windowsMaterial"]);

    if (!IS_WINDOWS || IS_WEB || !VencordNative.native.supportsWindowsMaterial()) return null;

    return (
        <ErrorBoundary noop>
            <Heading tag="h5">{t("مواد الخلفية", "Background Material")}</Heading>
            <Paragraph className={Margins.bottom8}>
                {t("تأثيرات الخلفية الشفافة لويندوز. يتطلب قالباً يدعم الشفافية وإلا لن يكون له أثر. تستلزم إعادة تشغيل ديسكورد بعد تغيير هذا الإعداد.", "Windows transparent background effects. You need a theme that supports transparency or this will do nothing. A restart is required after changing this setting.")}
            </Paragraph>

            <Select
                placeholder={t("لا شيء", "None")}
                options={[
                    {
                        label: t("لا شيء", "None"),
                        value: "none",
                        default: true
                    },
                    {
                        label: t("Mica (يدمج قالب النظام وخلفية سطح المكتب في الخلفية)", "Mica (incorporates system theme + desktop wallpaper to paint the background)"),
                        value: "mica"
                    },
                    {
                        label: t("Tabbed (نوع من Mica مع تلوين خلفية أقوى)", "Tabbed (variant of Mica with stronger background tinting)"),
                        value: "tabbed"
                    },
                    {
                        label: t("Acrylic (يضبب النافذة خلف ديسكورد لخلفية شبه شفافة)", "Acrylic (blurs the window behind Vesktop for a translucent background)"),
                        value: "acrylic"
                    }
                ]}
                closeOnSelect={true}
                select={v => (settings.windowsMaterial = v)}
                isSelected={v => v === settings.windowsMaterial}
                serialize={s => s}
            />
        </ErrorBoundary>
    );
}
