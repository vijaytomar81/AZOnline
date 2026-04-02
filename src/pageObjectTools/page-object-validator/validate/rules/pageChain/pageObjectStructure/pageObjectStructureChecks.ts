// src/pageObjectTools/page-object-validator/validate/rules/pageChain/pageObjectStructure/pageObjectStructureChecks.ts

export function hasOpeningMarker(pageObjectTs: string): boolean {
    return pageObjectTs.includes("// <scanner:aliases>");
}

export function hasClosingMarker(pageObjectTs: string): boolean {
    return pageObjectTs.includes("// </scanner:aliases>");
}

export function hasBasePageImport(pageObjectTs: string): boolean {
    return pageObjectTs.includes(`import { BasePage } from "@automation/base";`);
}

export function hasAliasesImport(pageObjectTs: string): boolean {
    return pageObjectTs.includes(`import { aliases, aliasKeys } from "./aliases";`);
}

export function hasPageMetaImport(pageObjectTs: string): boolean {
    return pageObjectTs.includes(`import { pageMeta } from "./aliases.generated";`);
}

export function hasPageKeyConstant(
    pageObjectTs: string,
    pageKey: string
): boolean {
    return pageObjectTs.includes(
        `const PAGE_KEY = ${JSON.stringify(pageKey)} as const;`
    );
}

export function hasClassDeclaration(
    pageObjectTs: string,
    className: string
): boolean {
    return pageObjectTs.includes(`export class ${className} extends BasePage`);
}
