/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./VencordTab.css";

import { openNotificationLogModal } from "@api/Notifications/notificationLog";
import { plugins } from "@api/PluginManager";
import { useSettings } from "@api/Settings";
import { Button } from "@components/Button";
import { Divider } from "@components/Divider";
import { Flex } from "@components/Flex";
import { FormSwitch } from "@components/FormSwitch";
import { Heading } from "@components/Heading";
import { FolderIcon, GithubIcon, LogIcon, PaintbrushIcon, RestartIcon } from "@components/Icons";
import { Notice } from "@components/Notice";
import { Paragraph } from "@components/Paragraph";
import { openContributorModal, openPluginModal, SettingsTab, wrapTab } from "@components/settings";
import { QuickAction, QuickActionCard } from "@components/settings/QuickAction";
import { SpecialCard } from "@components/settings/SpecialCard";
import BadgeAPI from "@plugins/_api/badges";
import { gitRemote } from "@shared/vencordUserAgent";
import { DONOR_ROLE_ID, GUILD_ID, IS_MAC, IS_WINDOWS, VC_DONOR_ROLE_ID, VC_GUILD_ID } from "@utils/constants";
import { classNameFactory } from "@utils/css";
import { Margins } from "@utils/margins";
import { identity, isAnyPluginDev } from "@utils/misc";
import { relaunch } from "@utils/native";
import { Alerts, GuildMemberStore, React, Select, UserStore } from "@webpack/common";

import { DonateButtonComponent } from "./DonateButton";
import { openNotificationSettingsModal } from "./NotificationSettings";

const DEFAULT_DONATE_IMAGE = "https://cdn.discordapp.com/emojis/1026533090627174460.png";
const SHIGGY_DONATE_IMAGE = "https://equicord.org/assets/favicon.png";

const VENNIE_DONATOR_IMAGE = "https://cdn.discordapp.com/emojis/1238120638020063377.png";
const COZY_CONTRIB_IMAGE = "https://cdn.discordapp.com/emojis/1026533070955872337.png";

const DONOR_BACKGROUND_IMAGE = "https://media.discordapp.net/stickers/1311070116305436712.png?size=2048";
const CONTRIB_BACKGROUND_IMAGE = "https://media.discordapp.net/stickers/1311070166481895484.png?size=2048";

const cl = classNameFactory("vc-vencord-tab-");

type KeysOfType<Object, Type> = {
    [K in keyof Object]: Object[K] extends Type ? K : never;
}[keyof Object];

