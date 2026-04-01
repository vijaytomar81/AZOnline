// src/automation/engine/types.ts

import type { Page } from "@playwright/test";

export type ElementDef = {
    type: string;
    preferred: string;
    fallbacks: readonly string[];
};

export type LocatorEngineOptions = {
    timeoutMs?: number;
    verbose?: boolean;
    selfHeal?: boolean;
    prefix?: string;
    onHealed?: (info: {
        preferredWas: string;
        preferredNow: string;
    }) => void;
};

export type ResolveKeyResult = {
    locator: ReturnType<Page["locator"]>;
    used: string;
    pageKey: string;
    elementKey: string;
};

export type HealEvent = {
    pageKey: string;
    elementKey: string;
    preferredWas: string;
    preferredNow: string;
};

export type SelfHealWriterOptions = {
    pageMapsDir?: string;
    prefix?: string;
    enabled?: boolean;
};

export type BasePageOptions = {
    verboseEngine?: boolean;
    selfHeal?: boolean;
    actionTimeoutMs?: number;
};

export type AliasMap = Record<string, string>;