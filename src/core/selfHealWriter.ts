// src/core/selfHealWriter.ts
import fs from "node:fs";
import path from "node:path";

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
    pageMapsDir?: string;     // default: src/page-maps
    prefix?: string;          // log prefix
    enabled?: boolean;        // default false (enterprise safety)
};

function nowIso() {
    return new Date().toISOString();
}

function log(prefix: string, msg: string) {
    // eslint-disable-next-line no-console
    console.log(`${nowIso()} ${prefix} ${msg}`);
}

export class SelfHealWriter {
    private dir: string;
    private enabled: boolean;
    private prefix: string;

    constructor(opts: SelfHealWriterOptions = {}) {
        this.dir = opts.pageMapsDir ?? path.join(process.cwd(), "src", "page-maps");
        this.enabled = !!opts.enabled;
        this.prefix = opts.prefix ?? "[self-heal]";
    }

    apply(event: HealEvent) {
        if (!this.enabled) return;

        const file = path.join(this.dir, `${event.pageKey}.json`);
        if (!fs.existsSync(file)) {
            log(this.prefix, `WARN: page-map not found, cannot heal: ${file}`);
            return;
        }

        const raw = fs.readFileSync(file, "utf8");
        const map = JSON.parse(raw) as PageMap;

        const el = map.elements?.[event.elementKey];
        if (!el) {
            log(this.prefix, `WARN: elementKey not found, cannot heal: ${event.elementKey}`);
            return;
        }

        // If preferred already equals the healed selector, nothing to do.
        if (el.preferred === event.preferredNow) return;

        // Promote new preferred; keep old preferred inside fallbacks (if not already there)
        const nextFallbacks = Array.from(
            new Set([event.preferredWas, ...(el.fallbacks ?? [])].filter(Boolean).filter((s) => s !== event.preferredNow))
        );

        el.preferred = event.preferredNow;
        el.fallbacks = nextFallbacks;

        fs.writeFileSync(file, JSON.stringify(map, null, 2), "utf8");
        log(this.prefix, `Healed ${event.pageKey}.${event.elementKey}: preferred updated`);
    }
}