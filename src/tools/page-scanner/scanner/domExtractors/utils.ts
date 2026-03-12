export function getAttr(el: Element, name: string): string | null {
    const v = el.getAttribute(name);
    return v && v.trim() ? v.trim() : null;
}

export function safeText(s: string | null | undefined): string | null {
    const t = (s ?? "").replace(/\s+/g, " ").trim();
    return t ? t : null;
}