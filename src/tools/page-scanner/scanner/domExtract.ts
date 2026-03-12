// src/tools/page-scanner/scanner/domExtract.ts

import type { Page } from "@playwright/test";
import type { ScannedElement } from "./types";

/**
 * Extracts relevant elements from the currently loaded page.
 *
 * Rules:
 *  - Scan inside #root
 *  - Also scan visible dialogs / modals rendered outside #root
 *  - Exclude anything inside <footer>
 *  - Include interactive elements + alerts / important messages
 */
export async function extractDomElements(page: Page): Promise<ScannedElement[]> {
    const scanned = await page.evaluate(() => {
        function getAttr(el: Element, name: string): string | null {
            const v = el.getAttribute(name);
            return v && v.trim() ? v.trim() : null;
        }

        function safeText(s: string | null | undefined): string | null {
            const t = (s ?? "").replace(/\s+/g, " ").trim();
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
            const role = getAttr(el, "role");

            if (
                tag === "button" ||
                tag === "a" ||
                role === "alert" ||
                role === "dialog"
            ) {
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

        function isInsideFooter(el: Element): boolean {
            const tag = el.tagName.toLowerCase();
            if (tag === "footer") return true;
            return Boolean(el.closest("footer"));
        }

        function isVisible(el: Element): boolean {
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

        function isMeaningfulOwnerId(value: string | null): boolean {
            if (!value) return false;
            if (/^react-select-\d+-input$/i.test(value)) return false;
            if (/^\d+$/.test(value)) return false;
            return true;
        }

        function resolveOwnerContext(el: Element): {
            ownerId: string | null;
            ownerLabelText: string | null;
            ownerAriaLabel: string | null;
            ownerGroupLabelFor: string | null;
            isFrameworkSearchInput: boolean;
        } {
            const id = getAttr(el, "id");
            const isFrameworkSearchInput = !!id && /^react-select-\d+-input$/i.test(id);

            const formGroup = el.closest(".form-group");
            const inputGroup = el.closest(".input-group");

            let ownerId: string | null = null;
            let ownerLabelText: string | null = null;
            let ownerAriaLabel: string | null = null;
            let ownerGroupLabelFor: string | null = null;

            // 1) nearest meaningful ancestor id
            let cur: Element | null = el.parentElement;
            while (cur) {
                const curId = getAttr(cur, "id");
                if (isMeaningfulOwnerId(curId)) {
                    ownerId = curId;
                    break;
                }
                cur = cur.parentElement;
            }

            // 2) enclosing form-group label
            if (formGroup) {
                const label = formGroup.querySelector("label");
                ownerLabelText = safeText(label?.textContent ?? null);
                ownerGroupLabelFor = safeText(getAttr(label as Element, "for"));
            }

            // 3) enclosing input-group aria-label
            if (inputGroup) {
                ownerAriaLabel = safeText(getAttr(inputGroup, "aria-label"));
            }

            return {
                ownerId,
                ownerLabelText,
                ownerAriaLabel,
                ownerGroupLabelFor,
                isFrameworkSearchInput,
            };
        }

        const roots = [
            document.querySelector("#root"),
            ...Array.from(
                document.querySelectorAll(
                    "[role='dialog'], .modal-dialog, .modal, .modal-content"
                )
            ),
        ].filter(Boolean) as Element[];

        if (roots.length === 0) {
            roots.push(document.body);
        }

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
            "[role='alert']",
            "[role='dialog']",
            ".invalid-feedback",
            "[aria-live]",
            "[data-testid]",
            "[data-test]",
            "[data-qa]",
        ].join(",");

        const seen = new Set<Element>();
        const nodes: Element[] = [];

        for (const root of roots) {
            const found = Array.from(root.querySelectorAll(selector)).filter(
                (el) => !isInsideFooter(el) && isVisible(el)
            );

            for (const el of found) {
                if (seen.has(el)) continue;
                seen.add(el);
                nodes.push(el);
            }
        }

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

            const owner = resolveOwnerContext(el);

            const derivedName =
                ariaLabel ||
                labelText ||
                text ||
                placeholder ||
                nameAttr ||
                id ||
                owner.ownerLabelText ||
                owner.ownerAriaLabel ||
                owner.ownerGroupLabelFor ||
                null;

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

                ownerId: owner.ownerId,
                ownerLabelText: owner.ownerLabelText,
                ownerAriaLabel: owner.ownerAriaLabel,
                ownerGroupLabelFor: owner.ownerGroupLabelFor,
                isFrameworkSearchInput: owner.isFrameworkSearchInput,

                candidates: [],
                key: "",
            };
        });
    });

    return scanned as ScannedElement[];
}