// src/tools/page-scanner/cli.ts

import { createLogger } from "../../utils/logger";
import { runScanCommand } from "./commands/scan";
import { normalizeArgv } from "../../utils/argv";
import { usage } from "./scannerHelp";

type CommandName = "scan" | "help";

function isCommand(x: string | undefined): x is CommandName {
    return x === "scan" || x === "help";
}

const log = createLogger({
    prefix: "[page-scanner]",
    verbose: true,
    withTimestamp: true,
});

async function main() {
    const argv = normalizeArgv(process.argv.slice(2));
    const cmd = argv[0];

    if (!isCommand(cmd)) {
        log.error(`Unknown or missing command: ${cmd ?? "(none)"}`);
        log.info(usage());
        process.exit(1);
    }

    const args = argv.slice(1);

    switch (cmd) {
        case "help":
            log.info(usage());
            return;

        case "scan":
            await runScanCommand(args);
            return;
    }
}

main().catch((e) => {
    log.error(e?.message || String(e));
    process.exit(1);
});