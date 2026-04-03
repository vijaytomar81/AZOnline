// src/pageActionTools/page-action-repair/commands/repair.ts

import { runPageActionRepair } from "../repair/report";

export function runRepairCommand(args: string[]): void {
    const verbose = args.includes("--verbose");
    const exitCode = runPageActionRepair({ verbose });
    process.exitCode = exitCode;
}
