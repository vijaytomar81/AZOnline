// src/scanner/cli.ts

import path from "node:path";
import { createLogger } from "./logger";
import { scanPage } from "./scanPage";

function getArg(name: string): string | null {
    const argv = process.argv.slice(2);

    const i = argv.indexOf(name);
    if (i >= 0) return argv[i + 1] ?? null;

    const eq = argv.find((a) => a.startsWith(`${name}=`));
    if (eq) return eq.split("=").slice(1).join("=");

    return null;
}

function hasFlag(name: string): boolean {
    return process.argv.slice(2).includes(name);
}

async function main() {
    const connectCdp = getArg("--connectCdp");
    if (!connectCdp) {
        throw new Error(
            "Missing --connectCdp. Example: --connectCdp http://localhost:9222"
        );
    }

    const pageKey = getArg("--pageKey");
    if (!pageKey) {
        throw new Error(
            "Missing --pageKey. Example: --pageKey common.auth-entry"
        );
    }

    const tabUrlRegex = getArg("--tabUrlRegex") ?? undefined;
    const outDir =
        getArg("--outDir") ?? path.join(process.cwd(), "src", "page-maps");

    const merge = hasFlag("--merge");
    const verbose = hasFlag("--verbose");

    const log = createLogger({
        prefix: "[scanner]",
        verbose,
        withTimestamp: true,
    });

    log.info("Starting scanner...");
    await scanPage({
        connectCdp,
        pageKey,
        tabUrlRegex,
        outDir,
        merge,
        verbose,
    });
}

main().catch((e) => {
    const log = createLogger({
        prefix: "[scanner]",
        verbose: true,
        withTimestamp: true,
    });
    log.error(e?.message || String(e));
    process.exit(1);
});