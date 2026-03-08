// src/core/selfHealWriter.ts
import fs from "node:fs";
import path from "node:path";

import { createLogger, type Logger } from "../utils/logger";
import { PAGE_SCANNER_MAPS_DIR } from "../utils/paths";

type PageMap = {
    pageKey: string;
    elements: Record<
        string,
        {
            type: string;
            preferred: string;
            fallbacks: string[];
            meta?: Record<string, any>;
        }
    >;
};

export type HealEvent = {
    pageKey: string;     // e.g. "motor.car-details"
    elementKey: string;  // e.g. "claimDateMonth2"
    preferredWas: string;
    preferredNow: string;
};

export type SelfHealWriterOptions = {
    pageMapsDir?: string;
    prefix?: string;
    enabled?: boolean; // default false
};

export class SelfHealWriter {
    private dir: string;
    private enabled: boolean;
    private prefix: string;
    private log: Logger;
    private events: HealEvent[] = [];

    constructor(opts: SelfHealWriterOptions = {}) {
        this.dir = opts.pageMapsDir ?? PAGE_SCANNER_MAPS_DIR;
        this.enabled = !!opts.enabled;
        this.prefix = opts.prefix ?? "[self-heal]";

        this.log = createLogger({
            prefix: this.prefix,
            logLevel: "info",
            withTimestamp: true,
            logToFile: false,
        });
    }

    getEvents(): HealEvent[] {
        return [...this.events];
    }

    clearEvents() {
        this.events = [];
    }

    apply(event: HealEvent) {
        if (!this.enabled) return;

        const file = path.join(this.dir, `${event.pageKey}.json`);

        if (!fs.existsSync(file)) {
            this.log.warn(`page-map not found, cannot heal: ${file}`);
            return;
        }

        const raw = fs.readFileSync(file, "utf8");
        const map = JSON.parse(raw) as PageMap;

        const el = map.elements?.[event.elementKey];

        if (!el) {
            this.log.warn(`elementKey not found, cannot heal: ${event.elementKey}`);
            return;
        }

        // If preferred already equals the healed selector, nothing to do.
        if (el.preferred === event.preferredNow) return;

        const nextFallbacks = Array.from(
            new Set(
                [event.preferredWas, ...(el.fallbacks ?? [])]
                    .filter(Boolean)
                    .filter((s) => s !== event.preferredNow)
            )
        );

        el.preferred = event.preferredNow;
        el.fallbacks = nextFallbacks;

        fs.writeFileSync(file, JSON.stringify(map, null, 2), "utf8");

        this.events.push(event);

        this.log.info(
            `Healed ${event.pageKey}.${event.elementKey}: preferred updated`
        );
    }
}