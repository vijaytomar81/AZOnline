// src/reporters/logger.ts

import fs from "node:fs";
import path from "node:path";

export type Logger = {
    info: (msg: string) => void;
    error: (msg: string) => void;
    debug: (msg: string) => void;
};

export function createLogger(opts: {
    prefix?: string;
    verbose?: boolean;
    withTimestamp?: boolean;
    logToFile?: boolean;
    logFilePath?: string; // default: reports/dashboard/build.log
}): Logger {
    const prefix = opts.prefix ?? "[reporters]";
    const verbose = opts.verbose ?? false;
    const withTimestamp = opts.withTimestamp ?? true;

    const logToFile = opts.logToFile ?? false;
    const logFilePath = opts.logFilePath ?? path.join(process.cwd(), "reports", "dashboard", "build.log");

    function stamp() {
        return withTimestamp ? `${new Date().toISOString()} ` : "";
    }

    function fmt(level: "INFO" | "ERROR" | "DEBUG", msg: string) {
        return `${stamp()}${prefix} ${level}: ${msg}`;
    }

    function writeFileLine(line: string) {
        if (!logToFile) return;
        fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
        fs.appendFileSync(logFilePath, line + "\n", "utf8");
    }

    function info(msg: string) {
        const line = fmt("INFO", msg);
        console.log(line);
        writeFileLine(line);
    }

    function error(msg: string) {
        const line = fmt("ERROR", msg);
        console.error(line);
        writeFileLine(line);
    }

    function debug(msg: string) {
        if (!verbose) return;
        const line = fmt("DEBUG", msg);
        console.log(line);
        writeFileLine(line);
    }

    return { info, error, debug };
}