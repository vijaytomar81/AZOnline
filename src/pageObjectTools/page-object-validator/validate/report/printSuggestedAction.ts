// src/pageObjectTools/page-object-validator/validate/report/printSuggestedAction.ts

import { ICONS } from "@utils/icons";
import { info, printSection, strong } from "@utils/cliFormat";
import type { ValidationSummary } from "../types";

export function printSuggestedAction(summary: ValidationSummary): void {
    if (summary.totalErrors === 0) {
        return;
    }

    printSection("Suggested action");
    console.log(
        `${info(ICONS.hintIcon)} Run automatic repair to synchronize generated artifacts.`
    );
    console.log("");
    console.log(`    ${strong("npm run repair:run")}`);
    console.log("");
    console.log(`${info(ICONS.hintIcon)} For detailed output use:`);
    console.log("");
    console.log(`    ${strong("npm run repair:run:verbose")}`);
}