/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
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
import { authorizeCloud, deauthorizeCloud } from "@api/SettingsSync/cloudSetup";
import { deleteCloudSettings, eraseAllCloudData, getCloudSettings, putCloudSettings } from "@api/SettingsSync/cloudSync";
import { Button } from "@components/Button";
import { CheckedTextInput } from "@components/CheckedTextInput";
import { Divider } from "@components/Divider";
import { Flex } from "@components/Flex";
import { FormSwitch } from "@components/FormSwitch";
import { Heading } from "@components/Heading";
import { CloudDownloadIcon, CloudUploadIcon } from "@components/Icons";
import { Link } from "@components/Link";
import { Notice } from "@components/Notice";
import { Paragraph } from "@components/Paragraph";
import { SettingsTab, wrapTab } from "@components/settings/tabs/BaseTab";
import { localStorage } from "@utils/localStorage";
import { Margins } from "@utils/margins";
import { useForceUpdater } from "@utils/react";
import { findComponentByCodeLazy } from "@webpack";
import { Alerts, SearchableSelect, Select, useState } from "@webpack/common";

const ICON_STYLE: React.CSSProperties = { width: 20, height: 20, borderRadius: 4, verticalAlign: "middle" };

function EquicordIcon() {
    return <img src="https://equicord.org/assets/favicon.png" alt="Equicord" style={ICON_STYLE} />;
}

function VencordIcon() {
    return <img src="https://equicord.org/assets/icons/vencord/icon-light.png" alt="Vencord" style={ICON_STYLE} />;
}

const RefreshIcon = findComponentByCodeLazy("M4 12a8 8 0 0 1 14.93-4H15");
const TrashIcon = findComponentByCodeLazy("2.81h8.36a3");
const SkullIcon = findComponentByCodeLazy("m13.47 1 .07.04c.45.06");

function validateUrl(url: string) {
    try {
        new URL(url);
        return true;
    } catch {
        return "Invalid URL";
    }
}

const cloudBackendOptions = [
    { label: "Equicord Cloud", value: "https://cloud.equicord.org/" },
    { label: "Vencord Cloud", value: "https://api.vencord.dev/" }
];

const syncDirectionOptions = [
    { label: "مزامنة ثنائية الاتجاه (التغييرات تسير في كلا الاتجاهين)", value: "both" },
    { label: "هذا الجهاز هو المصدر (رفع فقط)", value: "push" },
    { label: "السحابة هي المصدر (تنزيل فقط)", value: "pull" },
    { label: "بلا مزامنة تلقائية (مزامنة يدوية عبر الأزرار أدناه فقط)", value: "manual" }
];

