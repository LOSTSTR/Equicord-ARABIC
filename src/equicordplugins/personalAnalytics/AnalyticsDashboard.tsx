/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import * as DataStore from "@api/DataStore";
import { classNameFactory } from "@utils/css";
import { formatDurationMs } from "@utils/text";
import { RenderModalProps } from "@vencord/discord-types";
import { ChannelStore, LocaleStore, Modal, Tooltip, useEffect, useState } from "@webpack/common";

import { generateAndSave } from "./shareImage";
import { AggregatedStats, DayStats, DB_KEY, emptyDay, getLast7DayKeys, shortDayLabel, StatsDB } from "./types";

const cl = classNameFactory("vc-personalanalytics-");

const STRINGS = {
    ar: {
        title: "التحليلات الشخصية",
        weekOf: (d: string) => `أسبوع ${d}`,
        messages: "الرسائل",
        voiceTime: "وقت الصوت",
        reactionsGiven: "التفاعلات المُضافة",
        activeDays: "الأيام النشطة",
        dailyActivity: "النشاط اليومي",
        topChannels: "أكثر القنوات نشاطاً",
        activityByHour: "النشاط بالساعة",
        activeDaysValue: (n: number) => `${n} من 7`,
        saveAsImage: "📥 حفظ كصورة",
        close: "إغلاق",
        loading: "جاري تحميل إحصاءاتك...",
    },
    en: {
        title: "Personal Analytics",
        weekOf: (d: string) => `Week of ${d}`,
        messages: "Messages",
        voiceTime: "Voice time",
        reactionsGiven: "Reactions given",
        activeDays: "Active days",
        dailyActivity: "Daily Activity",
        topChannels: "Top Channels",
        activityByHour: "Activity by Hour",
        activeDaysValue: (n: number) => `${n} / 7`,
        saveAsImage: "📥 Save as Image",
        close: "Close",
        loading: "Loading your stats…",
    },
} as const;

