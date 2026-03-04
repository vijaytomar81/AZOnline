// src/page-elements-validator/logger.ts

import fs from "node:fs";
import path from "node:path";

export type Logger = {
    info: (msg: string) => void;
    error: (msg: string) => void;
    debug: (msg: string) => void;
};

type CreateLoggerOptions = {
    prefix?: string;
    verbose?: boolean;
    withTimestamp?: boolean;
    logToFile?: boolean;
    logFilePath?: string;
};

function nowIso() {
    return new Date().toISOString();
}

function ensureDir(dir: string) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function writeToFile(file: string, line: string) {
    ensureDir(path.dirname(file));
    fs.appendFileSync(file, line + "\n", "utf8");
}

export function createLogger(opts: CreateLoggerOptions = {}): Logger {
    const prefix = opts.prefix ?? "[validator]";
    const verbose = !!opts.verbose;
    const withTimestamp = opts.withTimestamp ?? true;

    const logToFile = !!opts.logToFile;
    const logFilePath =
        opts.logFilePath ??
        path.join(process.cwd(), "page-elements-validator.log");

    function format(level: string, msg: string) {
        const ts = withTimestamp ? `${nowIso()} ` : "";
        return `${ts}${prefix} ${level}: ${msg}`;
    }

    function log(line: string) {
        console.log(line);
        if (logToFile) writeToFile(logFilePath, line);
    }

    return {
        info(msg: string) {
            log(format("INFO", msg));
        },

        error(msg: string) {
            log(format("ERROR", msg));
        },

        debug(msg: string) {
            if (!verbose) return;
            log(format("DEBUG", msg));
        },
    };
}