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
Scanner CLI

Usage:
  npm run scanner -- <command> [options]
  node -r ts-node/register src/scanner/cli.ts <command> [options]

Commands:
  scan       Scan a page via CDP and write a page-map JSON
  generate   Generate elements/aliases/page objects from page-maps
  validate   Validate generated outputs
  repair     Recreate missing outputs / resync page objects
  doctor     Diagnose environment & config
  help       Show this help

------------------------------------------------------------
scan

Usage:
  npm run scanner -- scan --connectCdp <wsUrl> --pageKey <key> [options]

Required:
  --connectCdp <wsUrl>   CDP websocket URL
                         (example: ws://localhost:9222/devtools/browser/<id>)
  --pageKey <key>        Page key used as filename and folder mapping
                         (example: motor.car-details)

Optional:
  --outDir <path>        Output folder for page-maps
                         (default: src/page-maps)
  --tabIndex <n>         Which browser tab to scan (0-based)
                         (default: 0)
  --merge                Merge into existing <pageKey>.json (keeps keys stable)
                         (default: false)
  --verbose              Extra logs
  --logToFile            Write logs to file too
  --logFilePath <path>   Log file path
                         (default: scanner.log)
  --help, -h             Show scan help

Examples:
  # Mac/Linux
  npm run scanner -- scan --connectCdp "$CDP" --pageKey motor.car-details --merge --verbose

  # Windows PowerShell
  npm run scanner -- scan --connectCdp "$CDP" --pageKey motor.car-details --merge --verbose

------------------------------------------------------------
generate

Usage:
  npm run scanner -- generate [options]

Optional:
  --mapsDir <path>       Page-maps directory
                         (default: src/page-maps)
  --pagesDir <path>      Pages output directory
                         (default: src/pages)
  --stateDir <path>      State directory (hash cache)
                         (default: src/.scanner-state)
  --stateFile <path>     State file path
                         (default: <stateDir>/page-maps-state.json)

  --merge                Overwrite-safe generation (normal mode)
  --changedOnly          Only process page-maps whose JSON changed
                         (still repairs missing outputs & resyncs if needed)
  --stateOnly            Only update state hashes (no elements.ts writes)
  --noScaffold           Do not create create-only files (aliases.ts / Page.ts stubs)
  --verbose
  --help, -h

Examples:
  npm run scanner -- generate --merge
  npm run scanner -- generate --merge --verbose
  npm run scanner -- generate --changedOnly --merge --verbose
  npm run scanner -- generate --stateOnly --verbose

------------------------------------------------------------
validate

Usage:
  npm run scanner -- validate [options]

Optional:
  --mapsDir <path>       (default: src/page-maps)
  --pagesDir <path>      (default: src/pages)
  --noIndexHygiene       Skip src/pages index/pageManager hygiene checks
  --strict               Fail if warnings exist
  --verbose
  --help, -h

Examples:
  npm run scanner -- validate
  npm run scanner -- validate --verbose
  npm run scanner -- validate --strict

------------------------------------------------------------
repair

Usage:
  npm run scanner -- repair [options]

What it does:
  - Recreates missing outputs for pages (aliases.ts, aliases.generated.ts, Page.ts, etc.)
  - Re-syncs Page object methods from aliases.ts when needed

Optional:
  --mapsDir <path>       (default: src/page-maps)
  --pagesDir <path>      (default: src/pages)
  --stateDir <path>      (default: src/.scanner-state)
  --stateFile <path>     (default: <stateDir>/page-maps-state.json)

  --changedOnly          Only repair changed page-maps BUT still recreates missing outputs
  --noScaffold           Do not scaffold create-only files
  --stateOnly            Only update state hashes
  --merge                (informational; forwarded)
  --verbose
  --help, -h

Examples:
  npm run scanner -- repair --verbose
  npm run scanner -- repair --changedOnly --verbose

------------------------------------------------------------
doctor

Usage:
  npm run scanner -- doctor [options]

Optional:
  --mapsDir <path>       (default: src/page-maps)
  --pagesDir <path>      (default: src/pages)
  --stateDir <path>      (default: src/.scanner-state)
  --stateFile <path>     (default: <stateDir>/page-maps-state.json)
  --verbose
  --help, -h

Examples:
  npm run scanner -- doctor
  npm run scanner -- doctor --verbose

------------------------------------------------------------
Notes

- Prefer "npm run scanner -- <command> ..." because npm sometimes injects extra "--".
- validate checks:
  - page-map ↔ elements.ts keys
  - page-map ↔ aliases.generated.ts keys + pageMeta
  - aliases.ts RHS points to valid ElementKey
  - aliases.ts keys are used in Page object (and vice-versa)
  - pages index hygiene (unless --noIndexHygiene)

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