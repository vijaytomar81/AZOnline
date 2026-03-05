// src/page-elements-validator/commands/doctor.ts

import fs from "node:fs";
import path from "node:path";
import { createLogger } from "../logger";

// ✅ validator CLI owns argv parsing (no ./argv file)
function normalizeArgv(argv: string[]): string[] {
    return argv.filter((a) => a !== "--");
}

function hasFlag(argv: string[], name: string): boolean {
    return normalizeArgv(argv).includes(name);
}

function getArg(argv: string[], name: string): string | undefined {
    const args = normalizeArgv(argv);

    const i = args.indexOf(name);
    if (i >= 0) {
        const v = args[i + 1];
        if (!v || v.startsWith("--")) return undefined;
        return v;
    }

    const eq = args.find((a) => a.startsWith(`${name}=`));
    if (eq) return eq.split("=").slice(1).join("=");

    return undefined;
}

function exists(p: string) {
    return fs.existsSync(p);
}

function canWrite(dir: string) {
    try {
        fs.accessSync(dir, fs.constants.W_OK);
        return true;
    } catch {
        return false;
    }
}

export async function runDoctorCommand(args: string[]) {
    const verbose = hasFlag(args, "--verbose");
    const log = createLogger({ prefix: "[validator]", verbose, withTimestamp: true });

    const mapsDir =
        getArg(args, "--mapsDir") ??
        path.join(process.cwd(), "src", "tools", "page-scanner", "page-maps");

    const pagesDir =
        getArg(args, "--pagesDir") ?? path.join(process.cwd(), "src", "pages");

    const stateDir =
        getArg(args, "--stateDir") ??
        path.join(process.cwd(), "src", "tools", "page-elements-generator", ".state");

    const stateFile =
        getArg(args, "--stateFile") ?? path.join(stateDir, "page-maps-state.json");

    log.info("Command: doctor");
    log.info(`Node: ${process.version}`);
    log.info(`cwd: ${process.cwd()}`);

    const checks: Array<{ name: string; ok: boolean; detail: string }> = [];

    checks.push({ name: "mapsDir exists", ok: exists(mapsDir), detail: mapsDir });
    checks.push({ name: "pagesDir exists", ok: exists(pagesDir), detail: pagesDir });
    checks.push({ name: "stateDir exists", ok: exists(stateDir), detail: stateDir });
    checks.push({ name: "stateFile exists", ok: exists(stateFile), detail: stateFile });

    if (exists(mapsDir)) checks.push({ name: "mapsDir writable", ok: canWrite(mapsDir), detail: mapsDir });
    if (exists(pagesDir)) checks.push({ name: "pagesDir writable", ok: canWrite(pagesDir), detail: pagesDir });
    if (exists(stateDir)) checks.push({ name: "stateDir writable", ok: canWrite(stateDir), detail: stateDir });

    // quick page-maps count
    if (exists(mapsDir)) {
        const maps = fs.readdirSync(mapsDir).filter((f) => f.endsWith(".json") && !f.startsWith("."));
        checks.push({ name: "page-maps found", ok: maps.length > 0, detail: `${maps.length} file(s)` });
    }

    for (const c of checks) {
        log.info(`${c.ok ? "✅" : "❌"} ${c.name}: ${c.detail}`);
    }

    const failed = checks.filter((c) => !c.ok);

    if (failed.length === 0) {
        log.info("Doctor summary: looks healthy ✅");
        log.info(`Next: npm run gen:elements:changed:verbose (or run the generator CLI directly)`);
        return;
    }

    log.info("Doctor summary: issues found ❌");
    log.info("Suggested actions:");

    for (const f of failed) {
        if (f.name === "mapsDir exists") log.info(`- Create: mkdir -p ${mapsDir}`);
        if (f.name === "pagesDir exists") log.info(`- Create: mkdir -p ${pagesDir}`);
        if (f.name === "stateDir exists") log.info(`- Create: mkdir -p ${stateDir}`);

        if (f.name === "stateFile exists") {
            log.info(
                `- Run generator state-only to create state file: node -r ts-node/register src/page-elements-generator/cli.ts generate --stateOnly --verbose`
            );
        }

        if (f.name === "page-maps found") {
            log.info(
                `- Run a scan first: node -r ts-node/register src/page-scanner/cli.ts scan --connectCdp "$CDP" --pageKey <key> --merge`
            );
        }

        if (f.name.endsWith("writable")) {
            log.info(`- Fix permissions for: ${f.detail}`);
        }
    }

    // non-zero exit for CI friendliness
    process.exitCode = 2;
}