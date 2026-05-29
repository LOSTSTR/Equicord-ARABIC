/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { useSettings } from "@api/Settings";
import { downloadSettingsBackup, uploadSettingsBackup } from "@api/SettingsSync/offline";
import { Button } from "@components/Button";
import { Divider } from "@components/Divider";
import { Flex } from "@components/Flex";
import { Heading } from "@components/Heading";
import { Notice } from "@components/Notice";
import { Paragraph } from "@components/Paragraph";
import { SettingsTab, wrapTab } from "@components/settings/tabs/BaseTab";
import { t } from "@utils/esharqI18n";
import { Margins } from "@utils/margins";

function BackupAndRestoreTab() {
    useSettings(["plugins.Settings.arabicMode"]);

    return (
        <SettingsTab>
            <Heading className={Margins.top16}>{t("النسخ الاحتياطي والاستعادة", "Backup & Restore")}</Heading>
            <Paragraph className={Margins.bottom20}>
                {t("استيراد وتصدير إعدادات Esharq كملف JSON.", "Import and export your Esharq settings as a JSON file.")}
            </Paragraph>

            <Notice.Warning className={Margins.bottom20}>
                {t("استيراد ملف الإعدادات سيُستبدل إعداداتك الحالية. تأكد من تصدير نسخة احتياطية أولاً", "Importing a settings file will replace your current settings. Make sure to export a backup first.")}
            </Notice.Warning>

            <Heading>{t("ما يتضمنه النسخ الاحتياطي", "What's included in the backup")}</Heading>
            <Paragraph className={Margins.bottom20}>
                • {t("CSS مخصص", "Custom CSS")}<br />
                • {t("روابط القوالب", "Theme links")}<br />
                • {t("إعدادات الإضافات", "Plugin settings")}<br />
                • {t("بيانات المخزن", "Datastore data")}
            </Paragraph>

            <Divider className={Margins.bottom20} />

            <Heading>{t("استيراد الإعدادات", "Import Settings")}</Heading>
            <Paragraph className={Margins.bottom16}>
                {t("اختر ملف إعدادات مُصدَّر مسبقاً لاستعادة إعداداتك.", "Choose a previously exported settings file to restore your settings.")}
            </Paragraph>

            <Flex gap="8px" className={Margins.bottom20} style={{ flexWrap: "wrap" }}>
                <Button
                    onClick={() => uploadSettingsBackup("all")}
                    size="small"
                    variant="secondary"
                >
                    {t("استيراد كل الإعدادات", "Import All Settings")}
                </Button>
                <Button
                    onClick={() => uploadSettingsBackup("plugins")}
                    size="small"
                >
                    {t("استيراد الإضافات", "Import Plugins")}
                </Button>
                <Button
                    onClick={() => uploadSettingsBackup("css")}
                    size="small"
                >
                    {t("استيراد QuickCSS", "Import QuickCSS")}
                </Button>
                <Button
                    onClick={() => uploadSettingsBackup("datastore")}
                    size="small"
                >
                    {t("استيراد المخزن", "Import Datastore")}
                </Button>
            </Flex>

            <Divider className={Margins.bottom20} />

            <Heading>{t("تصدير الإعدادات", "Export Settings")}</Heading>
            <Paragraph className={Margins.bottom16}>
                {t("نزّل إعداداتك الحالية كملف نسخ احتياطية. يمكنك تصدير كل شيء دفعةً واحدة، أو اختيار تصدير أجزاء معينة فقط من إعداداتك.", "Download your current settings as a backup file. You can export everything at once or choose to export only specific parts of your settings.")}
            </Paragraph>

            <Flex gap="8px" style={{ flexWrap: "wrap" }}>
                <Button
                    onClick={() => downloadSettingsBackup("all")}
                    size="small"
                    variant="secondary"
                >
                    {t("تصدير كل الإعدادات", "Export All Settings")}
                </Button>
                <Button
                    onClick={() => downloadSettingsBackup("plugins")}
                    size="small"
                >
                    {t("تصدير الإضافات", "Export Plugins")}
                </Button>
                <Button
                    onClick={() => downloadSettingsBackup("css")}
                    size="small"
                >
                    {t("تصدير QuickCSS", "Export QuickCSS")}
                </Button>
                <Button
                    onClick={() => downloadSettingsBackup("datastore")}
                    size="small"
                >
                    {t("تصدير المخزن", "Export Datastore")}
                </Button>
            </Flex>
        </SettingsTab>
    );
}

export default wrapTab(BackupAndRestoreTab, "Backup & Restore");