function EquicordSettings() {
    const settings = useSettings();

    const donateImage = React.useMemo(
        () => (Math.random() > 0.5 ? DEFAULT_DONATE_IMAGE : SHIGGY_DONATE_IMAGE),
        [],
    );

    const needsVibrancySettings = IS_DISCORD_DESKTOP && IS_MAC;

    const user = UserStore?.getCurrentUser();

    const Switches: Array<false | {
        key: KeysOfType<typeof settings, boolean>;
        title: string;
        description?: string;
        restartRequired?: boolean;
        warning?: string;
    }>
        = [
            {
                key: "useQuickCss",
                title: "تفعيل CSS المخصص",
                description: "تحميل CSS مخصص من محرر QuickCSS.",
            },
            !IS_WEB && {
                key: "enableReactDevtools",
                title: "تفعيل أدوات مطوري React",
                description: "تفعيل امتداد أدوات مطوري React لتصحيح مكونات React في ديسكورد.",
                restartRequired: true,
            },
            (!IS_WEB && !IS_DISCORD_DESKTOP || !IS_WINDOWS) && {
                key: "mainWindowFrameless",
                title: "تعطيل إطار النافذة الرئيسية",
                description: "إزالة إطار النافذة الأصلي للحصول على مظهر أنظف. يمكنك تحريك النافذة بسحب منطقة شريط العنوان.",
                restartRequired: true,
            },
            !IS_WEB && (!IS_DISCORD_DESKTOP || !IS_WINDOWS
                ? {
                    key: "frameless",
                    title: "تعطيل جميع إطارات النوافذ",
                    description: "إزالة إطار النافذة الأصلي للحصول على مظهر أنظف. يمكنك تحريك النافذة بسحب منطقة شريط العنوان.",
                    restartRequired: true,
                }
                : {
                    key: "winNativeTitleBar",
                    title: "استخدام شريط العنوان الأصلي لويندوز بدلاً من شريط ديسكورد المخصص",
                    description: "استبدال شريط عنوان ديسكورد المخصص بشريط عنوان ويندوز القياسي.",
                    restartRequired: true,
                }
            ),
            !IS_WEB && {
                key: "transparent",
                title: "تفعيل شفافية النافذة",
                description: "جعل نافذة ديسكورد شفافة. يتطلب قالباً يدعم الشفافية وإلا لن يكون له أي أثر.",
                restartRequired: true,
                warning: IS_WINDOWS
                    ? "سيوقف هذا إمكانية تغيير حجم النافذة ويمنعك من تثبيتها على حواف الشاشة."
                    : "سيوقف هذا إمكانية تغيير حجم النافذة.",
            },
            IS_DISCORD_DESKTOP && {
                key: "disableMinSize",
                title: "تعطيل الحجم الأدنى للنافذة",
                description: "السماح بتصغير نافذة ديسكورد إلى أقل من حجمها الافتراضي الأدنى. مفيد لمديري النوافذ المبلطة والشاشات الصغيرة.",
                restartRequired: true,
            },
            !IS_WEB && IS_WINDOWS && {
                key: "winCtrlQ",
                title: "تسجيل Ctrl+Q كاختصار لإغلاق ديسكورد",
                description: "إضافة Ctrl+Q كاختصار لوحة مفاتيح لإغلاق ديسكورد. يوفر بديلاً لـ Alt+F4 لإغلاق التطبيق بسرعة.",
                restartRequired: true,
            },
        ];

    return (
        <SettingsTab>
            {(isEquicordDonor(user?.id) || isVencordDonor(user?.id)) ? (
                <SpecialCard
                    title="التبرعات"
                    subtitle="شكراً لتبرعك!"
                    description={
                        isEquicordDonor(user?.id) && isVencordDonor(user?.id)
                            ? "يرى جميع مستخدمي Vencord شارة متبرع Vencord، ويرى مستخدمو Equicord شارة متبرع Equicord. لتغيير شارتك في Vencord تواصل مع @vending.machine، ولشارة Equicord افتح تذكرة في سيرفر Equicord."
                            : isVencordDonor(user?.id)
                                ? "يرى جميع مستخدمي Vencord شارتك! يمكنك إدارة مزاياك عبر مراسلة @vending.machine."
                                : "يرى جميع مستخدمي Equicord شارتك! يمكنك إدارة مزاياك عبر فتح تذكرة في سيرفر Equicord."
                    }
                    cardImage={VENNIE_DONATOR_IMAGE}
                    backgroundImage={DONOR_BACKGROUND_IMAGE}
                    backgroundColor="#ED87A9"
                >
                    <DonateButtonComponent donated={true} />
                </SpecialCard>
            ) : (
                <SpecialCard
                    title="ادعم المشروع"
                    description="يسعدنا دعمك لتطوير Equicord من خلال التبرع!"
                    cardImage={donateImage}
                    backgroundImage={DONOR_BACKGROUND_IMAGE}
                    backgroundColor="#c3a3ce"
                >
                    <DonateButtonComponent />
                </SpecialCard>
            )}
            {isAnyPluginDev(user?.id) && (
                <SpecialCard
                    title="المساهمات"
                    subtitle="شكراً لمساهمتك!"
                    description="بفضل مساهمتك في Equicord، حصلت على شارة مميزة!"
                    cardImage={COZY_CONTRIB_IMAGE}
                    backgroundImage={CONTRIB_BACKGROUND_IMAGE}
                    backgroundColor="#EDCC87"
                >
                    <Button
                        variant="none"
                        size="medium"
                        type="button"
                        onClick={() => openContributorModal(user)}
                        className="vc-contrib-button"
                    >
                        <GithubIcon aria-hidden fill={"#000000"} className={"vc-contrib-github"} />
                        عرض مساهماتك
                    </Button>
                </SpecialCard>
            )}

            <Heading className={Margins.top16}>إجراءات سريعة</Heading>
            <Paragraph className={Margins.bottom16}>
                إجراءات شائعة الاستخدام. توفر هذه الاختصارات وصولاً سريعاً للميزات الأكثر استخداماً دون التنقل عبر القوائم.
            </Paragraph>

            <QuickActionCard>
                <QuickAction
                    Icon={LogIcon}
                    text="سجل الإشعارات"
                    action={openNotificationLogModal}
                />
                <QuickAction
                    Icon={PaintbrushIcon}
                    text="تعديل QuickCSS"
                    action={() => VencordNative.quickCss.openEditor()}
                />
                {!IS_WEB && (
                    <QuickAction
                        Icon={RestartIcon}
                        text="إعادة تشغيل ديسكورد"
                        action={relaunch}
                    />
                )}
                {!IS_WEB && (
                    <QuickAction
                        Icon={FolderIcon}
                        text="فتح مجلد الإعدادات"
                        action={() => VencordNative.settings.openFolder()}
                    />
                )}
                <QuickAction
                    Icon={GithubIcon}
                    text="عرض الكود المصدري"
                    action={() =>
                        VencordNative.native.openExternal(
                            "https://github.com/" + gitRemote,
                        )
                    }
                />
            </QuickActionCard>

            <Divider className={Margins.top20} />

            <Heading className={Margins.top20}>إعدادات العميل</Heading>
            <Paragraph className={Margins.bottom16}>
                اضبط كيفية عمل Equicord مع ديسكورد. تؤثر هذه الإعدادات على مظهر وسلوك تطبيق ديسكورد.
            </Paragraph>
            <Notice.Info className={Margins.bottom20} style={{ width: "100%" }}>
                يمكنك تخصيص موضع قسم الإعدادات هذا في قائمة إعدادات ديسكورد عبر{" "}
                <a
                    role="button"
                    onClick={() => openPluginModal(plugins.Settings)}
                    style={{ cursor: "pointer", color: "var(--text-link)" }}
                >
                    إضافة الإعدادات
                </a>.
            </Notice.Info>

            {Switches.filter((s): s is Exclude<typeof s, false> => !!s).map(
                s => (
                    <FormSwitch
                        key={s.key}
                        value={settings[s.key]}
                        onChange={v => {
                            settings[s.key] = v;

                            if (s.restartRequired) {
                                Alerts.show({
                                    title: "إعادة تشغيل مطلوبة",
                                    body: "يلزم إعادة تشغيل ديسكورد لتطبيق هذا التغيير",
                                    confirmText: "إعادة التشغيل الآن",
                                    cancelText: "لاحقاً",
                                    onConfirm: relaunch
                                });
                            }
                        }}
                        title={s.title}
                        description={
                            s.warning ? (
                                <>
                                    {s.description}
                                    <Notice.Warning className={Margins.top8} style={{ width: "100%" }}>
                                        {s.warning}
                                    </Notice.Warning>
                                </>
                            ) : (
                                s.description
                            )
                        }
                        hideBorder
                    />
                ),
            )}

            {needsVibrancySettings && (
                <>
                    <Divider className={Margins.top20} />

                    <Heading className={Margins.top20}>شفافية النافذة</Heading>
                    <Paragraph className={Margins.bottom16}>
                        خصّص تأثير شفافية نافذة macOS. يتحكم هذا الإعداد في نمط الضبابية والشفافية لنافذة ديسكورد. تستلزم التغييرات إعادة تشغيل لتصبح سارية.
                    </Paragraph>
                    <Select
                        className={Margins.bottom20}
                        placeholder="نمط شفافية النافذة"
                        options={[
                            // مرتبة من الأكثر تعتيماً إلى الأكثر شفافية
                            {
                                label: "بلا شفافية",
                                value: undefined,
                            },
                            {
                                label: "تحت الصفحة (تلوين النافذة)",
                                value: "under-page",
                            },
                            {
                                label: "المحتوى",
                                value: "content",
                            },
                            {
                                label: "النافذة",
                                value: "window",
                            },
                            {
                                label: "التحديد",
                                value: "selection",
                            },
                            {
                                label: "شريط العنوان",
                                value: "titlebar",
                            },
                            {
                                label: "الرأس",
                                value: "header",
                            },
                            {
                                label: "الشريط الجانبي",
                                value: "sidebar",
                            },
                            {
                                label: "التلميح",
                                value: "tooltip",
                            },
                            {
                                label: "القائمة",
                                value: "menu",
                            },
                            {
                                label: "النافذة المنبثقة",
                                value: "popover",
                            },
                            {
                                label: "واجهة ملء الشاشة (شفافة مع تعتيم طفيف)",
                                value: "fullscreen-ui",
                            },
                            {
                                label: "HUD (الأكثر شفافية)",
                                value: "hud",
                            },
                        ]}
                        select={v => (settings.macosVibrancyStyle = v)}
                        isSelected={v => settings.macosVibrancyStyle === v}
                        serialize={identity}
                    />
                </>
            )}

            <Divider className={Margins.top20} />

            <Heading className={Margins.top20}>الإشعارات</Heading>
            <Paragraph className={Margins.bottom16}>
                اضبط كيفية تعامل Equicord مع الإشعارات. يمكنك تخصيص متى وكيف تتلقى التنبيهات، أو الاطلاع على سجل الإشعارات السابقة.
            </Paragraph>

            <Flex gap="16px">
                <Button onClick={openNotificationSettingsModal}>
                    إعدادات الإشعارات
                </Button>
                <Button variant="secondary" onClick={openNotificationLogModal}>
                    عرض سجل الإشعارات
                </Button>
            </Flex>
        </SettingsTab>
    );
}

export default wrapTab(EquicordSettings, "Equicord Settings");

export function isEquicordDonor(userId: string): boolean {
    const donorBadges = BadgeAPI.getEquicordDonorBadges(userId);
    return GuildMemberStore.getMember(GUILD_ID, userId)?.roles.includes(DONOR_ROLE_ID) || !!donorBadges;
}

export function isVencordDonor(userId: string): boolean {
    const donorBadges = BadgeAPI.getDonorBadges(userId);
    return GuildMemberStore.getMember(VC_GUILD_ID, userId)?.roles.includes(VC_DONOR_ROLE_ID) || !!donorBadges;
}
