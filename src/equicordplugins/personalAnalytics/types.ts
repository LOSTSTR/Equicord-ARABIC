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

export function getLast7DayKeys(): string[] {
    const keys: string[] = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        keys.push(d.toISOString().slice(0, 10));
    }
    return keys;
}

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

export function shortDayLabel(isoDate: string): string {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const d = new Date(isoDate + "T12:00:00");
    return days[d.getDay()] ?? isoDate;
}
