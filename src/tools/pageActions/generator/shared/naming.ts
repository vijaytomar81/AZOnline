// src/tools/pageActions/generator/shared/naming.ts

export function toPascalCase(value: string): string {
    return value
        .split(/[^a-zA-Z0-9]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
}

export function toCamelCase(value: string): string {
    const pascal = toPascalCase(value);

    return pascal
        ? pascal.charAt(0).toLowerCase() + pascal.slice(1)
        : "";
}

export function normalizeFieldNameFromMethod(methodName: string): string {
    const stripped = methodName.replace(
        /^(input|select|search|textarea|date|checkbox)/,
        ""
    );

    return toCamelCase(stripped);
}
