// src/integrations/api/gmail/gmailOtpService.ts

import { createLogger, type Logger } from "@utils/logger";
import { getOtpFromLatestEmail } from "./gmailService";

export type WaitForOtpOptions = {
    subject?: string;
    from?: string;
    to?: string;
    timeoutMs?: number;
    pollIntervalMs?: number;
    otpRegex?: RegExp;
    logger?: Logger;
};

function buildQuery(opts: WaitForOtpOptions): string {
    const parts: string[] = [];

    if (opts.subject) parts.push(`subject:"${opts.subject}"`);
    if (opts.from) parts.push(`from:${opts.from}`);
    if (opts.to) parts.push(`to:${opts.to}`);

    return parts.join(" ");
}

export async function waitForOtp(opts: WaitForOtpOptions = {}) {
    const log =
        opts.logger ??
        createLogger({
            prefix: "[gmail-otp]",
            withTimestamp: true,
            logToFile: false,
        });

    const query = buildQuery(opts);

    log.info(`Waiting for OTP email. query="${query}"`);

    const res = await getOtpFromLatestEmail({
        query,
        expectedTo: opts.to,
        timeoutMs: opts.timeoutMs ?? 60_000,
        pollIntervalMs: opts.pollIntervalMs ?? 5_000,
        otpRegex: opts.otpRegex ?? /\b\d{6}\b/,
        logger: log,
    });

    log.info(`OTP found for subject="${res.email.subject}"`);
    return res.otp;
}