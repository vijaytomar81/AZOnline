// src/integrations/api/gmail/gmailPolicyService.ts

import { createLogger, type Logger } from "@utils/logger";
import { verifyPolicyEmailReceived } from "./gmailService";

export type WaitForPolicyEmailOptions = {
    policyNumber: string;
    subject?: string;
    from?: string;
    to?: string;
    timeoutMs?: number;
    pollIntervalMs?: number;
    logger?: Logger;
};

function buildQuery(opts: WaitForPolicyEmailOptions): string {
    const parts: string[] = [];

    if (opts.subject) parts.push(`subject:"${opts.subject}"`);
    if (opts.from) parts.push(`from:${opts.from}`);
    if (opts.to) parts.push(`to:${opts.to}`);

    return parts.join(" ");
}

export async function waitForPolicyEmail(opts: WaitForPolicyEmailOptions) {
    const log =
        opts.logger ??
        createLogger({
            prefix: "[gmail-policy]",
            withTimestamp: true,
            logToFile: false,
        });

    const query = buildQuery(opts);

    log.info(
        `Waiting for policy email. policyNumber="${opts.policyNumber}" query="${query}"`
    );

    const result = await verifyPolicyEmailReceived({
        query,
        expectedTo: opts.to,
        policyNumber: opts.policyNumber,
        timeoutMs: opts.timeoutMs ?? 90_000,
        pollIntervalMs: opts.pollIntervalMs ?? 5_000,
        logger: log,
    });

    if (!result.matched) {
        throw new Error(
            `Policy email received but policy number "${opts.policyNumber}" was not found in email subject="${result.email.subject}"`
        );
    }

    log.info(
        `Policy email verified successfully for "${opts.policyNumber}" in fields=${result.whereMatched.join(",")}`
    );

    return result;
}