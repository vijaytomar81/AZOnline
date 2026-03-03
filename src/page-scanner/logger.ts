// src/scanner/logger.ts

import fs from "node:fs";
import path from "node:path";

export type Logger = {
    info: (msg: string) => void;
    warn: (msg: string) => void;
    error: (msg: string) => void;
    debug: (msg: string) => void;
};

export type LoggerOptions = {
    prefix?: string;          // e.g. "[scanner]"
    verbose?: boolean;        // enables debug()
    withTimestamp?: boolean;  // default TRUE
    logToFile?: boolean;      // optional file logging
    logFilePath?: string;     // default: ./scanner.log
};

function nowIso() {
    return new Date().toISOString();
}

function ensureFileDir(filePath: string) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function createLogger(opts: LoggerOptions = {}): Logger {
    const prefix = opts.prefix ?? "[page-scanner]";
    const verbose = !!opts.verbose;
    const withTimestamp = opts.withTimestamp !== false; // default TRUE
    const logToFile = !!opts.logToFile;

    const logFilePath =
        opts.logFilePath ?? path.join(process.cwd(), "scanner.log");

    if (logToFile) ensureFileDir(logFilePath);

    function fmt(msg: string) {
        const ts = withTimestamp ? `${nowIso()} ` : "";
        return `${ts}${prefix} ${msg}`;
    }

    function write(line: string) {
        console.log(line);
        if (logToFile) fs.appendFileSync(logFilePath, line + "\n", "utf8");
    }

    function writeErr(line: string) {
        console.error(line);
        if (logToFile) fs.appendFileSync(logFilePath, line + "\n", "utf8");
    }

    return {
        info: (msg) => write(fmt(msg)),
        warn: (msg) => write(fmt(`WARN: ${msg}`)),
        error: (msg) => writeErr(fmt(`ERROR: ${msg}`)),
        debug: (msg) => {
            if (!verbose) return;
            write(fmt(`DEBUG: ${msg}`));
        },
    };
}