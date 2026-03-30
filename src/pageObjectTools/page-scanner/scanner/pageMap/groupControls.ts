// src/pageObjectTools/page-scanner/scanner/pageMap/groupControls.ts

import { uniq } from "@utils/collections";
import type { PageMap, PageMapElementEntry, ScannedElement } from "../types";

type BuiltElementRecord = {
    key: string;
    type: string;
    element: ScannedElement;
    entry: PageMapElementEntry;
};

type GroupBucket = {
    groupType: "radio-group" | "checkbox-group";
    key: string;
    inputName?: string | null;
    ownerLabelText?: string | null;
    ownerAriaLabel?: string | null;
    ownerId?: string | null;
    options: Record<string, string>;
};

function clean(value?: string | null): string | undefined {
    const v = value?.replace(/\s+/g, " ").trim();
    return v ? v : undefined;
}

function toPascalFromText(value: string): string {
    return value
        .replace(/[^a-zA-Z0-9]+/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
}

function getGroupId(el: ScannedElement): string | undefined {
    return (
        clean(el.inputName) ||
        clean(el.ownerLabelText) ||
        clean(el.ownerAriaLabel) ||
        clean(el.ownerId)
    );
}

function getGroupKeyPrefix(type: string): "groupRadio" | "groupCheckbox" | undefined {
    if (type === "radio") return "groupRadio";
    if (type === "checkbox") return "groupCheckbox";
    return undefined;
}

function getOptionLabel(el: ScannedElement): string | undefined {
    return clean(el.labelText) || clean(el.name) || clean(el.text);
}

function stripLeadingGroupControlWord(value: string): string {
    return value.replace(/^(groupRadio|groupCheckbox|radio|checkbox)/i, "");
}

function buildGroupKey(type: string, el: ScannedElement): string | undefined {
    const prefix = getGroupKeyPrefix(type);
    const groupId = getGroupId(el);

    if (!prefix || !groupId) return undefined;

    const base = stripLeadingGroupControlWord(toPascalFromText(groupId));
    return `${prefix}${base}`;
}

export function appendGroupedRadioCheckboxEntries(
    pageMap: PageMap,
    builtElements: BuiltElementRecord[]
): void {
    const buckets = new Map<string, GroupBucket>();

    for (const item of builtElements) {
        if (item.type !== "radio" && item.type !== "checkbox") {
            continue;
        }

        const groupKey = buildGroupKey(item.type, item.element);
        const optionLabel = getOptionLabel(item.element);

        if (!groupKey || !optionLabel) {
            continue;
        }

        const groupType = item.type === "radio" ? "radio-group" : "checkbox-group";

        let bucket = buckets.get(groupKey);
        if (!bucket) {
            bucket = {
                groupType,
                key: groupKey,
                inputName: item.element.inputName ?? null,
                ownerLabelText: item.element.ownerLabelText ?? null,
                ownerAriaLabel: item.element.ownerAriaLabel ?? null,
                ownerId: item.element.ownerId ?? null,
                options: {},
            };
            buckets.set(groupKey, bucket);
        }

        bucket.options[optionLabel] = item.key;
    }

    for (const bucket of buckets.values()) {
        const optionKeys = Object.keys(bucket.options);
        if (optionKeys.length < 2) continue;

        pageMap.elements[bucket.key] = {
            type: bucket.groupType,
            preferred: "",
            fallbacks: [],
            options: Object.fromEntries(
                uniq(optionKeys).map((label) => [label, bucket.options[label]])
            ),
            meta: {
                inputName: bucket.inputName,
                ownerLabelText: bucket.ownerLabelText,
                ownerAriaLabel: bucket.ownerAriaLabel,
                ownerId: bucket.ownerId,
            },
        };
    }
}