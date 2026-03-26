// src/execution/utils/calculatedEmail.ts

import { formatTimestamp } from "@utils/time";
import { environments } from "@config/environments";
import { envConfig } from "@config/env";

function normalize(value: string): string {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "");
}

function splitEmail(baseEmail: string) {
    const [local, domain] = baseEmail.split("@");
    return { local, domain };
}

export function buildCalculatedEmail(args: {
    testCaseId?: string;
    startFrom?: string;
}): string {
    const baseEmail = environments.calculatedEmailBase;
    const { local, domain } = splitEmail(baseEmail);

    const env = normalize(envConfig.name); // azonlinetest
    const startFrom = normalize(args.startFrom ?? "direct");
    const testCaseId = normalize(args.testCaseId ?? "unknown");

    const timestamp = formatTimestamp();

    return `${local}+${env}_${startFrom}_${testCaseId}_${timestamp}@${domain}`;
}