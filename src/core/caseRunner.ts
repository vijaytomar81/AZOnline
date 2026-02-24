// src/core/caseRunner.ts
import type { Page } from "@playwright/test";
import { PageManager } from "../pages";

export type FlowFn = (args: {
    page: Page;
    pages: PageManager;
    data: Record<string, any>;
    scriptName: string;
}) => Promise<void>;

/**
 * Runs a flow with provided case payload.
 */
export async function runFlowForCase(opts: {
    page: Page;
    scriptName: string;
    payload: Record<string, any>;
    flow: FlowFn;
}) {
    const pages = new PageManager(opts.page);

    await opts.flow({
        page: opts.page,
        pages,
        data: opts.payload,
        scriptName: opts.scriptName,
    });
}