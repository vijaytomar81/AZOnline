// src/businessJourneyTools/business-journey-generator/cli.ts

import { runGenerateCommand } from "./commands/generate";
import { printBusinessJourneyGeneratorHelp } from "./generatorHelp";

function main() {
    const command = process.argv[2] ?? "generate";
    const verbose = process.argv.includes("--verbose");

    if (command === "generate") {
        const exitCode = runGenerateCommand({ verbose });
        process.exit(exitCode);
    }

    printBusinessJourneyGeneratorHelp();
    process.exit(1);
}

main();
