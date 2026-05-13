/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { openNotificationLogModal } from "@api/Notifications/notificationLog";
import { useSettings } from "@api/Settings";
import { BaseText } from "@components/BaseText";
import { Button } from "@components/Button";
import { ErrorCard } from "@components/ErrorCard";
import { Flex } from "@components/Flex";
import { FormSwitch } from "@components/FormSwitch";
import { Heading } from "@components/Heading";
import { Paragraph } from "@components/Paragraph";
import { Margins } from "@utils/margins";
import { identity } from "@utils/misc";
import { ModalCloseButton, ModalContent, ModalHeader, ModalRoot, ModalSize, openModal } from "@utils/modal";
import { Select, Slider } from "@webpack/common";

export function NotificationSection() {
    return (
        <section className={Margins.top16}>
            <Heading>الإشعارات</Heading>
            <Paragraph className={Margins.bottom8}>
                إعدادات الإشعارات الصادرة من Equicord.
                لا تشمل إشعارات Discord العادية (الرسائل وغيرها)
            </Paragraph>
            <Flex>
                <Button onClick={openNotificationSettingsModal}>
                    إعدادات الإشعارات
                </Button>
                <Button onClick={openNotificationLogModal}>
                    عرض سجل الإشعارات
                </Button>
            </Flex>
        </section>
    );
}

export function openNotificationSettingsModal() {
    openModal(props => (
        <ModalRoot {...props} size={ModalSize.MEDIUM}>
            <ModalHeader>
                <BaseText size="lg" weight="semibold" style={{ flexGrow: 1 }}>إعدادات الإشعارات</BaseText>
                <ModalCloseButton onClick={props.onClose} />
            </ModalHeader>

            <ModalContent>
                <NotificationSettings />
            </ModalContent>
        </ModalRoot>
    ));
}

function NotificationSettings() {
    const settings = useSettings(["notifications.*"]).notifications;

    return (
        <div style={{ padding: "1em 0" }}>
            <Heading>أسلوب الإشعارات</Heading>
            {settings.useNative !== "never" && Notification?.permission === "denied" && (
                <ErrorCard style={{ padding: "1em" }} className={Margins.bottom8}>
                    <Heading>تم رفض إذن إشعارات سطح المكتب</Heading>
                    <Paragraph>لقد رفضت إذن الإشعارات، لذا لن تعمل إشعارات سطح المكتب!</Paragraph>
                </ErrorCard>
            )}
            <Paragraph className={Margins.bottom8}>
                قد تعرض بعض الإضافات إشعارات. تأتي هذه الإشعارات بنوعين:
                <ul>
                    <li><strong>إشعارات Equicord</strong>: إشعارات داخل التطبيق</li>
                    <li><strong>إشعارات سطح المكتب</strong>: إشعارات سطح المكتب الأصلية (مثل إشعارات الإشارات)</li>
                </ul>
            </Paragraph>
            <Select
                placeholder="أسلوب الإشعارات"
                options={[
                    { label: "استخدام إشعارات سطح المكتب فقط عند عدم التركيز على Discord", value: "not-focused", default: true },
                    { label: "استخدام إشعارات سطح المكتب دائماً", value: "always" },
                    { label: "استخدام إشعارات Equicord دائماً", value: "never" },
                ] satisfies Array<{ value: typeof settings["useNative"]; } & Record<string, any>>}
                closeOnSelect={true}
                select={v => settings.useNative = v}
                isSelected={v => v === settings.useNative}
                serialize={identity}
            />

            <Heading className={Margins.top16 + " " + Margins.bottom8}>موضع الإشعارات</Heading>
            <Select
                isDisabled={settings.useNative === "always"}
                placeholder="موضع الإشعارات"
                options={[
                    { label: "أسفل اليمين", value: "bottom-right", default: true },
                    { label: "أعلى اليمين", value: "top-right" },
                ] satisfies Array<{ value: typeof settings["position"]; } & Record<string, any>>}
                select={v => settings.position = v}
                isSelected={v => v === settings.position}
                serialize={identity}
            />

            <Heading className={Margins.top16 + " " + Margins.bottom8}>عدد الإشعارات الفائتة</Heading>
            <FormSwitch
                title="عند العودة إلى Discord، ستظهر إشعار بعدد الإشعارات التي فاتتك"
                value={settings.missed}
                onChange={(v: boolean) => settings.missed = v}
            />

            <Heading className={Margins.top16 + " " + Margins.bottom8}>مهلة الإشعار</Heading>
            <Paragraph className={Margins.bottom16}>اضبط على 0 ثانية لعدم الإغلاق التلقائي أبداً</Paragraph>
            <Slider
                disabled={settings.useNative === "always"}
                markers={[0, 1000, 2500, 5000, 10_000, 20_000]}
                minValue={0}
                maxValue={20_000}
                initialValue={settings.timeout}
                onValueChange={v => settings.timeout = v}
                onValueRender={v => (v / 1000).toFixed(2) + "s"}
                onMarkerRender={v => (v / 1000) + "s"}
                stickToMarkers={false}
            />

            <Heading className={Margins.top16 + " " + Margins.bottom8}>حد سجل الإشعارات</Heading>
            <Paragraph className={Margins.bottom16}>
                عدد الإشعارات التي يتم حفظها في السجل قبل حذف القديمة.
                اضبط على <code>0</code> لتعطيل السجل و<code>∞</code> لعدم الحذف التلقائي أبداً
            </Paragraph>
            <Slider
                markers={[0, 25, 50, 75, 100, 200]}
                minValue={0}
                maxValue={200}
                stickToMarkers={true}
                initialValue={settings.logLimit}
                onValueChange={v => settings.logLimit = v}
                onValueRender={v => v === 200 ? "∞" : v}
                onMarkerRender={v => v === 200 ? "∞" : v}
            />
        </div>
    );
}
