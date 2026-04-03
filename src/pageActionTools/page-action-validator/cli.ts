// src/pageActionTools/page-action-validator/cli.ts

import { runValidateCommand } from "./commands/validate";
import { printPageActionValidatorHelp } from "./validatorHelp";

function main(): void {
    const [, , command, ...args] = process.argv;

    if (command === "validate") {
        runValidateCommand(args);
        return;
    }

    printPageActionValidatorHelp();
    process.exitCode = 1;
}

main();
