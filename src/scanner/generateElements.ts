// src/scanner/generateElements.ts

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

import { createLogger } from "./logger";

type PageMap = {
    pageKey: string;
    elements: Record<
        string,
        {
            type: string;
            preferred: string;
            fallbacks: string[];
        }
    >;
};

type GenOptions = {
    mapsDir: string;
    pagesDir: string;
    merge?: boolean;
    verbose?: boolean;
    changedOnly?: boolean;
    stateOnly?: boolean;
    log: ReturnType<typeof createLogger>;
};

type StateFile = Record<string, string>; // mapFile -> hash

// ---------------------------------------------------
// helpers
// ---------------------------------------------------

function safeReadJson<T>(file: string): T | null {
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

function safeWriteText(file: string, content: string) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content, "utf8");
}

function hashContent(content: string): string {
    return crypto.createHash("sha1").update(content).digest("hex");
}

function toPascal(s: string) {
    return s
        .replace(/[-_.]/g, " ")
        .split(" ")
        .filter(Boolean)
        .map((p) => p[0].toUpperCase() + p.slice(1))
        .join("");
}

function mapPageKeyToElementsPath(pagesDir: string, pageKey: string) {
    // example: motor.car-details
    const parts = pageKey.split(".");
    const folder = path.join(pagesDir, ...parts);
    return path.join(folder, "elements.ts");
}

function buildTs(pageMap: PageMap): string {
    const lines: string[] = [];

    lines.push(`// AUTO-GENERATED FILE — DO NOT EDIT`);
    lines.push(`// pageKey: ${pageMap.pageKey}`);
    lines.push(``);
    lines.push(`export const elements = {`);

    for (const [key, v] of Object.entries(pageMap.elements)) {
        lines.push(`  ${key}: {`);
        lines.push(`    type: "${v.type}",`);
        lines.push(`    preferred: "${v.preferred}",`);

        if (v.fallbacks?.length) {
            lines.push(`    fallbacks: [`);
            for (const f of v.fallbacks) {
                lines.push(`      "${f}",`);
            }
            lines.push(`    ],`);
        } else {
            lines.push(`    fallbacks: [],`);
        }

        lines.push(`  },`);
    }

    lines.push(`} as const;`);
    lines.push(``);
    lines.push(`export type ElementsMap = typeof elements;`);

    return lines.join("\n");
}

// ---------------------------------------------------
// main
// ---------------------------------------------------

async function generateElements(opts: GenOptions) {
    const log = opts.log;

    const stateFilePath = path.join(opts.mapsDir, ".page-maps-state.json");
    const oldState: StateFile = safeReadJson<StateFile>(stateFilePath) ?? {};
    const newState: StateFile = {};

    const mapFiles = fs
        .readdirSync(opts.mapsDir)
        .filter((f) => f.endsWith(".json"));

    log.info(`Found ${mapFiles.length} page-map(s).`);

    let processed = 0;

    for (const file of mapFiles) {
        const abs = path.join(opts.mapsDir, file);
        const raw = fs.readFileSync(abs, "utf8");

        const hash = hashContent(raw);
        newState[file] = hash;

        const oldHash = oldState[file];
        const changed = oldHash !== hash;

        if (opts.changedOnly && !changed) {
            if (opts.verbose) {
                log.debug(`UNCHANGED → skipping ${file}`);
            }
            continue;
        }

        const pageMap = JSON.parse(raw) as PageMap;

        const outPath = mapPageKeyToElementsPath(opts.pagesDir, pageMap.pageKey);

        if (opts.stateOnly) {
            log.info(`STATE-ONLY → skipping write for ${pageMap.pageKey}`);
            processed++;
            continue;
        }

        const ts = buildTs(pageMap);

        if (opts.merge && fs.existsSync(outPath)) {
            log.info(`Merging (overwrite-safe): ${outPath}`);
        } else {
            log.info(`Writing: ${outPath}`);
        }

        safeWriteText(outPath, ts);
        processed++;
    }

    // always update state file
    safeWriteText(stateFilePath, JSON.stringify(newState, null, 2));

    log.info(`State file updated: ${stateFilePath}`);
    log.info(`Processed pages: ${processed}`);
}

// ---------------------------------------------------
// CLI
// ---------------------------------------------------

function hasFlag(name: string) {
    return process.argv.includes(name);
}

(async () => {
    const log = createLogger({
        prefix: "[scanner]",
        verbose: hasFlag("--verbose"),
    });

    const mapsDir = path.join(process.cwd(), "src", "page-maps");
    const pagesDir = path.join(process.cwd(), "src", "pages");

    const opts: GenOptions = {
        mapsDir,
        pagesDir,
        merge: hasFlag("--merge"),
        verbose: hasFlag("--verbose"),
        changedOnly: hasFlag("--changedOnly"),
        stateOnly: hasFlag("--stateOnly"),
        log,
    };

    try {
        log.info("Generating elements from page-maps...");
        await generateElements(opts);
        log.info("Done ✅");
    } catch (e: any) {
        log.error(e?.message || String(e));
        process.exit(1);
    }
})();