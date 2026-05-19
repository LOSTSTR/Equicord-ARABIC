/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { type AudioPlayerInterface, createAudioPlayer, defaultAudioNames } from "@api/AudioPlayer";
import { useSettings } from "@api/Settings";
import { useEffect, useMemo, useRef, useState } from "@webpack/common";
import type { JSX, MouseEvent } from "react";

import { getQuestifySettings, useQuestifySettings } from "../settings/access";
import { t } from "@utils/esharqI18n";
import { startAutoFetchingQuests } from "../settings/fetching";
import { q } from "../utils/ui";
import { ManaSelectFormattedOption, ManaSelectOption, SettingsCard, SettingsDescription, SettingsHeader, SettingsRow, SettingsRowItem, SettingsSelect, SettingsSlider, SettingsSubheader, SettingsSubtleSwitch } from "./shared";

function getQuestFetchIntervalOptions(): ManaSelectOption[] {
    return [
        { id: "30-minutes", label: t("30 دقيقة", "30 minutes"), value: String(30 * 60) },
        { id: "45-minutes", label: t("45 دقيقة", "45 minutes"), value: String(45 * 60) },
        { id: "1-hour", label: t("ساعة واحدة", "1 hour"), value: String(60 * 60) },
        { id: "3-hours", label: t("3 ساعات", "3 hours"), value: String(3 * 60 * 60) },
        { id: "6-hours", label: t("6 ساعات", "6 hours"), value: String(6 * 60 * 60) },
        { id: "12-hours", label: t("12 ساعة", "12 hours"), value: String(12 * 60 * 60) },
    ];
}

function SoundIcon({ className }: { className?: string; }): JSX.Element {
    return (
        <svg
            viewBox="0 0 24 24"
            height={18}
            width={18}
            fill="none"
            className={className}
            aria-hidden={true}
        >
            <path fill="currentColor" d="M12 3a1 1 0 0 0-1-1h-.06a1 1 0 0 0-.74.32L5.92 7H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2.92l4.28 4.68a1 1 0 0 0 .74.32H11a1 1 0 0 0 1-1V3ZM15.1 20.75c-.58.14-1.1-.33-1.1-.92v-.03c0-.5.37-.92.85-1.05a7 7 0 0 0 0-13.5A1.11 1.11 0 0 1 14 4.2v-.03c0-.6.52-1.06 1.1-.92a9 9 0 0 1 0 17.5Z" />
            <path fill="currentColor" d="M15.16 16.51c-.57.28-1.16-.2-1.16-.83v-.14c0-.43.28-.8.63-1.02a3 3 0 0 0 0-5.04c-.35-.23-.63-.6-.63-1.02v-.14c0-.63.59-1.1 1.16-.83a5 5 0 0 1 0 9.02Z" />
        </svg>
    );
}

