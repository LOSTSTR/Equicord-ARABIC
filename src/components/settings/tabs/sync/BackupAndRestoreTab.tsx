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

import { downloadSettingsBackup, uploadSettingsBackup } from "@api/SettingsSync/offline";
import { Button } from "@components/Button";
import { Divider } from "@components/Divider";
import { Flex } from "@components/Flex";
import { Heading } from "@components/Heading";
import { Notice } from "@components/Notice";
import { Paragraph } from "@components/Paragraph";
import { SettingsTab, wrapTab } from "@components/settings/tabs/BaseTab";
import { Margins } from "@utils/margins";

function BackupAndRestoreTab() {
    return (
        <SettingsTab>
            <Heading className={Margins.top16}>النسخ الاحتياطي والاستعادة</Heading>
            <Paragraph className={Margins.bottom20}>
                استيراد وتصدير إعدادات Equicord كملف JSON.
            </Paragraph>

            <Notice.Warning className={Margins.bottom20}>
                استيراد ملف الإعدادات سيُستبدل إعداداتك الحالية. تأكد من تصدير نسخة احتياطية أولاً
            </Notice.Warning>

            <Heading>ما يتضمنه النسخ الاحتياطي</Heading>
            <Paragraph className={Margins.bottom20}>
                • CSS مخصص<br />
                • روابط القوالب<br />
                • إعدادات الإضافات<br />
                • بيانات المخزن
            </Paragraph>

            <Divider className={Margins.bottom20} />

            <Heading>استيراد الإعدادات</Heading>
            <Paragraph className={Margins.bottom16}>
                اختر ملف إعدادات مُصدَّر مسبقاً لاستعادة إعداداتك.
            </Paragraph>

            <Flex gap="8px" className={Margins.bottom20} style={{ flexWrap: "wrap" }}>
                <Button
                    onClick={() => uploadSettingsBackup("all")}
                    size="small"
                    variant="secondary"
                >
                    استيراد كل الإعدادات
                </Button>
                <Button
                    onClick={() => uploadSettingsBackup("plugins")}
                    size="small"
                >
                    استيراد الإضافات
                </Button>
                <Button
                    onClick={() => uploadSettingsBackup("css")}
                    size="small"
                >
                    استيراد QuickCSS
                </Button>
                <Button
                    onClick={() => uploadSettingsBackup("datastore")}
                    size="small"
                >
                    استيراد المخزن
                </Button>
            </Flex>

            <Divider className={Margins.bottom20} />

            <Heading>تصدير الإعدادات</Heading>
            <Paragraph className={Margins.bottom16}>
                Download your current settings as a backup file. You can export everything at once, or choose to export only specific parts of your configuration.
            </Paragraph>

            <Flex gap="8px" style={{ flexWrap: "wrap" }}>
                <Button
                    onClick={() => downloadSettingsBackup("all")}
                    size="small"
                    variant="secondary"
                >
                    Export All Settings
                </Button>
                <Button
                    onClick={() => downloadSettingsBackup("plugins")}
                    size="small"
                >
                    Export Plugins
                </Button>
                <Button
                    onClick={() => downloadSettingsBackup("css")}
                    size="small"
                >
                    Export QuickCSS
                </Button>
                <Button
                    onClick={() => downloadSettingsBackup("datastore")}
                    size="small"
                >
                    Export DataStore
                </Button>
            </Flex>
        </SettingsTab>
    );
}

export default wrapTab(BackupAndRestoreTab, "Backup & Restore");
