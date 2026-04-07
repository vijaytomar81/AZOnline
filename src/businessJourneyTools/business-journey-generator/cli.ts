// src/businessJourneyTools/business-journey-generator/cli.ts

import { runGenerateCommand } from "./commands/generate";
import { printBusinessJourneyGeneratorHelp } from "./generatorHelp";

function main() {
    const args = process.argv.slice(2);
    const verbose = args.includes("--verbose");
    const command = args.find((arg) => !arg.startsWith("-")) ?? "generate";

    if (command === "generate") {
        const exitCode = runGenerateCommand({ verbose });
        process.exit(exitCode);
    }

    printBusinessJourneyGeneratorHelp();
    process.exit(1);
}

main();
