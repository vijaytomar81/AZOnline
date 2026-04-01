// src/pageObjectTools/page-object-validator/validate/rules/registry/pageManager/pageManagerNaming.ts

import { toCamelFromText } from "@utils/text";

function lastSegment(pageKey: string): string {
    return pageKey.split(".").slice(-1)[0] || "page";
}

function firstSegment(pageKey: string): string {
    return pageKey.split(".")[0] || "common";
}

export function expectedClassName(pageKey: string): string {
    const last = pageKey.split(".").slice(-1)[0] || "Page";
    const parts = last
        .split(/[-_.\s]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1));

    return `${parts.join("")}Page`;
}

export function expectedImportPath(pageKey: string, className: string): string {
    return `@page-objects/${pageKey.split(".").join("/")}/${className}`;
}

export function expectedMember(pageKey: string): string {
    return toCamelFromText(lastSegment(pageKey));
}

export function expectedKeyId(pageKey: string): string {
    return `${firstSegment(pageKey)}.${expectedMember(pageKey)}`;
}

export function pageKeyFromImportPath(importPath: string): string {
    const match = importPath.match(/^@page-objects\/(.+)\/[^/]+$/);
    return match?.[1]?.replace(/\//g, ".") ?? importPath;
}

export function pageKeyFromKeyId(keyId: string): string {
    return keyId;
}