// src/tools/businessJourneys/generator/commands/generate.ts

import { generateBusinessJourneys } from "../generator/generateBusinessJourneys";

export function runGenerateCommand(args: { verbose: boolean }): number {
    generateBusinessJourneys(args);
    return 0;
}
