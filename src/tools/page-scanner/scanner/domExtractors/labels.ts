import { getAttr, safeText } from "./utils";

function labelFromForId(id: string): string | null {
    const lbl = document.querySelector(`label[for='${CSS.escape(id)}']`);
    return safeText(lbl?.textContent ?? null);
}

function labelFromWrap(el: Element): string | null {
    const lbl = el.closest("label");
    return safeText(lbl?.textContent ?? null);
}

function labelFromAriaLabelledBy(el: Element): string | null {
    const ids = getAttr(el, "aria-labelledby");
    if (!ids) return null;

    const parts = ids.split(/\s+/g).filter(Boolean);
    const texts = parts
        .map((id) => document.getElementById(id)?.textContent ?? "")
        .map((t) => t.trim())
        .filter(Boolean);

    return texts.length ? texts.join(" ") : null;
}

export function inferLabelText(el: Element): string | null {
    const id = getAttr(el, "id");
    if (id) {
        const f = labelFromForId(id);
        if (f) return f;
    }

    const aria = labelFromAriaLabelledBy(el);
    if (aria) return aria;

    const wrap = labelFromWrap(el);
    if (wrap) return wrap;

    return null;
}

export function extractElementText(el: Element): string | null {
    const tag = el.tagName.toLowerCase();
    const role = getAttr(el, "role");

    if (tag === "button" || tag === "a" || role === "alert" || role === "dialog") {
        return safeText(el.textContent ?? null);
    }

    if (
        el.matches(".invalid-feedback") ||
        el.matches("[aria-live]") ||
        el.matches(".modal-body") ||
        el.matches(".modal-title")
    ) {
        return safeText(el.textContent ?? null);
    }

    return null;
}