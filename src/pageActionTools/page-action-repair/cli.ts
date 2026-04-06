// src/pageActionTools/page-action-repair/cli.ts

import { runRepairCommand } from "./commands/repair";
import { printPageActionRepairHelp } from "./repairHelp";

function main(): void {
    const [, , command, ...args] = process.argv;

    if (command === "repair") {
        runRepairCommand(args);
        return;
    }

    printPageActionRepairHelp();
    process.exitCode = 1;
}

main();