function CloudTab() {
    const settings = useSettings(["cloud.authenticated", "cloud.url", "cloud.settingsSync"]);
    const [inputKey, setInputKey] = useState(0);
    const forceUpdate = useForceUpdater();

    const { cloud } = settings;
    const isAuthenticated = cloud.authenticated;
    const syncEnabled = isAuthenticated && cloud.settingsSync;

    async function changeUrl(url: string) {
        cloud.url = url;
        cloud.authenticated = false;

        await deauthorizeCloud();
        await authorizeCloud();

        setInputKey(prev => prev + 1);
    }

    return (
        <SettingsTab>
            <Heading className={Margins.top16}>تكامل السحابة</Heading>
            <Paragraph className={Margins.bottom16}>
                يتيح تكامل سحابة Equicord مزامنة إعداداتك عبر أجهزة متعددة
            </Paragraph>

            <Notice.Info className={Margins.bottom16}>
                نستخدم خادمنا الخاص <Link href="https://github.com/Equicord/Equicloud">Equicloud</Link> بمزايا محسّنة.
                اطلع على <Link href="https://equicord.org/cloud/policy">سياسة الخصوصية</Link> لمعرفة ما نخزّنه وكيف نستخدم بياناتك.
                Equicloud مرخص بترخيص BSD 3.0، يمكنك استضافته بنفسك إن أردت.
            </Notice.Info>

            <FormSwitch
                title="تفعيل تكامل السحابة"
                description="الاتصال بالسحابة لمزامنة الإعدادات."
                value={isAuthenticated}
                onChange={v => {
                    if (v)
                        authorizeCloud();
                    else
                        cloud.authenticated = v;
                }}
                hideBorder
            />

            <Divider className={Margins.top20} />

            <Heading className={Margins.top20}>الخادم السحابي</Heading>
            <Paragraph className={Margins.bottom16}>
                اختر الخادم السحابي المراد استخدامه لحفظ إعداداتك.
            </Paragraph>

            <div className={Margins.bottom8}>
                <SearchableSelect
                    options={cloudBackendOptions}
                    value={cloudBackendOptions.find(o => o.value === cloud.url)?.value}
                    onChange={v => changeUrl(v)}
                    closeOnSelect={true}
                    renderOptionPrefix={o => o?.value?.includes("equicord") ? <EquicordIcon /> : <VencordIcon />}
                />
            </div>

            <Flex gap="8px" alignItems="center">
                <div style={{ flex: 1 }}>
                    <CheckedTextInput
                        key={`backendUrl-${inputKey}`}
                        initialValue={cloud.url}
                        onChange={async v => {
                            cloud.url = v;
                            cloud.authenticated = false;
                            await deauthorizeCloud();
                        }}
                        validate={validateUrl}
                    />
                </div>
                <Button
                    disabled={!isAuthenticated}
                    onClick={async () => {
                        cloud.authenticated = false;
                        await deauthorizeCloud();
                        await authorizeCloud();
                    }}
                >
                    <Flex gap="8px" alignItems="center">
                        <RefreshIcon color="currentColor" />
                        إعادة التفويض
                    </Flex>
                </Button>
            </Flex>

            <Divider className={Margins.top20} />

            <Heading className={Margins.top20}>مزامنة الإعدادات</Heading>
            <Paragraph className={Margins.bottom16}>
                زامن إعدادات Equicord مع السحابة. يتيح ذلك الحفاظ على اتساق إعداداتك عبر أجهزة متعددة دون الحاجة إلى تصدير واستيراد يدوي.
            </Paragraph>

            <FormSwitch
                title="تفعيل مزامنة الإعدادات"
                description="عند التفعيل، يمكن مزامنة إعداداتك مع السحابة وإليها. استخدم الأزرار أدناه للمزامنة اليدوية."
                value={cloud.settingsSync}
                onChange={v => { cloud.settingsSync = v; }}
                disabled={!isAuthenticated}
                hideBorder
            />

            <Divider className={Margins.top20} />

            <Heading className={Margins.top20}>قواعد المزامنة لهذا الجهاز</Heading>
            <Paragraph className={Margins.bottom16}>
                يتحكم هذا الإعداد في كيفية انتقال الإعدادات بين <strong>هذا الجهاز</strong> والسحابة. يمكنك السماح بتدفق التغييرات في كلا الاتجاهين، أو اختيار مصدر رئيسي واحد.
            </Paragraph>

            <Select
                options={syncDirectionOptions}
                isSelected={v => v === (localStorage.Vencord_cloudSyncDirection ?? "both")}
                select={v => {
                    localStorage.Vencord_cloudSyncDirection = v;
                    forceUpdate();
                }}
                serialize={v => v}
                isDisabled={!syncEnabled}
            />

            <Flex gap="8px" className={Margins.top16}>
                <Button
                    style={{ flex: 1 }}
                    disabled={!syncEnabled}
                    onClick={() => putCloudSettings(true)}
                >
                    <Flex gap="8px" alignItems="center">
                        <CloudUploadIcon />
                        رفع إلى السحابة
                    </Flex>
                </Button>
                <Button
                    style={{ flex: 1 }}
                    disabled={!syncEnabled}
                    onClick={() => getCloudSettings(true, true)}
                >
                    <Flex gap="8px" alignItems="center">
                        <CloudDownloadIcon />
                        تنزيل من السحابة
                    </Flex>
                </Button>
            </Flex>

            {!isAuthenticated && (
                <Notice.Warning className={Margins.top8}>
                    فعّل تكامل السحابة أعلاه لاستخدام ميزات مزامنة الإعدادات.
                </Notice.Warning>
            )}

            <Divider className={Margins.top20} />

            <Heading className={Margins.top20}>منطقة الخطر</Heading>
            <Paragraph className={Margins.bottom16}>
                احذف جميع بياناتك من السحابة نهائياً. لا يمكن التراجع عن هذا الإجراء وسيُزيل جميع الإعدادات المزامَنة وأي بيانات أخرى مخزّنة على الخادم السحابي.
            </Paragraph>

            <Flex gap="8px">
                <Button
                    variant="dangerPrimary"
                    size="medium"
                    disabled={!syncEnabled}
                    onClick={() => deleteCloudSettings()}
                >
                    <Flex gap="8px" alignItems="center">
                        <TrashIcon color="currentColor" />
                        حذف إعدادات السحابة
                    </Flex>
                </Button>
                <Button
                    variant="dangerSecondary"
                    size="medium"
                    disabled={!isAuthenticated}
                    onClick={() => Alerts.show({
                        title: "حذف حساب السحابة",
                        body: "هل أنت متأكد أنك تريد حذف حسابك السحابي وجميع البيانات المرتبطة به نهائياً؟ لا يمكن التراجع عن هذا الإجراء.",
                        onConfirm: eraseAllCloudData,
                        confirmText: "حذف الحساب",
                        confirmColor: "vc-cloud-erase-data-danger-btn",
                        cancelText: "إلغاء"
                    })}
                >
                    <Flex gap="8px" alignItems="center">
                        <SkullIcon color="currentColor" />
                        حذف حساب السحابة
                    </Flex>
                </Button>
            </Flex>
        </SettingsTab>
    );
}

export default wrapTab(CloudTab, "Cloud");
