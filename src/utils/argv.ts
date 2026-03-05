// src/utils/argv.ts

/**
 * npm/yarn sometimes inject a standalone "--" token.
 * Remove ALL standalone "--" tokens to keep parsing stable.
 */
export function normalizeArgv(argv: string[]): string[] {
    return argv.filter((a) => a !== "--");
}

export function hasFlag(argv: string[], name: string): boolean {
    return normalizeArgv(argv).includes(name);
}

export function getArg(argv: string[], name: string): string | undefined {
    const args = normalizeArgv(argv);

    // style: --foo bar
    const i = args.indexOf(name);
    if (i >= 0) {
        const v = args[i + 1];
        // if next is missing OR next is another flag, treat as undefined
        if (!v || v.startsWith("--")) return undefined;
        return v;
    }

    // style: --foo=bar
    const eq = args.find((a) => a.startsWith(`${name}=`));
    if (eq) return eq.split("=").slice(1).join("=");

    return undefined;
}

export function required(flagName: string, value: string | undefined): string {
    if (!value) throw new Error(`${flagName} is required.`);
    return value;
}