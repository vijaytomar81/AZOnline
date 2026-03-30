// src/dataLayer/builder/core/schemaValidation/expandRepeatedGroupFields.ts

import type { RepeatedGroup } from "../../../data-definitions/types";
import { collectLeafExcelFields } from "./collectSchemaFields";

export function expandRepeatedGroupFields(
    rep: RepeatedGroup,
    outerPrefix = ""
): Set<string> {
    const expanded = new Set<string>();
    const leafFields = new Set<string>();

    expanded.add(`${outerPrefix}${rep.countField}`);
    collectLeafExcelFields(rep.groups, leafFields);

    for (let index = 1; index <= rep.max; index++) {
        const itemPrefix = `${outerPrefix}${rep.prefixBase}${index}`;

        for (const field of leafFields) {
            expanded.add(`${itemPrefix}${field}`);
        }
    }

    return expanded;
}

export function addFields(
    target: Set<string>,
    fields: Iterable<string>
): void {
    for (const field of fields) {
        target.add(field);
    }
}