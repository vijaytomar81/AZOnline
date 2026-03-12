// src/tools/page-scanner/scanner/domExtractors/selector.ts
// \src\tools\page-scanner\scanner\domExtractors\selector.ts

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