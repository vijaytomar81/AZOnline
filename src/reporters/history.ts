// src/reporters/history.ts

import fs from "node:fs";
import path from "node:path";

import type { RunSummary, StatusTrendPoint } from "./schema";

function ensureDir(dirPath: string) {
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function safeReadJson<T>(filePath: string): T | null {
    try {
        if (!fs.existsSync(filePath)) return null;
        const raw = fs.readFileSync(filePath, "utf8");
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

function safeWriteJson(filePath: string, data: unknown) {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function toDateIso(iso: string): string {
    // "2026-03-04T13:38:56.701Z" -> "2026-03-04"
    // If it's already a date-like string, keep first 10 chars safely.
    if (!iso) return new Date().toISOString().slice(0, 10);
    return iso.slice(0, 10);
}

function clampKeepLast(n: number | undefined, fallback = 30) {
    const v = typeof n === "number" ? n : Number(n);
    if (!Number.isFinite(v) || v <= 0) return fallback;
    return Math.floor(v);
}

function normalizeTrendArray(x: unknown): StatusTrendPoint[] {
    if (!Array.isArray(x)) return [];
    return x
        .map((p) => p as Partial<StatusTrendPoint>)
        .filter((p) => typeof p?.dateIso === "string" && p.dateIso.length >= 10)
        .map((p) => ({
            dateIso: String(p.dateIso).slice(0, 10),
            total: Number(p.total ?? 0) || 0,
            passed: Number(p.passed ?? 0) || 0,
            failed: Number(p.failed ?? 0) || 0,
            flaky: Number(p.flaky ?? 0) || 0,
            skipped: Number(p.skipped ?? 0) || 0,
            passRate: Number(p.passRate ?? 0) || 0,
        }));
}

/**
 * Upserts a single trend point (1 per day) into history.json and returns the trend array.
 *
 * Notes:
 * - keepLast means "keep last N points" (your buildDashboard passes keepHistoryDays here).
 * - We key trend by dateIso (YYYY-MM-DD). Re-runs on the same day will overwrite that day.
 */
export function upsertTrendPoint(params: {
    historyPath: string;
    summary: RunSummary;
    keepLast?: number;
}): StatusTrendPoint[] {
    const { historyPath, summary } = params;
    const keepLast = clampKeepLast(params.keepLast, 30);

    const existing = safeReadJson<unknown>(historyPath);
    const trend = normalizeTrendArray(existing);

    const dateIso = toDateIso(summary.startedAtIso || summary.endedAtIso);

    const point: StatusTrendPoint = {
        dateIso,
        total: summary.total,
        passed: summary.passed,
        failed: summary.failed,
        flaky: summary.flaky,
        skipped: summary.skipped,
        passRate: summary.passRate,
    };

    const idx = trend.findIndex((p) => p.dateIso === dateIso);
    if (idx >= 0) {
        trend[idx] = point;
    } else {
        trend.push(point);
    }

    // sort by date ascending (lex order works for YYYY-MM-DD)
    trend.sort((a, b) => a.dateIso.localeCompare(b.dateIso));

    // keep last N
    const trimmed =
        trend.length > keepLast ? trend.slice(trend.length - keepLast) : trend;

    safeWriteJson(historyPath, trimmed);

    return trimmed;
}