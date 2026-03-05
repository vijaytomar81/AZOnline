// src/tools/page-scanner/scanner/domExtract.ts

import type { Page } from "@playwright/test";
import type { ScannedElement } from "./types";

/**
 * Extracts interactive elements from the currently loaded page.
 *
 * Rules:
 *  - Only scan inside: <div id="root">
 *  - Exclude anything inside <footer> (and exclude the footer element itself)
 *  - Do NOT rely on CSS classes (unstable)
 */
export async function extractDomElements(page: Page): Promise<ScannedElement[]> {
    const scanned = await page.evaluate(() => {
        function getAttr(el: Element, name: string): string | null {
            const v = el.getAttribute(name);
            return v && v.trim() ? v.trim() : null;
        }

        function safeText(s: string | null | undefined): string | null {
            const t = (s ?? "").trim();
            return t ? t : null;
        }

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

        function inferLabelText(el: Element): string | null {
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

        function elementText(el: Element): string | null {
            const tag = el.tagName.toLowerCase();
            if (tag === "button" || tag === "a") return safeText(el.textContent ?? null);
            return null;
        }

        function isInsideFooter(el: Element): boolean {
            const tag = el.tagName.toLowerCase();
            if (tag === "footer") return true;
            return Boolean(el.closest("footer"));
        }

        // ✅ only scan inside #root
        const root = document.querySelector("#root") ?? document.body;

        // Only elements we care about (same set you had)
        const selector = [
            "input",
            "select",
            "textarea",
            "button",
            "a[href]",
            "[role='button']",
            "[role='link']",
            "[role='textbox']",
            "[role='combobox']",
            "[data-testid]",
            "[data-test]",
            "[data-qa]",
        ].join(",");

        const nodes = Array.from(root.querySelectorAll(selector)).filter(
            (el) => !isInsideFooter(el)
        );

        return nodes.map((el) => {
            const tag = el.tagName.toLowerCase();
            const role = getAttr(el, "role");
            const id = getAttr(el, "id");
            const nameAttr = getAttr(el, "name");

            const placeholder = getAttr(el, "placeholder");
            const ariaLabel = getAttr(el, "aria-label");
            const labelText = inferLabelText(el);

            const text = elementText(el);

            const href = tag === "a" ? getAttr(el, "href") : null;

            const dataTestId = getAttr(el, "data-testid");
            const dataTest = getAttr(el, "data-test");
            const dataQa = getAttr(el, "data-qa");

            const typeAttr = tag === "input" ? getAttr(el, "type") : null;

            // "name" here = the old derivedName field you already used
            const derivedName = ariaLabel || labelText || text || placeholder || nameAttr || id || null;

            return {
                tag,
                role,
                id,

                name: derivedName,
                text,
                href,

                dataTestId,
                dataTest,
                dataQa,

                labelText,
                ariaLabel,
                placeholder,
                inputName: nameAttr,
                typeAttr,
                valueAttr: null,

                candidates: [],
                key: "",
            };
        });
    });

    return scanned as ScannedElement[];
}