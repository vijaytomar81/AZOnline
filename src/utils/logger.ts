// src/utils/logger.ts
import fs from "node:fs";
import path from "node:path";
import { nowIso } from "./time";

export type Logger = {
    info: (msg: string) => void;
    warn: (msg: string) => void;
    error: (msg: string) => void;
    debug: (msg: string) => void;
    child: (name: string) => Logger;
};

export type CreateLoggerOptions = {
    prefix?: string;          // e.g. "[page-scanner]"
    verbose?: boolean;        // enables debug()
    withTimestamp?: boolean;  // default true
    logToFile?: boolean;      // also write logs to file
    logFilePath?: string;     // default: "<cwd>/tool.log" (caller decides)
};

function ensureDir(dir: string) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function appendLine(filePath: string, line: string) {
    try {
        ensureDir(path.dirname(filePath));
        fs.appendFileSync(filePath, line + "\n", "utf8");
    } catch {
        // Never break the CLI due to file logging
    }
}

function buildChildPrefix(parentPrefix: string, childName: string): string {
    const trimmedChild = childName.trim();
    if (!trimmedChild) return parentPrefix;

    // "[data-builder]" + "pipeline" -> "[data-builder:pipeline]"
    const match = parentPrefix.match(/^\[(.*)\]$/);
    if (match) {
        return `[${match[1]}:${trimmedChild}]`;
    }

    // fallback if prefix is not wrapped in brackets
    return `${parentPrefix}:${trimmedChild}`;
}

export function createLogger(opts: CreateLoggerOptions = {}): Logger {
    const prefix = opts.prefix ?? "[tool]";
    const verbose = !!opts.verbose;
    const withTimestamp = opts.withTimestamp !== false; // default true
    const logToFile = !!opts.logToFile;
    const logFilePath = opts.logFilePath; // optional

    const fmt = (level: "INFO" | "WARN" | "ERROR" | "DEBUG", msg: string) => {
        const ts = withTimestamp ? `${nowIso()} ` : "";
        return `${ts}${prefix} ${level}: ${msg}`;
    };

    const write = (line: string, isError: boolean) => {
        if (isError) console.error(line);
        else console.log(line);

        if (logToFile && logFilePath) appendLine(logFilePath, line);
    };

    return {
        info: (msg) => write(fmt("INFO", msg), false),
        warn: (msg) => write(fmt("WARN", msg), false),
        error: (msg) => write(fmt("ERROR", msg), true),
        debug: (msg) => {
            if (!verbose) return;
            write(fmt("DEBUG", msg), false);
        },
        child: (name: string) =>
            createLogger({
                prefix: buildChildPrefix(prefix, name),
                verbose,
                withTimestamp,
                logToFile,
                logFilePath,
            }),
    };
}