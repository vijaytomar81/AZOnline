// src/toolingLayer/pageObjects/validator/validate/rules/registry/indexExports/indexExportNaming.ts

export function expectedClassName(pageKey: string): string {
    const last = pageKey.split(".").slice(-1)[0] || "Page";
    const parts = last
        .split(/[-_.\s]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1));

    return `${parts.join("")}Page`;
}

export function expectedImportPath(pageKey: string, className: string): string {
    return `@businessLayer/pageObjects/objects/${pageKey.split(".").join("/")}/${className}`;
}

export function pageKeyFromImportPath(importPath: string): string {
    if (importPath === "./pageManager") {
        return "registry.pageManager";
    }

    const match = importPath.match(
        /^@businessLayer\/pageObjects\/objects\/(.+)\/[^/]+$/
    );

    return match?.[1]?.replace(/\//g, ".") ?? importPath;
}
