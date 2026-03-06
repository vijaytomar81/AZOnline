// src/api/gmail/gmailParser.ts

function decodeBase64Url(data?: string): string {
    if (!data) return "";

    const normalized = data.replace(/-/g, "+").replace(/_/g, "/");
    return Buffer.from(normalized, "base64").toString("utf8");
}

function findHeader(
    headers: Array<{ name?: string | null; value?: string | null }> | undefined,
    name: string
): string {
    return (
        headers?.find((h) => (h.name ?? "").toLowerCase() === name.toLowerCase())?.value ??
        ""
    );
}

function extractPartText(payload: any, mimeType: string): string {
    if (!payload) return "";

    if (payload.mimeType === mimeType && payload.body?.data) {
        return decodeBase64Url(payload.body.data);
    }

    if (Array.isArray(payload.parts)) {
        for (const part of payload.parts) {
            const found = extractPartText(part, mimeType);
            if (found) return found;
        }
    }

    return "";
}

export function extractTextPlain(payload: any): string {
    return extractPartText(payload, "text/plain");
}

export function extractTextHtml(payload: any): string {
    return extractPartText(payload, "text/html");
}

export function getMessageHeader(payload: any, name: string): string {
    return findHeader(payload?.headers, name);
}

export function stripHtmlTags(html: string): string {
    return String(html ?? "")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/\s+/g, " ")
        .trim();
}

export function buildSearchableEmailText(email: {
    subject?: string;
    snippet?: string;
    bodyText?: string;
    bodyHtml?: string;
}): string {
    const htmlAsText = stripHtmlTags(email.bodyHtml ?? "");

    return [
        email.subject ?? "",
        email.snippet ?? "",
        email.bodyText ?? "",
        email.bodyHtml ?? "",
        htmlAsText,
    ]
        .filter(Boolean)
        .join("\n");
}

export function extractOtp(text: string, otpRegex: RegExp = /\b\d{6}\b/): string | null {
    const match = String(text ?? "").match(otpRegex);
    return match?.[0] ?? null;
}

export function normalizeEmailAddress(value: string): string {
    return String(value ?? "").trim().toLowerCase();
}

export function containsRecipientAlias(toHeader: string, expectedTo: string): boolean {
    const actual = normalizeEmailAddress(toHeader);
    const expected = normalizeEmailAddress(expectedTo);

    return actual.includes(expected);
}

export function containsPolicyNumber(
    email: {
        subject?: string;
        snippet?: string;
        bodyText?: string;
        bodyHtml?: string;
    },
    policyNumber: string
) {
    const whereMatched: Array<"subject" | "snippet" | "bodyText" | "bodyHtml" | "bodyHtmlText"> = [];

    const target = String(policyNumber ?? "").trim().toLowerCase();
    const subject = (email.subject ?? "").toLowerCase();
    const snippet = (email.snippet ?? "").toLowerCase();
    const bodyText = (email.bodyText ?? "").toLowerCase();
    const bodyHtml = (email.bodyHtml ?? "").toLowerCase();
    const bodyHtmlText = stripHtmlTags(email.bodyHtml ?? "").toLowerCase();

    if (subject.includes(target)) whereMatched.push("subject");
    if (snippet.includes(target)) whereMatched.push("snippet");
    if (bodyText.includes(target)) whereMatched.push("bodyText");
    if (bodyHtml.includes(target)) whereMatched.push("bodyHtml");
    if (bodyHtmlText.includes(target)) whereMatched.push("bodyHtmlText");

    return {
        matched: whereMatched.length > 0,
        whereMatched,
    };
}