function aggregate(db: StatsDB, keys: string[]): AggregatedStats {
    let totalMessages = 0;
    let totalVoiceMs = 0;
    let totalReactionsGiven = 0;
    let totalReactionsReceived = 0;
    let activeDays = 0;
    const channelMap: Record<string, number> = {};
    const aggHours: number[] = Array(24).fill(0) as number[];
    const dailyMessages: Array<{ date: string; count: number; }> = [];

    for (const key of keys) {
        const day: DayStats = db[key] ?? emptyDay();
        totalMessages += day.messages;
        totalVoiceMs += day.voiceMs;
        totalReactionsGiven += day.reactionsGiven;
        totalReactionsReceived += day.reactionsReceived;
        if (day.messages > 0) activeDays++;
        dailyMessages.push({ date: key, count: day.messages });
        for (const [ch, cnt] of Object.entries(day.channels)) {
            channelMap[ch] = (channelMap[ch] ?? 0) + cnt;
        }
        for (let h = 0; h < 24; h++) {
            aggHours[h] += day.hours[h] ?? 0;
        }
    }

    const topChannels = Object.entries(channelMap)
        .map(([id, count]) => ({ id, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    return { totalMessages, totalVoiceMs, totalReactionsGiven, totalReactionsReceived, activeDays, topChannels, dailyMessages, aggHours };
}

function StatCard({ icon, label, value, accent }: { icon: string; label: string; value: string; accent: string; }) {
    return (
        <div className={cl("stat-card")} style={{ "--card-accent": accent } as React.CSSProperties}>
            <span className={cl("stat-icon")}>{icon}</span>
            <span className={cl("stat-value")}>{value}</span>
            <span className={cl("stat-label")}>{label}</span>
        </div>
    );
}

function BarChart({ data }: { data: Array<{ date: string; count: number; }>; }) {
    const max = Math.max(...data.map(d => d.count), 1);
    return (
        <div className={cl("bar-chart")}>
            {data.map(({ date, count }) => (
                <Tooltip key={date} text={`${shortDayLabel(date)}: ${count} messages`}>
                    {props => (
                        <div {...props} className={cl("bar-col")}>
                            <div
                                className={cl("bar")}
                                style={{ height: `${Math.max((count / max) * 100, count > 0 ? 8 : 2)}%` }}
                            />
                            <span className={cl("bar-label")}>{shortDayLabel(date)}</span>
                        </div>
                    )}
                </Tooltip>
            ))}
        </div>
    );
}

function HeatmapRow({ hours }: { hours: number[]; }) {
    const max = Math.max(...hours, 1);
    return (
        <div className={cl("heatmap")}>
            {hours.map((count, h) => (
                <Tooltip key={h} text={`${h}:00 — ${count} messages`}>
                    {props => (
                        <div
                            {...props}
                            className={cl("heatmap-cell")}
                            style={{ opacity: count > 0 ? 0.15 + (count / max) * 0.85 : 0.07 }}
                        />
                    )}
                </Tooltip>
            ))}
        </div>
    );
}

export function AnalyticsDashboard({ modalProps }: { modalProps: RenderModalProps; }) {
    const [stats, setStats] = useState<AggregatedStats | null>(null);
    const keys = getLast7DayKeys();
    const weekStart = new Date(keys[0] + "T12:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" });
    const s = LocaleStore.locale?.startsWith("ar") ? STRINGS.ar : STRINGS.en;
    const isAR = s === STRINGS.ar;

    useEffect(() => {
        void DataStore.get<StatsDB>(DB_KEY).then(db => {
            setStats(aggregate(db ?? {}, keys));
        });
    }, []);

    if (!stats) {
        return (
            <Modal {...modalProps} size="sm" title={`📊 ${s.title}`}>
                <div className={cl("loading")}>{s.loading}</div>
            </Modal>
        );
    }

    return (
        <Modal
            {...modalProps}
            size="md"
            title={`📊 ${s.title}`}
            subtitle={s.weekOf(weekStart)}
            actions={[
                {
                    text: s.saveAsImage,
                    variant: "primary",
                    onClick: () => void generateAndSave(stats, weekStart),
                },
                {
                    text: s.close,
                    variant: "secondary",
                    onClick: modalProps.onClose,
                },
            ]}
        >
            <div className={cl("content")} dir={isAR ? "rtl" : "ltr"}>
                <div className={cl("stat-grid")}>
                    <StatCard icon="💬" label={s.messages} value={stats.totalMessages.toLocaleString()} accent="#5865f2" />
                    <StatCard icon="🎙️" label={s.voiceTime} value={formatDurationMs(stats.totalVoiceMs)} accent="#3ba55c" />
                    <StatCard icon="⭐" label={s.reactionsGiven} value={String(stats.totalReactionsGiven)} accent="#faa81a" />
                    <StatCard icon="📅" label={s.activeDays} value={s.activeDaysValue(stats.activeDays)} accent="#eb459e" />
                </div>

                <h3 className={cl("section-heading")}>{s.dailyActivity}</h3>
                <BarChart data={stats.dailyMessages} />

                {stats.topChannels.length > 0 && (
                    <>
                        <h3 className={cl("section-heading")}>{s.topChannels}</h3>
                        <div className={cl("channels-list")}>
                            {stats.topChannels.map((ch, i) => {
                                const chName = ChannelStore.getChannel(ch.id)?.name ?? ch.id;
                                const maxCount = stats.topChannels[0]?.count ?? 1;
                                return (
                                    <div key={ch.id} className={cl("channel-row")}>
                                        <span className={cl("channel-rank")}>#{i + 1}</span>
                                        <span className={cl("channel-name")}>#{chName}</span>
                                        <div className={cl("channel-bar-track")}>
                                            <div
                                                className={cl("channel-bar-fill")}
                                                style={{ width: `${(ch.count / maxCount) * 100}%` }}
                                            />
                                        </div>
                                        <span className={cl("channel-count")}>{ch.count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                <h3 className={cl("section-heading")}>{s.activityByHour}</h3>
                <div className={cl("heatmap-labels")}>
                    {["12am", "6am", "12pm", "6pm", "11pm"].map(l => (
                        <span key={l}>{l}</span>
                    ))}
                </div>
                <HeatmapRow hours={stats.aggHours} />
            </div>
        </Modal>
    );
}
