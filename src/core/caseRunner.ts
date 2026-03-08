// src/core/caseRunner.ts
import type { Page } from "@playwright/test";

import { PageManager } from "../pages";
import { createLogger } from "../utils/logger";
import {
    printSection,
    printStatus,
    printIndented,
    printSummary,
    success,
    strong,
} from "../utils/cliFormat";

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

    printSection("Self Heal Report");

    for (const event of events) {
        printStatus("➕", `${event.pageKey}.${event.elementKey}`);
        printIndented("preferred was", event.preferredWas);
        printIndented("preferred now", event.preferredNow);
        console.log("");
    }

    printSummary("SELF HEAL SUMMARY", [
        ["Healed items", events.length],
    ]);

    console.log(`${strong("Result".padEnd(20, " "))}: ${success("RECORDED")}`);
}

function createCaseRunnerLogger(scriptName: string) {
    return createLogger({
        prefix: `[case-runner${scriptName ? `:${scriptName}` : ""}]`,
        logLevel: "info",
        withTimestamp: true,
        logToFile: false,
    });
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
    const log = createCaseRunnerLogger(opts.scriptName);
    const pages = new PageManager(opts.page);

    log.info("Starting flow execution");

    await opts.flow({
        page: opts.page,
        pages,
        data: opts.payload,
        scriptName: opts.scriptName,
    });

    log.info("Flow execution completed");

    const healEvents = getHealEventsFromPageManager(pages);

    if (healEvents.length > 0) {
        log.info(`Self-heal events found: ${healEvents.length}`);
    }

    printSelfHealReport(healEvents);
    clearHealEventsFromPageManager(pages);
}