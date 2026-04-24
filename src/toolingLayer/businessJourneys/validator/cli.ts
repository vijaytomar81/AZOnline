// src/toolingLayer/businessJourneys/validator/cli.ts

import { runBusinessJourneyValidator } from "./validate/runBusinessJourneyValidator";
import { printBusinessJourneyValidatorHelp } from "./help";

function main(): void {
    const args = process.argv.slice(2);
    const command = args.find((arg) => !arg.startsWith("-")) ?? "validate";
    const strict = args.includes("--strict");
    const verbose = args.includes("--verbose");

    if (command === "validate") {
        const exitCode = runBusinessJourneyValidator({
            strict,
            verbose,
        });
        process.exit(exitCode);
    }

    printBusinessJourneyValidatorHelp();
    process.exit(1);
}

main();
