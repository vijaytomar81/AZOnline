// src/api/gmail/gmailTypes.ts

import type { Logger } from "@utils/logger";

export type GmailEmail = {
    id: string;
    threadId: string;
    from: string;
    to: string;
    subject: string;
    date: string;
    snippet: string;
    bodyText: string;
    bodyHtml?: string;
};

export type FindEmailOptions = {
    query?: string;
    maxResults?: number;
    timeoutMs?: number;
    pollIntervalMs?: number;
    expectedTo?: string;
    logger?: Logger;
};

export type GetOtpOptions = FindEmailOptions & {
    otpRegex?: RegExp;
};

export type VerifyPolicyEmailOptions = FindEmailOptions & {
    policyNumber: string;
};

export type OtpEmailResult = {
    email: GmailEmail;
    otp: string;
};

export type PolicyEmailVerificationResult = {
    email: GmailEmail;
    matched: boolean;
    whereMatched: Array<"subject" | "snippet" | "bodyText" | "bodyHtml" | "bodyHtmlText">;
};