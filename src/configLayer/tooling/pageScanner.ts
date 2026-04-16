// src/configLayer/tooling/pageScanner.ts

export const PAGE_SCANNER_COMMANDS = {
    SCAN: "scan",
    HELP: "help",
} as const;

export type PageScannerCommand =
    typeof PAGE_SCANNER_COMMANDS[keyof typeof PAGE_SCANNER_COMMANDS];

export const SELECTOR_KINDS = {
    CSS: "css",
    ROLE: "role",
    TEXT: "text",
} as const;

export type SelectorKind =
    typeof SELECTOR_KINDS[keyof typeof SELECTOR_KINDS];

export const CONTROL_GROUP_TYPES = {
    RADIO: "radio-group",
    CHECKBOX: "checkbox-group",
} as const;

export type ControlGroupType =
    typeof CONTROL_GROUP_TYPES[keyof typeof CONTROL_GROUP_TYPES];

export const PAGE_DIFF_STATUSES = {
    ADDED: "added",
    REMOVED: "removed",
    UPDATED: "updated",
    UNCHANGED: "unchanged",
} as const;

export type PageDiffStatus =
    typeof PAGE_DIFF_STATUSES[keyof typeof PAGE_DIFF_STATUSES];

export const GROUP_KEY_PREFIXES = {
    RADIO: "groupRadio",
    CHECKBOX: "groupCheckbox",
} as const;

export type GroupKeyPrefix =
    typeof GROUP_KEY_PREFIXES[keyof typeof GROUP_KEY_PREFIXES];

export const PAGE_KEY_RULES = {
    SEGMENT_COUNT: 4,
    FORMAT_LABEL: "<platform>.<application>.<product>.<name>",
    PATTERN: /^[a-z0-9]+(?:\.[a-z0-9-]+){3}$/,
} as const;

export const PAGE_SCAN_OPERATIONS = {
    CREATED: "created",
    MERGED: "merged",
    UNCHANGED: "unchanged",
    FAILED: "failed",
} as const;

export type PageScanOperation =
    typeof PAGE_SCAN_OPERATIONS[keyof typeof PAGE_SCAN_OPERATIONS];
