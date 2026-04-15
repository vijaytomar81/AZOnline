// src/integrations/api/gmail/gmailClient.ts

import path from "node:path";
import { google } from "googleapis";
import { authenticate } from "@google-cloud/local-auth";

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

export async function createGmailClient() {
    const credentialsPath =
        process.env.GMAIL_CREDENTIALS_PATH ??
        path.join(process.cwd(), "config", "gmail.credentials.json");

    const auth = await authenticate({
        scopes: SCOPES,
        keyfilePath: credentialsPath,
    });

    return google.gmail({
        version: "v1",
        auth,
    } as any);
}