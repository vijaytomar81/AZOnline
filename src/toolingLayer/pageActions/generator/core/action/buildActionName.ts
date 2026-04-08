// src/toolingLayer/pageActions/generator/core/action/buildActionName.ts

import type { PageObjectManifestPage } from "../../manifest/types";
import type { ActionNaming } from "../../shared/types";
import { toPascalCase } from "../../shared/naming";

export function buildActionName(
    page: PageObjectManifestPage
): ActionNaming {
    const namePascal = toPascalCase(page.name);
    const prefix = page.group === "common" ? "handle" : "fill";
    const actionName = `${prefix}${namePascal}Action`;
    const actionFileName = `${prefix}${namePascal}.action.ts`;

    const [platform, group] = page.pageKey.split(".");
    const actionNameKebab = `${prefix}-${page.name}`;
    const actionKey = `${platform}.${group}.${actionNameKebab}.action`;

    return {
        actionName,
        actionFileName,
        actionKey,
    };
}
