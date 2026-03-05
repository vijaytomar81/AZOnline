// src/page-elements-generator/logger.ts

import fs from "node:fs";
import path from "node:path";

export type Logger = {
    info: (msg: string) => void;
    error: (msg: string) => void;
    debug: (msg: string) => void;
};

type CreateLoggerOpts = {
    prefix?: string;          // e.g. "[page-elements]"
    verbose?: boolean;        // enables debug()
    withTimestamp?: boolean;  // prefixes ISO timestamp
    logToFile?: boolean;      // also write to a file
    logFilePath?: string;     // default: "<cwd>/page-elements-generator.log"
};

function nowIso() {
    return new Date().toISOString();
}

function ensureParentDir(filePath: string) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function appendLine(filePath: string, line: string) {
    try {
        ensureParentDir(filePath);
        fs.appendFileSync(filePath, line + "\n", "utf8");
    } catch {
        // ignore file logging errors (don't break CLI)
    }
}

export function createLogger(opts: CreateLoggerOpts = {}): Logger {
    const prefix = opts.prefix ?? "[page-elements-generator]";
    const verbose = !!opts.verbose;
    const withTimestamp = opts.withTimestamp !== false; // default true
    const logToFile = !!opts.logToFile;
    const logFilePath =
        opts.logFilePath ?? path.join(process.cwd(), "page-elements-generator.log");

    const fmt = (level: "INFO" | "ERROR" | "DEBUG", msg: string) => {
        const ts = withTimestamp ? `${nowIso()} ` : "";
        return `${ts}${prefix} ${level}: ${msg}`;
    };

    const write = (line: string) => {
        // console
        if (line.includes("ERROR:")) console.error(line);
        else console.log(line);

        // file
        if (logToFile) appendLine(logFilePath, line);
    };

    return {
        info: (msg) => write(fmt("INFO", msg)),
        error: (msg) => write(fmt("ERROR", msg)),
        debug: (msg) => {
            if (!verbose) return;
            write(fmt("DEBUG", msg));
        },
    };
}