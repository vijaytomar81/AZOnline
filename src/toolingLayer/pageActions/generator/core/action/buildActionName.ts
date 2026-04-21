// src/toolingLayer/pageActions/generator/core/action/buildActionName.ts

import type { PageObjectManifestPage } from "../../manifest/types";
import type { ActionNaming } from "../../shared/types";
import { toPascalCase } from "../../shared/naming";

export function buildActionName(
    page: PageObjectManifestPage
): ActionNaming {
    const { platform, application, product, name } = page.scope;
    const namePascal = toPascalCase(name);
    const prefix = product === "common" ? "handle" : "fill";
    const actionName = `${prefix}${namePascal}Action`;
    const actionFileName = `${prefix}${namePascal}.action.ts`;
    const actionSlug = `${prefix}-${name}`;
    const actionKey =
        `${platform}.${application}.${product}.${actionSlug}.action`;

    return {
        actionName,
        actionFileName,
        actionKey,
        actionSlug,
    };
}
