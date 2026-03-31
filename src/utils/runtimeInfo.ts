// src/utils/runtimeInfo.ts

import os from "node:os";

/**
 * =========================
 * System Info
 * =========================
 */
export type SystemInfo = {
    machineName: string;
    user: string;
    platform: string;
    osVersion: string;
};

/**
 * =========================
 * Browser Info (injected)
 * =========================
 */
export type RuntimeBrowserInfo = {
    name: string;
    channel?: string;
    version?: string;
    headless: boolean;
};

/**
 * =========================
 * Runtime Info (EXTENSIBLE)
 * =========================
 */
export type RuntimeInfo = {
    system: SystemInfo;
    browser?: RuntimeBrowserInfo;

    // 🔥 future-ready (no breaking changes later)
    ci?: {
        provider?: string;
        buildId?: string;
        pipeline?: string;
    };

    git?: {
        branch?: string;
        commit?: string;
    };
};

/**
 * =========================
 * Collect System Info
 * =========================
 */
export function getSystemInfo(): SystemInfo {
    return {
        machineName: os.hostname(),
        user: os.userInfo().username,
        platform: os.platform(),
        osVersion: os.release(),
    };
}

/**
 * =========================
 * Create Runtime Info
 * =========================
 */
export function createRuntimeInfo(input?: {
    browser?: RuntimeBrowserInfo;
}): RuntimeInfo {
    return {
        system: getSystemInfo(),
        browser: input?.browser,
    };
}