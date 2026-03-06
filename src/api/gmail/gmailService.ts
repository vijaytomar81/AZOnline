// src/api/gmail/gmailService.ts

import { createLogger } from "../../utils/logger";
import { createGmailClient } from "./gmailClient";
import {
    buildSearchableEmailText,
    containsPolicyNumber,
    containsRecipientAlias,
    extractOtp,
    extractTextHtml,
    extractTextPlain,
    getMessageHeader,
} from "./gmailParser";

import type {
    FindEmailOptions,
    GetOtpOptions,
    GmailEmail,
    OtpEmailResult,
    PolicyEmailVerificationResult,
    VerifyPolicyEmailOptions,
} from "./gmailTypes";

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function listMessageIds(query = "", maxResults = 10) {
    const gmail = await createGmailClient();

    const res = await gmail.users.messages.list({
        userId: "me",
        q: query,
        maxResults,
    });

    return res.data.messages ?? [];
}

export async function getEmailById(messageId: string): Promise<GmailEmail> {
    const gmail = await createGmailClient();

    const res = await gmail.users.messages.get({
        userId: "me",
        id: messageId,
        format: "full",
    });

    const msg = res.data;
    const payload = msg.payload;

    return {
        id: msg.id ?? "",
        threadId: msg.threadId ?? "",
        from: getMessageHeader(payload, "From"),
        to: getMessageHeader(payload, "To"),
        subject: getMessageHeader(payload, "Subject"),
        date: getMessageHeader(payload, "Date"),
        snippet: msg.snippet ?? "",
        bodyText: extractTextPlain(payload),
        bodyHtml: extractTextHtml(payload),
    };
}

export async function getLatestEmails(opts: FindEmailOptions = {}): Promise<GmailEmail[]> {
    const log = opts.logger ?? createLogger({
        prefix: "[gmail]",
        withTimestamp: true,
        logToFile: false,
    });

    const query = opts.query ?? "";
    const maxResults = opts.maxResults ?? 5;
    const expectedTo = opts.expectedTo;

    log.info(`Fetching latest emails: query="${query}" maxResults=${maxResults}`);

    const messages = await listMessageIds(query, maxResults);
    const emails: GmailEmail[] = [];

    for (const m of messages) {
        if (!m.id) continue;

        const email = await getEmailById(m.id);

        if (expectedTo && !containsRecipientAlias(email.to, expectedTo)) {
            continue;
        }

        emails.push(email);
    }

    log.info(`Fetched ${emails.length} email(s).`);
    return emails;
}

export async function waitForEmail(opts: FindEmailOptions = {}): Promise<GmailEmail> {
    const log = opts.logger ?? createLogger({
        prefix: "[gmail]",
        withTimestamp: true,
        logToFile: false,
    });

    const query = opts.query ?? "";
    const maxResults = opts.maxResults ?? 10;
    const timeoutMs = opts.timeoutMs ?? 60_000;
    const pollIntervalMs = opts.pollIntervalMs ?? 5_000;
    const expectedTo = opts.expectedTo;

    const started = Date.now();

    log.info(
        `Waiting for email: query="${query}" timeoutMs=${timeoutMs} pollIntervalMs=${pollIntervalMs}`
    );

    while (Date.now() - started < timeoutMs) {
        const emails = await getLatestEmails({
            query,
            maxResults,
            expectedTo,
            logger: log,
        });

        if (emails.length > 0) {
            log.info(`Email received: subject="${emails[0].subject}" to="${emails[0].to}"`);
            return emails[0];
        }

        await sleep(pollIntervalMs);
    }

    throw new Error(`Timeout waiting for email. query="${query}" expectedTo="${expectedTo ?? ""}"`);
}

export async function getOtpFromLatestEmail(opts: GetOtpOptions = {}): Promise<OtpEmailResult> {
    const log = opts.logger ?? createLogger({
        prefix: "[gmail]",
        withTimestamp: true,
        logToFile: false,
    });

    const email = await waitForEmail({
        query: opts.query,
        maxResults: 10,
        timeoutMs: opts.timeoutMs,
        pollIntervalMs: opts.pollIntervalMs,
        expectedTo: opts.expectedTo,
        logger: log,
    });

    const candidateText = buildSearchableEmailText(email);
    const otp = extractOtp(candidateText, opts.otpRegex ?? /\b\d{6}\b/);

    if (!otp) {
        throw new Error(`OTP not found in email subject="${email.subject}" to="${email.to}"`);
    }

    log.info(`OTP extracted successfully from subject="${email.subject}"`);
    return { email, otp };
}

export async function verifyPolicyEmailReceived(
    opts: VerifyPolicyEmailOptions
): Promise<PolicyEmailVerificationResult> {
    const log = opts.logger ?? createLogger({
        prefix: "[gmail]",
        withTimestamp: true,
        logToFile: false,
    });

    const email = await waitForEmail({
        query: opts.query,
        maxResults: 10,
        timeoutMs: opts.timeoutMs,
        pollIntervalMs: opts.pollIntervalMs,
        expectedTo: opts.expectedTo,
        logger: log,
    });

    const result = containsPolicyNumber(email, opts.policyNumber);

    if (result.matched) {
        log.info(
            `Policy number "${opts.policyNumber}" found in email subject="${email.subject}" fields=${result.whereMatched.join(",")}`
        );
    } else {
        log.warn(
            `Policy number "${opts.policyNumber}" NOT found in email subject="${email.subject}"`
        );
    }

    return {
        email,
        matched: result.matched,
        whereMatched: result.whereMatched,
    };
}