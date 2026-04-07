// src/tools/pageActions/generator/generator/render/indentLines.ts

export function indentLines(lines: string[]): string[] {
    return lines.map((line) => (line ? `     ${line.trimEnd()}` : ""));
}
