// src/tools/page-scanner/scanner/classify.ts

import type { ScannedElement } from "../types";

export function classifyElementType(el: ScannedElement): string {
    const tag = (el.tag || "").toLowerCase();
    const role = (el.role || "").toLowerCase();
    const type = (el.typeAttr || "").toLowerCase();

    if (role === "alert") return "alert";
    if (role === "dialog") return "dialog";

    if (tag === "button" || role === "button") return "button";
    if (tag === "a" || role === "link") return "link";
    if (tag === "select" || role === "combobox") return "select";
    if (tag === "textarea") return "textarea";

    if (tag === "input") {
        if (type === "checkbox") return "checkbox";
        if (type === "radio") return "radio";
        return "input";
    }

    if (tag === "div" && el.text) return "message";

    return role || tag || "element";
}