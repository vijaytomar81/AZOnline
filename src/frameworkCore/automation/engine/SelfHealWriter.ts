// src/frameworkCore/automation/engine/SelfHealWriter.ts

import fs from "node:fs";
import path from "node:path";
import { createLogger } from "@utils/logger";
import type { Logger } from "@utils/logger";
import { PAGE_MAPS_DIR } from "@utils/paths";
import type { HealEvent, SelfHealWriterOptions } from "./types";

type WritablePageMap = {
    pageKey: string;
    elements: Record<
        string,
        {
            type: string;
            preferred: string;
            fallbacks: string[];
            meta?: Record<string, unknown>;
        }
    >;
};

export class SelfHealWriter {
    private readonly dir: string;
    private readonly enabled: boolean;
    private readonly log: Logger;
    private events: HealEvent[] = [];

    constructor(opts: SelfHealWriterOptions = {}) {
        this.dir = opts.pageMapsDir ?? PAGE_MAPS_DIR;
        this.enabled = !!opts.enabled;

        this.log = createLogger({
            prefix: opts.prefix ?? "[self-heal]",
            logLevel: "info",
            withTimestamp: true,
            logToFile: false,
        });
    }

    getEvents(): HealEvent[] {
        return [...this.events];
    }

    clearEvents(): void {
        this.events = [];
    }

    apply(event: HealEvent): void {
        if (!this.enabled) {
            return;
        }

        const filePath = path.join(this.dir, `${event.pageKey}.json`);

        if (!fs.existsSync(filePath)) {
            this.log.warn(`page-map not found, cannot heal: ${filePath}`);
            return;
        }

        const raw = fs.readFileSync(filePath, "utf8");
        const pageMap = JSON.parse(raw) as WritablePageMap;
        const element = pageMap.elements?.[event.elementKey];

        if (!element) {
            this.log.warn(
                `elementKey not found, cannot heal: ${event.elementKey}`
            );
            return;
        }

        if (element.preferred === event.preferredNow) {
            return;
        }

        const nextFallbacks = Array.from(
            new Set(
                [event.preferredWas, ...(element.fallbacks ?? [])]
                    .filter(Boolean)
                    .filter((selector) => selector !== event.preferredNow)
            )
        );

        element.preferred = event.preferredNow;
        element.fallbacks = nextFallbacks;

        fs.writeFileSync(filePath, JSON.stringify(pageMap, null, 2), "utf8");

        this.events.push(event);
        this.log.info(
            `Healed ${event.pageKey}.${event.elementKey}: preferred updated`
        );
    }
}