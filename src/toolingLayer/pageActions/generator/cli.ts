// src/toolingLayer/pageActions/generator/cli.ts

import { runPageActionGenerator } from "./cli/runPageActionGenerator";

function main(): void {
    const args = process.argv.slice(2);
    const verbose = args.includes("--verbose");
    const exitCode = runPageActionGenerator({ verbose });
    process.exit(exitCode);
}

main();
