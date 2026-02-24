// src/scanner/cli.ts
import path from "node:path";
import { scanPage } from "./scanPage";
import { createLogger } from "./logger";

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
    const pageKey = getArg("--pageKey");
    const url = getArg("--url");

    const outDir = getArg("--outDir") ?? path.join("src", "page-maps");
    const headless = (getArg("--headless") ?? "true").toLowerCase() !== "false";

    const verbose = hasFlag("--verbose");
    const withTimestamp = (getArg("--withTimestamp") ?? "true").toLowerCase() !== "false";

    const log = createLogger({
        prefix: "[scanner]",
        verbose,
        withTimestamp, // ✅ default TRUE, can disable via --withTimestamp=false
    });

    if (!pageKey) throw new Error("Missing --pageKey. Example: --pageKey common.authEntry");
    if (!url) throw new Error("Missing --url. Example: --url /");

    await scanPage({ pageKey, url, outDir, headless, log });
}

main().catch((e) => {
    const msg = e?.message || String(e);
    // keep this in the same style even on hard failure
    const log = createLogger({ prefix: "[scanner]", verbose: true, withTimestamp: true });
    log.error(msg);
    process.exit(1);
});