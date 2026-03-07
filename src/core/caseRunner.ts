// src/core/caseRunner.ts
import type { Page } from "@playwright/test";
import { PageManager } from "../pages";
import type { HealEvent } from "./selfHealWriter";

export type FlowFn = (args: {
    page: Page;
    pages: PageManager;
    data: Record<string, any>;
    scriptName: string;
}) => Promise<void>;

function getHealEventsFromPageManager(pages: PageManager): HealEvent[] {
    const cache = (pages as any)?.cache;

    if (!(cache instanceof Map)) {
        return [];
    }

    const events: HealEvent[] = [];

    for (const pageObj of cache.values()) {
        if (
            pageObj &&
            typeof pageObj.getSelfHealEvents === "function"
        ) {
            const pageEvents = pageObj.getSelfHealEvents();
            if (Array.isArray(pageEvents)) {
                events.push(...pageEvents);
            }
        }
    }

    return events;
}

function clearHealEventsFromPageManager(pages: PageManager) {
    const cache = (pages as any)?.cache;

    if (!(cache instanceof Map)) {
        return;
    }

    for (const pageObj of cache.values()) {
        if (
            pageObj &&
            typeof pageObj.clearSelfHealEvents === "function"
        ) {
            pageObj.clearSelfHealEvents();
        }
    }
}

function printSelfHealReport(events: HealEvent[]) {
    if (events.length === 0) {
        return;
    }

    console.log("");
    console.log("SELF HEAL REPORT");
    console.log("----------------");

    for (const event of events) {
        console.log(`${event.pageKey}.${event.elementKey}`);
        console.log(`  preferred was : ${event.preferredWas}`);
        console.log(`  preferred now : ${event.preferredNow}`);
        console.log("");
    }
}

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

    const healEvents = getHealEventsFromPageManager(pages);
    printSelfHealReport(healEvents);
    clearHealEventsFromPageManager(pages);
}