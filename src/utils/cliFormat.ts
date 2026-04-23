// src/utils/cliFormat.ts

import { ICONS } from "./icons";
import type { IconKey } from "./icons";

const ANSI = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    dim: "\x1b[2m",

    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    gray: "\x1b[90m",
};

function color(text: string, code: string): string {
    return `${code}${text}${ANSI.reset}`;
}

function stripAnsi(text: string): string {
    return String(text).replace(/\x1B\[[0-9;]*m/g, "");
}

export function success(text: string): string {
    return color(text, ANSI.green);
}

export function warning(text: string): string {
    return color(text, ANSI.yellow);
}

export function failure(text: string): string {
    return color(text, ANSI.red);
}

export function info(text: string): string {
    return color(text, ANSI.cyan);
}

export function muted(text: string): string {
    return color(text, ANSI.gray);
}

export function strong(text: string): string {
    return color(text, ANSI.bold);
}

export function printCommandTitle(title: string, icon?: IconKey) {
    const iconPrefix = icon ? `${ICONS[icon]} ` : "";
    const text = `${iconPrefix}${title}`.trim();

    const line = "*".repeat(Math.max(stripAnsi(text).length, 32));

    console.log("");
    console.log(muted(line));
    console.log(strong(text));
    console.log(muted(line));
}

export function printSection(title: string) {
    console.log("");
    console.log(strong(title));
    console.log(muted("-".repeat(title.length)));
}

export function printSubSection(title: string) {
    console.log("");
    console.log(strong(title));
    console.log(muted("-".repeat(title.length)));
}

export function printKeyValue(key: string, value: string | number | boolean) {
    const label = key.padEnd(10, " ");
    console.log(`${muted(label)}: ${value}`);
}

export function printIndented(label: string, value: string) {
    const padded = label.padEnd(24, " ");
    console.log(`  ${muted(padded)}${value}`);
}

export function printStatus(symbol: string, text: string) {
    let s = symbol;

    if (symbol === ICONS.successIcon || symbol === ICONS.addIcon) {
        s = success(symbol);
    } else if (symbol === ICONS.warningIcon) {
        s = warning(symbol);
    } else if (symbol === ICONS.failIcon) {
        s = failure(symbol);
    } else if (symbol === ICONS.hintIcon) {
        s = info(symbol);
    }

    const iconPad = 2;
    console.log(`${s}${" ".repeat(iconPad)}${text}`);
}

export function printEnvironment(
    rows: Array<[string, string | number | boolean]>
) {
    console.log("");
    console.log(strong("Environment"));
    console.log(muted("-----------"));

    const longestKey = Math.max(...rows.map(([k]) => stripAnsi(String(k)).length));
    const pad = longestKey + 1;

    for (const [key, value] of rows) {
        const label = String(key).padEnd(pad, " ");
        console.log(`${muted(label)}: ${value}`);
    }

    console.log("");
}

export function printSummary(
    title: string,
    rows: Array<[string, string | number]>,
    resultText?: string
) {
    console.log("");

    const allRows: Array<[string, string | number]> =
        resultText !== undefined
            ? [...rows, ["Result", resultText]]
            : rows;

    const longestKey = Math.max(...allRows.map(([k]) => stripAnsi(String(k)).length));
    const longestValue = Math.max(...allRows.map(([, v]) => stripAnsi(String(v)).length));

    const pad = longestKey + 3;
    const lineWidth = Math.max(pad + 2 + longestValue + 2, 32);
    const line = "-".repeat(lineWidth);

    console.log(muted(line));
    console.log(strong(title));
    console.log(muted(line));

    for (const [k, v] of rows) {
        const label = String(k).padEnd(pad, " ");
        console.log(`${muted(label)}: ${v}`);
    }

    console.log(muted(line));

    if (resultText !== undefined) {
        const label = "Result".padEnd(pad, " ");
        console.log(`${muted(label)}: ${resultText}`);
        console.log(muted(line));
    }
}

export function printSectionBlock(
    title: string,
    rows: Array<[string, string | number | boolean]>
) {
    console.log("");
    console.log(strong(title));
    console.log(muted("-".repeat(title.length)));

    const longestKey = Math.max(...rows.map(([k]) => String(k).length));
    const pad = longestKey + 1;

    for (const [key, value] of rows) {
        const label = String(key).padEnd(pad, " ");
        console.log(`${muted(label)}: ${value}`);
    }
}
