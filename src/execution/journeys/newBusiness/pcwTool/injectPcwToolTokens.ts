// src/execution/journeys/newBusiness/pcwTool/injectPcwToolTokens.ts

export function injectPcwToolTokens(
    input: string,
    tokens: Record<string, string>
): string {
    let output = input;

    Object.entries(tokens).forEach(([key, value]) => {
        const pattern = new RegExp(`{{\\s*${key}\\s*}}`, "gi");
        output = output.replace(pattern, value);
    });

    return output;
}
