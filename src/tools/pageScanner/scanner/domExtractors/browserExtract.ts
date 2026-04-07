// src/tools/pageScanner/scanner/domExtractors/browserExtract.ts

type BrowserExtractArgs = {
    selector: string;
};

export function browserExtractDomElements({ selector }: BrowserExtractArgs) {
    // --------------------------------------------------
    // Section 1: generic DOM helpers
    // --------------------------------------------------

    function getAttr(el: Element | null | undefined, name: string): string | null {
        if (!el) return null;
        const v = el.getAttribute(name);
        return v && v.trim() ? v.trim() : null;
    }

    function safeText(s: string | null | undefined): string | null {
        const t = (s ?? "").replace(/\s+/g, " ").trim();
        return t ? t : null;
    }

    function isGenericContainerId(value: string | null): boolean {
        if (!value) return false;
        return /^(root|app|main|container|wrapper|content|page|section|panel)$/i.test(value);
    }

    function isReactSelectInputId(value: string | null): boolean {
        if (!value) return false;
        return /^react-select-\d+-input$/i.test(value);
    }

    // --------------------------------------------------
    // Section 2: label + text extraction
    // --------------------------------------------------

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
            const byFor = labelFromForId(id);
            if (byFor) return byFor;
        }

        const byAria = labelFromAriaLabelledBy(el);
        if (byAria) return byAria;

        const byWrap = labelFromWrap(el);
        if (byWrap) return byWrap;

        return null;
    }

    function extractElementText(el: Element): string | null {
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

    // --------------------------------------------------
    // Section 3: visibility + structural filters
    // --------------------------------------------------

    function isInsideFooter(el: Element): boolean {
        const tag = el.tagName.toLowerCase();
        if (tag === "footer") return true;
        return Boolean(el.closest("footer"));
    }

    function hasNonZeroRect(el: Element): boolean {
        const rect = (el as HTMLElement).getBoundingClientRect();
        return rect.width > 0 || rect.height > 0;
    }

    function getAssociatedLabel(el: Element): Element | null {
        const id = getAttr(el, "id");
        if (!id) return null;
        return document.querySelector(`label[for='${CSS.escape(id)}']`);
    }

    function isElementStyleVisible(el: Element): boolean {
        const htmlEl = el as HTMLElement;
        const style = window.getComputedStyle(htmlEl);

        if (style.display === "none" || style.visibility === "hidden") {
            return false;
        }

        if (htmlEl.hidden) return false;
        if (htmlEl.getAttribute("aria-hidden") === "true") return false;

        return true;
    }

    function isVisible(el: Element): boolean {
        if (!isElementStyleVisible(el)) return false;

        if (hasNonZeroRect(el)) return true;

        const tag = el.tagName.toLowerCase();
        const type = (getAttr(el, "type") || "").toLowerCase();

        // Custom radios/checkboxes are often visually hidden while their label is visible and clickable.
        if (tag === "input" && (type === "radio" || type === "checkbox")) {
            const explicitLabel = getAssociatedLabel(el);
            if (explicitLabel && isElementStyleVisible(explicitLabel) && hasNonZeroRect(explicitLabel)) {
                return true;
            }

            const wrappedLabel = el.closest("label");
            if (wrappedLabel && isElementStyleVisible(wrappedLabel) && hasNonZeroRect(wrappedLabel)) {
                return true;
            }

            const customControl =
                el.closest(".custom-control") ||
                el.closest(".falcon-custom-radio") ||
                el.closest(".input-group");

            if (customControl && isElementStyleVisible(customControl) && hasNonZeroRect(customControl)) {
                return true;
            }
        }

        return false;
    }

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

    function isNestedInteractiveDuplicate(el: Element): boolean {
        if (!isInteractive(el)) return false;

        let parent = el.parentElement;
        while (parent) {
            if (isInteractive(parent)) return true;
            parent = parent.parentElement;
        }

        return false;
    }

    // --------------------------------------------------
    // Section 4: owner context
    // --------------------------------------------------

    function isMeaningfulOwnerId(value: string | null): boolean {
        if (!value) return false;
        if (isReactSelectInputId(value)) return false;
        if (/^\d+$/.test(value)) return false;
        if (isGenericContainerId(value)) return false;
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
        const isFrameworkSearchInput = isReactSelectInputId(id);

        const formGroup = el.closest(".form-group");
        const inputGroup = el.closest(".input-group");

        let ownerId: string | null = null;
        let ownerLabelText: string | null = null;
        let ownerAriaLabel: string | null = null;
        let ownerGroupLabelFor: string | null = null;

        let cur: Element | null = el.parentElement;
        while (cur) {
            const curId = getAttr(cur, "id");
            if (isMeaningfulOwnerId(curId)) {
                ownerId = curId;
                break;
            }
            cur = cur.parentElement;
        }

        if (formGroup) {
            const label = formGroup.querySelector("label");
            ownerLabelText = safeText(label?.textContent ?? null);
            ownerGroupLabelFor = safeText(getAttr(label, "for"));
        }

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

    // --------------------------------------------------
    // Section 5: scan roots
    // --------------------------------------------------

    function buildScanRoots(doc: Document): Element[] {
        const roots = [
            doc.querySelector("#root"),
            ...Array.from(
                doc.querySelectorAll("[role='dialog'], .modal-dialog, .modal, .modal-content")
            ),
        ].filter(Boolean) as Element[];

        if (roots.length === 0) {
            roots.push(doc.body);
        }

        return roots;
    }

    // --------------------------------------------------
    // Section 6: element serialization
    // --------------------------------------------------

    function serializeElement(el: Element) {
        const tag = el.tagName.toLowerCase();
        const role = getAttr(el, "role");
        const id = getAttr(el, "id");
        const nameAttr = getAttr(el, "name");

        const placeholder = getAttr(el, "placeholder");
        const ariaLabel = getAttr(el, "aria-label");
        const labelText = inferLabelText(el);
        const text = extractElementText(el);

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
    }

    // --------------------------------------------------
    // Section 7: main extraction flow
    // --------------------------------------------------

    const roots = buildScanRoots(document);
    const seen = new Set<Element>();
    const nodes: Element[] = [];

    for (const root of roots) {
        const found = Array.from(root.querySelectorAll(selector)).filter(
            (node) =>
                node instanceof Element &&
                !isInsideFooter(node) &&
                isVisible(node) &&
                !isNestedInteractiveDuplicate(node)
        ) as Element[];

        for (const el of found) {
            if (seen.has(el)) continue;
            seen.add(el);
            nodes.push(el);
        }
    }

    return nodes.map((el) => serializeElement(el));
}