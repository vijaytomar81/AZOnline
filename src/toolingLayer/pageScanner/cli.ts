// src/toolingLayer/pageScanner/cli.ts

import { PAGE_SCANNER_COMMANDS, type PageScannerCommand } from "@configLayer/tooling/pageScanner";
import { createLogger } from "@utils/logger";
import { runScanCommand } from "./commands/scan";
import { normalizeArgv } from "@utils/argv";
import { usage } from "./scannerHelp";
import { printCommandTitle } from "@utils/cliFormat";

function isCommand(x: string | undefined): x is PageScannerCommand {
    return x === PAGE_SCANNER_COMMANDS.SCAN || x === PAGE_SCANNER_COMMANDS.HELP;
}

const rootLog = createLogger({
    prefix: "[page-scanner]",
    withTimestamp: true,
});

async function main() {
    printCommandTitle("PAGE SCANNER", "pageScannerIcon");
    const argv = normalizeArgv(process.argv.slice(2));
    const cmd = argv[0];

    if (!isCommand(cmd)) {
        rootLog.error(`Unknown or missing command: ${cmd ?? "(none)"}`);
        rootLog.info(usage());
        process.exit(1);
    }

    const args = argv.slice(1);

    switch (cmd) {
        case PAGE_SCANNER_COMMANDS.HELP:
            rootLog.info(usage());
            return;

        case PAGE_SCANNER_COMMANDS.SCAN:
            await runScanCommand(args);
            return;
    }
}

main().catch((e) => {
    rootLog.error(e?.message || String(e));
    process.exit(1);
});