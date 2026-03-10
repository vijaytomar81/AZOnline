// src/tools/page-elements-validator/validators/pageChain/checkPageObjectStructure.ts

import { buildStep } from "./types";

export function checkPageObjectStructure(params: {
    pageObjectTs: string;
    pageKey: string;
    pageObjectFileName: string;
}) {

    const errors: string[] = [];
    const warnings: string[] = [];

    const expectedClass = params.pageObjectFileName.replace(".ts", "");

    if (!params.pageObjectTs.includes(`class ${expectedClass}`)) {
        errors.push(`missing class ${expectedClass}`);
    }

    if (!params.pageObjectTs.includes("extends basePage")) {
        errors.push("page object must extend basePage");
    }

    if (!params.pageObjectTs.includes(params.pageKey)) {
        warnings.push("PAGE_KEY constant not detected");
    }

    return buildStep(
        "Page Object Structure",
        errors,
        warnings,
        "page object structure valid"
    );
}