export const SCAN_SELECTOR = [
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

export function buildScanRoots(doc: Document): Element[] {
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