function getSoundOptions(): ManaSelectOption[] {
    return defaultAudioNames()
        .map(sound => ({
            id: sound,
            label: formatSoundName(sound),
            value: sound,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
}

function formatSoundName(sound: string): string {
    return sound
        .toUpperCase()
        .replace(/_/g, " ")
        .replace(/(\d+)/g, " $1");
}

interface QuestNotificationSoundSelectProps {
    disabled?: boolean;
    label: string;
    onChange: (value: string | null) => void;
    onPreview: (sound: string) => void;
    options: ManaSelectOption[];
    playingSound: string | null;
    tooltip?: { position: "top" | "bottom", text: string; };
    value: string | null;
}

function QuestNotificationSoundSelect({
    disabled,
    label,
    onChange,
    onPreview,
    options,
    playingSound,
    tooltip,
    value,
}: QuestNotificationSoundSelectProps): JSX.Element {
    function formatOption(option: ManaSelectOption): ManaSelectFormattedOption {
        const sound = option.value || null;
        const isPlaying = sound != null && playingSound === sound;

        function handlePreviewMouseDown(event: MouseEvent<HTMLButtonElement>) {
            event.preventDefault();
            event.stopPropagation();
        }

        function handlePreviewClick(event: MouseEvent<HTMLButtonElement>) {
            event.preventDefault();
            event.stopPropagation();

            if (sound && !disabled) {
                onPreview(sound);
            }
        }

        return {
            ...option,
            trailing: sound
                ? (
                    <button
                        type="button"
                        className={q("sound-preview-button", isPlaying ? "playing-audio" : undefined)}
                        aria-label={`Preview ${option.label}`}
                        disabled={disabled}
                        onMouseDown={handlePreviewMouseDown}
                        onClick={handlePreviewClick}
                    >
                        <SoundIcon />
                    </button>
                )
                : undefined,
        };
    }

    return (
        <SettingsSelect
            label={label}
            options={options}
            value={value}
            selectionMode="single"
            disabled={disabled}
            clearable={true}
            fullWidth={true}
            maxOptionsVisible={7}
            placeholder="DISABLED"
            selectClassName="sound-select"
            formatOption={formatOption}
            tooltip={tooltip}
            onSelectionChange={nextValue => {
                if (nextValue != null && typeof nextValue !== "string") return;

                onChange(nextValue ?? null);
            }}
        />
    );
}

export function QuestNotificationsSetting(): JSX.Element {
    useSettings(["plugins.Settings.arabicMode"]);

    const questNotifications = useQuestifySettings([
        "newExcludedQuestAlertSound",
        "newExcludedQuestAlertVolume",
        "newQuestAlertSound",
        "newQuestAlertVolume",
        "questFetchInterval",
        "disableQuestsEverything",
        "notifyOnNewExcludedQuests",
        "notifyOnNewQuests",
        "notifyOnQuestComplete",
        "questCompletedAlertSound",
        "questCompletedAlertVolume",
    ]);

    const questFetchIntervalOptions = getQuestFetchIntervalOptions();
    const soundOptions = useMemo(getSoundOptions, []);
    const activePlayer = useRef<AudioPlayerInterface | null>(null);
    const [playingSound, setPlayingSound] = useState<string | null>(null);
    const disabled = questNotifications.disableQuestsEverything;

    function clearActivePlayer(): void {
        const player = activePlayer.current;
        activePlayer.current = null;
        player?.stop();
        setPlayingSound(null);
    }

    function previewSound(sound: string, volume: number): void {
        if (playingSound === sound) {
            clearActivePlayer();

            return;
        }

        clearActivePlayer();
        const player = createAudioPlayer(sound, { volume: Math.max(0, Math.min(100, volume)), onEnded: clearActivePlayer });
        activePlayer.current = player;
        setPlayingSound(sound);
        player?.play();
    }

    useEffect(() => clearActivePlayer, []);
    useEffect(() => {
        if (disabled) {
            clearActivePlayer();
        }
    }, [disabled]);

    function updateFetchInterval(value: string | string[] | null): void {
        if (value != null && typeof value !== "string") return;

        const interval = value == null ? 0 : Number(value);
        getQuestifySettings().questFetchInterval = interval;
        startAutoFetchingQuests(true);
    }

    return (
        <SettingsCard>
            <SettingsHeader>{t("إشعارات المهام", "Quest Notifications")}</SettingsHeader>
            <SettingsDescription>{t("إعداد إشعارات وتنبيهات إتمام المهام واكتشاف المهام الجديدة.", "Configure notifications and alerts for quest completion and new quest discovery.")}</SettingsDescription>
            <SettingsSubheader>{t("المهمة مكتملة", "Quest Completed")}</SettingsSubheader>
            <SettingsSubtleSwitch
                checked={questNotifications.notifyOnQuestComplete}
                disabled={disabled}
                label={t("إظهار إشعار عند إتمام مهمة:", "Show notification on quest completion:")}
                onChange={checked => { getQuestifySettings().notifyOnQuestComplete = checked; }}
                bottomSpacing="5"
            />
            <SettingsRow>
                <SettingsRowItem className="sound-select-row-item">
                    <QuestNotificationSoundSelect
                        label={t("تشغيل صوت عند إتمام مهمة:", "Play sound on quest completion:")}
                        disabled={disabled}
                        options={soundOptions}
                        value={questNotifications.questCompletedAlertSound}
                        playingSound={playingSound}
                        onPreview={sound => previewSound(sound, questNotifications.questCompletedAlertVolume)}
                        onChange={value => { getQuestifySettings().questCompletedAlertSound = value; }}
                    />
                </SettingsRowItem>
                <SettingsRowItem className="volume-slider-row-item">
                    <SettingsSlider
                        label={t("الصوت:", "Sound:")}
                        className="inline-volume-slider"
                        disabled={disabled}
                        value={questNotifications.questCompletedAlertVolume}
                        onChange={value => { getQuestifySettings().questCompletedAlertVolume = value; }}
                    />
                </SettingsRowItem>
            </SettingsRow>
            <SettingsSubheader>{t("مهام جديدة مُكتشفة", "New Quests Found")}</SettingsSubheader>
            <SettingsSubtleSwitch
                checked={questNotifications.notifyOnNewQuests}
                disabled={disabled}
                label={t("إظهار إشعار عند اكتشاف مهام جديدة:", "Show notification when new quests are found:")}
                bottomSpacing="5"
                onChange={checked => {
                    getQuestifySettings().notifyOnNewQuests = checked;
                    startAutoFetchingQuests(true);
                }}
            />
            <SettingsRow>
                <SettingsRowItem className="sound-select-row-item">
                    <QuestNotificationSoundSelect
                        label={t("تشغيل صوت عند اكتشاف مهام جديدة:", "Play sound when new quests are found:")}
                        disabled={disabled}
                        options={soundOptions}
                        value={questNotifications.newQuestAlertSound}
                        playingSound={playingSound}
                        onPreview={sound => previewSound(sound, questNotifications.newQuestAlertVolume)}
                        onChange={value => {
                            getQuestifySettings().newQuestAlertSound = value;
                            startAutoFetchingQuests(true);
                        }}
                    />
                </SettingsRowItem>
                <SettingsRowItem className="volume-slider-row-item">
                    <SettingsSlider
                        label={t("الصوت:", "Sound:")}
                        className="inline-volume-slider"
                        disabled={disabled}
                        value={questNotifications.newQuestAlertVolume}
                        onChange={value => { getQuestifySettings().newQuestAlertVolume = value; }}
                    />
                </SettingsRowItem>
            </SettingsRow>
            <SettingsSubtleSwitch
                className="margin-top-14"
                checked={questNotifications.notifyOnNewExcludedQuests}
                disabled={disabled}
                label={t("إظهار إشعار عند اكتشاف مهام مستبعدة جديدة:", "Show notification when new ignored quests are found:")}
                bottomSpacing="5"
                onChange={checked => {
                    getQuestifySettings().notifyOnNewExcludedQuests = checked;
                    startAutoFetchingQuests(true);
                }}
                tooltip={{
                    position: "top",
                    text: t(
                        "بعض المهام مستبعدة من قائمتك بسبب قيود المنطقة أو المنصة."
                            + "\n\nعند التمكين، ستجلب Questify إعداداتها، وتطبق فلاتر المهام والمكافآت، وتطبع البيانات في وحدة التحكم، وتعرض إشعاراً منفصلاً للمهام المستبعدة المطابقة.",
                        "Some quests are excluded from your list due to region or platform restrictions."
                            + "\n\nWhen enabled, Questify will fetch their settings, apply quest and reward filters, print data to the console, and show a separate notification for matching excluded quests."
                    )
                }}
            />
            <SettingsRow>
                <SettingsRowItem className="sound-select-row-item">
                    <QuestNotificationSoundSelect
                        label={t("تشغيل صوت عند اكتشاف مهام مستبعدة جديدة:", "Play sound when new ignored quests are found:")}
                        disabled={disabled}
                        options={soundOptions}
                        value={questNotifications.newExcludedQuestAlertSound}
                        playingSound={playingSound}
                        onPreview={sound => previewSound(sound, questNotifications.newExcludedQuestAlertVolume)}
                        onChange={value => {
                            getQuestifySettings().newExcludedQuestAlertSound = value;
                            startAutoFetchingQuests(true);
                        }}
                        tooltip={{
                            position: "top",
                            text: t(
                                "بعض المهام مستبعدة من قائمتك بسبب قيود المنطقة أو المنصة."
                                    + "\n\nعند اختيار صوت، ستجلب Questify إعداداتها وتشغّل هذا الصوت للمهام المستبعدة المطابقة.",
                                "Some quests are excluded from your list due to region or platform restrictions."
                                    + "\n\nWhen a sound is selected, Questify will fetch their settings and play this sound for matching excluded quests."
                            )
                        }}
                    />
                </SettingsRowItem>
                <SettingsRowItem className="volume-slider-row-item">
                    <SettingsSlider
                        label={t("الصوت:", "Sound:")}
                        className="inline-volume-slider"
                        disabled={disabled}
                        value={questNotifications.newExcludedQuestAlertVolume}
                        onChange={value => { getQuestifySettings().newExcludedQuestAlertVolume = value; }}
                    />
                </SettingsRowItem>
            </SettingsRow>
            <SettingsRow>
                <SettingsRowItem>
                    <SettingsSelect
                        className="margin-top-12"
                        label={t("فترة جلب المهام:", "Quest fetch interval:")}
                        options={questFetchIntervalOptions}
                        value={questNotifications.questFetchInterval > 0 ? String(questNotifications.questFetchInterval) : null}
                        selectionMode="single"
                        disabled={disabled}
                        clearable={true}
                        fullWidth={true}
                        placeholder={t("معطّل", "Disabled")}
                        maxOptionsVisible={questFetchIntervalOptions.length}
                        onSelectionChange={updateFetchInterval}
                        tooltip={{
                            position: "top",
                            text: t(
                                "يجلب Discord المهام عند التحميل وعند زيارة صفحة المهام فقط."
                                    + "\n\nتجلب هذه الفترة المهام بشكل دوري بينما يظل العميل مفتوحاً، لتبقى مؤشرات زر المهام وتنبيهات المهام الجديدة محدَّثة طوال اليوم."
                                    + "\n\nلا تعمل إلا إذا كانت إعدادات زر المهام أو إشعاراتها تستوجب الجلب الدوري.",
                                "Discord only fetches quests on load and when visiting the quests page."
                                    + "\n\nThis interval fetches quests periodically while the client is open, keeping quest button indicators and new quest alerts up to date throughout the day."
                                    + "\n\nOnly works if quest button or notification settings require periodic fetching."
                            )
                        }}
                    />
                </SettingsRowItem>
            </SettingsRow>
        </SettingsCard>
    );
}
