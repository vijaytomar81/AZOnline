// src/utils/cliFormat.ts

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

    if (symbol === "✓" || symbol === "✅" || symbol === "➕") {
        s = success(symbol);
    } else if (symbol === "⚠️") {
        s = warning(symbol);
    } else if (symbol === "❌") {
        s = failure(symbol);
    }

    console.log(`${s} ${text}`);
}

export function printSummary(title: string, rows: Array<[string, string | number]>) {
    const line = "-".repeat(50);

    console.log("");
    console.log(muted(line));
    console.log(strong(title));
    console.log(muted(line));

    for (const [k, v] of rows) {
        const label = k.padEnd(20, " ");
        console.log(`${muted(label)}: ${v}`);
    }

    console.log(muted(line));
}