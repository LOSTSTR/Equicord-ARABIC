/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export const DB_KEY = "PersonalAnalytics_stats";

export interface DayStats {
    messages: number;
    voiceMs: number;
    reactionsGiven: number;
    reactionsReceived: number;
    channels: Record<string, number>;
    hours: number[];
}

export type StatsDB = Record<string, DayStats>;

export interface AggregatedStats {
    totalMessages: number;
    totalVoiceMs: number;
    totalReactionsGiven: number;
    totalReactionsReceived: number;
    activeDays: number;
    topChannels: Array<{ id: string; count: number; }>;
    dailyMessages: Array<{ date: string; count: number; }>;
    aggHours: number[];
}

export interface Records {
    bestDayCount: number;
    bestDayDate: string;
    longestVoiceMs: number;
}

export interface ActivityProfile {
    en: string;
    ar: string;
    icon: string;
}

export interface Comparison {
    messages: number | null;
    voiceMs: number | null;
    reactions: number | null;
}

export function emptyDay(): DayStats {
    return {
        messages: 0,
        voiceMs: 0,
        reactionsGiven: 0,
        reactionsReceived: 0,
        channels: {},
        hours: Array(24).fill(0) as number[],
    };
}

export function todayKey(): string {
    return new Date().toISOString().slice(0, 10);
}

function isoKey(date: Date): string {
    return date.toISOString().slice(0, 10);
}

export function getLast7DayKeys(): string[] {
    const keys: string[] = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        keys.push(isoKey(d));
    }
    return keys;
}

export function getPrev7DayKeys(): string[] {
    const keys: string[] = [];
    for (let i = 13; i >= 7; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        keys.push(isoKey(d));
    }
    return keys;
}

export function getLast84DayKeys(): string[] {
    const keys: string[] = [];
    for (let i = 83; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        keys.push(isoKey(d));
    }
    return keys;
}

export function shortDayLabel(isoDate: string): string {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const d = new Date(isoDate + "T12:00:00");
    return days[d.getDay()] ?? isoDate;
}

export function calcStreak(db: StatsDB): number {
    const today = todayKey();
    const d = new Date();
    // If today has no messages yet, start from yesterday
    if (!db[today]?.messages) d.setDate(d.getDate() - 1);
    let streak = 0;
    while (true) {
        const key = isoKey(d);
        if (!db[key]?.messages) break;
        streak++;
        d.setDate(d.getDate() - 1);
    }
    return streak;
}

export function calcRecords(db: StatsDB): Records {
    let bestDayCount = 0;
    let bestDayDate = "";
    let longestVoiceMs = 0;
    for (const [date, day] of Object.entries(db)) {
        if (day.messages > bestDayCount) { bestDayCount = day.messages; bestDayDate = date; }
        if (day.voiceMs > longestVoiceMs) longestVoiceMs = day.voiceMs;
    }
    return { bestDayCount, bestDayDate, longestVoiceMs };
}

export function getActivityProfile(hours: number[]): ActivityProfile {
    const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
    const morning = sum(hours.slice(6, 12));
    const afternoon = sum(hours.slice(12, 18));
    const evening = sum(hours.slice(18, 22));
    const night = sum([...hours.slice(22), ...hours.slice(0, 6)]);
    const max = Math.max(morning, afternoon, evening, night);
    if (max === 0) return { en: "No data yet", ar: "لا توجد بيانات بعد", icon: "❓" };
    if (max === morning) return { en: "Early Bird", ar: "باكر النهار", icon: "🌅" };
    if (max === afternoon) return { en: "Midday Peak", ar: "منتصف اليوم", icon: "☀️" };
    if (max === evening) return { en: "Evening Person", ar: "شخص مسائي", icon: "🌆" };
    return { en: "Night Owl", ar: "بومة ليلية", icon: "🦉" };
}

export function pctChange(curr: number, prev: number): number | null {
    if (prev === 0) return null;
    return Math.round(((curr - prev) / prev) * 100);
}
