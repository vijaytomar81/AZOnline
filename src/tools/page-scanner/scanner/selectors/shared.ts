import type { ScannedElement } from "../types";

export function scoreCss(base: number): number {
    return base;
}

export function scoreRole(base: number): number {
    return base;
}

export function scoreText(base: number): number {
    return base;
}

export function inferRoleFromTag(tag: string, href: string | null): string | null {
    const t = (tag || "").toLowerCase();

    if (t === "button") return "button";
    if (t === "a" && href) return "link";
    if (t === "input") return "textbox";
    if (t === "textarea") return "textbox";
    if (t === "select") return "combobox";

    return null;
}

export function getElementTag(el: ScannedElement): string {
    return el.tag || "element";
}