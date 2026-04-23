// src/toolingLayer/pageActions/repair/cli.ts

import { printPageActionRepairHelp } from "./help";
import { runPageActionRepair } from "./repair/runPageActionRepair";

function main(): void {
    const args = process.argv.slice(2);

    if (args.includes("--help")) {
        printPageActionRepairHelp();
        return;
    }

    runPageActionRepair({
        strict: args.includes("--strict"),
        verbose: args.includes("--verbose"),
    });
}

main();
