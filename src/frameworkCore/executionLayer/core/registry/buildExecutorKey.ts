// src/frameworkCore/executionLayer/core/registry/buildExecutorKey.ts

import { normalizeSpaces, toCamelFromText } from "@utils/text";

function normalizeKeyPart(value?: string): string {
    return value ? toCamelFromText(normalizeSpaces(value)) : "";
}

export function buildExecutorKey(args: {
    action: string;
    portal?: string;
    subType?: string;
}): string {
    const action = normalizeKeyPart(args.action);
    const portal = normalizeKeyPart(args.portal);
    const subType = normalizeKeyPart(args.subType);

    return [action, portal, subType].filter(Boolean).join(":");
}
