// src/execution/core/registry/buildExecutorKey.ts

import { normalizeSpaces, toCamelFromText } from "@utils/text";

function normalizeKeyPart(value?: string): string {
    return value ? toCamelFromText(normalizeSpaces(value)) : "";
}

export function buildExecutorKey(args: {
    action: string;
    journey?: string;
    portal?: string;
    subType?: string;
}): string {
    const action = normalizeKeyPart(args.action);
    const journey = normalizeKeyPart(args.journey);
    const portal = normalizeKeyPart(args.portal);
    const subType = normalizeKeyPart(args.subType);

    return [action, journey, portal, subType].filter(Boolean).join(":");
}
