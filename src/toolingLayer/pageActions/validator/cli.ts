// src/toolingLayer/pageActions/validator/cli.ts

import { printPageActionValidatorHelp } from "./help";
import { runPageActionValidator } from "./validate/runPageActionValidator";

function main(): void {
    const args = process.argv.slice(2);

    if (args.includes("--help")) {
        printPageActionValidatorHelp();
        return;
    }

    runPageActionValidator({
        strict: args.includes("--strict"),
        verbose: args.includes("--verbose"),
    });
}

main();
