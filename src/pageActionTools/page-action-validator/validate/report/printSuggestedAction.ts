// src/pageActionTools/page-action-validator/validate/report/printSuggestedAction.ts

import { info, printSection } from "@utils/cliFormat";
import type { ValidationRuleResult } from "../types";

export function printSuggestedAction(results: ValidationRuleResult[]): void {
    const hasErrors = results.some((x) =>
        x.issues.some((y) => y.level === "error")
    );

    if (!hasErrors) {
        return;
    }

    printSection("Suggested action");
    console.log(info("Run page action repair, then re-run validation."));
}
