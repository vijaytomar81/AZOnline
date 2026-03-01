import path from "node:path";
import { createLogger } from "../logger";
import { scanPage } from "../page-scanner/runner";

function getArg(name: string): string | undefined {
    const argv = process.argv.slice(3); // 👈 IMPORTANT (skip command name)

    const i = argv.indexOf(name);
    if (i >= 0) return argv[i + 1];

    const eq = argv.find((a) => a.startsWith(`${name}=`));
    if (eq) return eq.split("=").slice(1).join("=");

    return undefined;
}

function hasFlag(name: string): boolean {
    return process.argv.slice(3).includes(name);
}

function required(name: string, value: string | undefined): string {
    if (!value) throw new Error(`${name} is required.`);
    return value;
}

export async function runScanCommand() {
    const connectCdp = required("--connectCdp", getArg("--connectCdp"));
    const pageKey = required("--pageKey", getArg("--pageKey"));

    const outDir =
        getArg("--outDir") ?? path.join(process.cwd(), "src", "page-maps");

    const tabIndexRaw = getArg("--tabIndex");
    const tabIndex = tabIndexRaw ? Number(tabIndexRaw) : 0;

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
        outDir,
        merge,
        tabIndex,
        verbose,
        log,
    });

    log.info("Done ✅");
}