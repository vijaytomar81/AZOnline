// src/pageActionTools/page-action-validator/commands/validate.ts

import { runPageActionValidation } from "../validate/report";

export function runValidateCommand(args: string[]): void {
    const verbose = args.includes("--verbose");
    const strict = args.includes("--strict");
    const exitCode = runPageActionValidation({ verbose, strict });
    process.exitCode = exitCode;
}
