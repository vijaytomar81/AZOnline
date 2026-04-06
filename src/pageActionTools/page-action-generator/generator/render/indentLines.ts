// src/pageActionTools/page-action-generator/generator/render/indentLines.ts

export function indentLines(lines: string[]): string[] {
    return lines.map((line) => (line ? `     ${line.trimEnd()}` : ""));
}
