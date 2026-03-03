// src/scanner/cli.ts
import { createLogger } from "./logger";

import { runScanCommand } from "./commands/scan";
import { runGenerateCommand } from "./commands/generate";
import { runValidateCommand } from "./commands/validate";
import { runRepairCommand } from "./commands/repair";
import { runDoctorCommand } from "./commands/doctor";
import { normalizeArgv } from "./commands/argv";

type CommandName = "scan" | "generate" | "validate" | "repair" | "doctor" | "help";

function usage() {
    return `
scanner CLI

Usage:
  node -r ts-node/register src/scanner/cli.ts <command> [options]

Commands:
  scan       Scan a page via CDP and write page-map json
  generate   Generate elements/aliases/pages from page-maps
  validate   Validate generated outputs
  repair     Repair common issues
  doctor     Diagnose environment & config

Examples:
  npm run scanner -- scan --connectCdp "$CDP" --pageKey motor.car-details --merge --verbose
  npm run scanner -- generate --merge --changedOnly
`.trim();
}

function isCommand(x: string | undefined): x is CommandName {
    return x === "scan" || x === "generate" || x === "validate" || x === "repair" || x === "doctor" || x === "help";
}

async function main() {
    // normalize EARLY
    const argv = normalizeArgv(process.argv.slice(2));
    const cmd = argv[0];

    if (!isCommand(cmd)) {
        const log = createLogger({ prefix: "[scanner]", verbose: true, withTimestamp: true });
        log.error(`Unknown or missing command: ${cmd ?? "(none)"}`);
        log.info(usage());
        process.exit(1);
    }

    const args = argv.slice(1);

    switch (cmd) {
        case "help":
            console.log(usage());
            return;

        case "scan":
            await runScanCommand(args);
            return;

        case "generate":
            await runGenerateCommand(args);
            return;

        case "validate":
            await runValidateCommand(args);
            return;

        case "repair":
            await runRepairCommand(args);
            return;

        case "doctor":
            await runDoctorCommand(args);
            return;
    }
}

main().catch((e) => {
    const log = createLogger({ prefix: "[scanner]", verbose: true, withTimestamp: true });
    log.error(e?.message || String(e));
    process.exit(1);
});