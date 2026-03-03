// src/scanner/commands/argv.ts

/**
 * npm/yarn sometimes inject a standalone "--" token.
 * Also, scripts sometimes include "--" (e.g. "cli.ts -- scan").
 *
 * This makes CLI parsing robust by removing ALL standalone "--" tokens.
 */
export function normalizeArgv(argv: string[]): string[] {
    return argv.filter((a) => a !== "--");
}

export function hasFlag(argv: string[], name: string): boolean {
    return normalizeArgv(argv).includes(name);
}

export function getArg(argv: string[], name: string): string | undefined {
    const args = normalizeArgv(argv);

    const i = args.indexOf(name);
    if (i >= 0) {
        const v = args[i + 1];
        // if next is missing OR next is another flag, treat as undefined
        if (!v || v.startsWith("--")) return undefined;
        return v;
    }

    const eq = args.find((a) => a.startsWith(`${name}=`));
    if (eq) return eq.split("=").slice(1).join("=");

    return undefined;
}

/**
 * Throws if required arg missing.
 */
export function required(name: string, value: string | undefined): string {
    if (!value) throw new Error(`${name} is required.`);
    return value;
}