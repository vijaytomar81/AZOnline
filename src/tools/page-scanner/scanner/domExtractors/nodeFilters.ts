import { getAttr } from "./utils";

function isInteractive(el: Element): boolean {
    const tag = el.tagName.toLowerCase();
    const role = getAttr(el, "role");

    return (
        tag === "button" ||
        tag === "a" ||
        tag === "input" ||
        role === "button" ||
        role === "link" ||
        role === "textbox" ||
        role === "combobox"
    );
}

export function isNestedInteractiveDuplicate(el: Element): boolean {
    if (!isInteractive(el)) return false;

    let parent = el.parentElement;
    while (parent) {
        if (isInteractive(parent)) return true;
        parent = parent.parentElement;
    }

    return false;
}

export function isInsideFooter(el: Element): boolean {
    const tag = el.tagName.toLowerCase();
    if (tag === "footer") return true;
    return Boolean(el.closest("footer"));
}

export function isVisible(el: Element): boolean {
    const htmlEl = el as HTMLElement;
    const style = window.getComputedStyle(htmlEl);

    if (style.display === "none" || style.visibility === "hidden") {
        return false;
    }

    if (htmlEl.hidden) return false;
    if (htmlEl.getAttribute("aria-hidden") === "true") return false;

    const rect = htmlEl.getBoundingClientRect();
    return rect.width > 0 || rect.height > 0;
}