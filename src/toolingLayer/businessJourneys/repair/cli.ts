// src/toolingLayer/businessJourneys/repair/cli.ts

import { runBusinessJourneyRepair } from "./repair/runBusinessJourneyRepair";
import { printBusinessJourneyRepairHelp } from "./help";

function main(): void {
    const args = process.argv.slice(2);
    const command = args.find((arg) => !arg.startsWith("-")) ?? "repair";
    const strict = args.includes("--strict");
    const verbose = args.includes("--verbose");

    if (command === "repair") {
        const exitCode = runBusinessJourneyRepair({
            strict,
            verbose,
        });
        process.exit(exitCode);
    }

    printBusinessJourneyRepairHelp();
    process.exit(1);
}

main();
