// src/utils/logger.ts
import fs from "node:fs";
import path from "node:path";
import { nowIso, startTimer } from "./time";

export type LogLevel = "error" | "warn" | "info" | "debug";

export type Logger = {
    info: (msg: string) => void;
    warn: (msg: string) => void;
    error: (msg: string) => void;
    debug: (msg: string) => void;
    child: (name: string) => Logger;
    time: (label: string) => () => void;
};

export type CreateLoggerOptions = {
    prefix?: string;          // e.g. "[page-scanner]"
    logLevel?: LogLevel;      // default: "info"
    withTimestamp?: boolean;  // default true
    logToFile?: boolean;      // also write logs to file
    logFilePath?: string;     // caller decides
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

    const match = parentPrefix.match(/^\[(.*)\]$/);
    if (match) {
        return `[${match[1]}:${trimmedChild}]`;
    }

    return `${parentPrefix}:${trimmedChild}`;
}

function shouldLog(currentLevel: LogLevel, incomingLevel: LogLevel): boolean {
    const rank: Record<LogLevel, number> = {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3,
    };

    return rank[incomingLevel] <= rank[currentLevel];
}

export function createLogger(opts: CreateLoggerOptions = {}): Logger {
    let prefix = opts.prefix ?? "[tool]";

    const scriptName = process.env.TEST_SCRIPT?.trim();
    if (scriptName && prefix.startsWith("[pw")) {
        const match = prefix.match(/^\[(.*)\]$/);
        if (match) {
            prefix = `[${match[1]}:${scriptName}]`;
        }
    }
    const logLevel = opts.logLevel ?? "info";

    const isPlaywrightRun =
        process.env.PLAYWRIGHT_TEST === "true" ||
        process.env.PW_TEST === "true";

    const withTimestamp =
        opts.withTimestamp !== false && !isPlaywrightRun;

    const logToFile = !!opts.logToFile;
    const logFilePath = opts.logFilePath;

    const fmt = (level: "INFO" | "WARN" | "ERROR" | "DEBUG", msg: string) => {
        const ts = withTimestamp ? `${nowIso()} ` : "";
        return `${ts}${prefix} ${level}: ${msg}`;
    };

    const write = (line: string, level: LogLevel) => {
        if (!shouldLog(logLevel, level)) return;

        if (level === "error") console.error(line);
        else console.log(line);

        if (logToFile && logFilePath) appendLine(logFilePath, line);
    };

    return {
        info: (msg) => write(fmt("INFO", msg), "info"),
        warn: (msg) => write(fmt("WARN", msg), "warn"),
        error: (msg) => write(fmt("ERROR", msg), "error"),
        debug: (msg) => write(fmt("DEBUG", msg), "debug"),

        child: (name: string) =>
            createLogger({
                prefix: buildChildPrefix(prefix, name),
                logLevel,
                withTimestamp,
                logToFile,
                logFilePath,
            }),

        time: (label: string) => {
            const timer = startTimer();

            return () => {
                write(fmt("INFO", `${label} completed in ${timer.elapsedSecondsText()}`), "info");
            };
        },
    };
}