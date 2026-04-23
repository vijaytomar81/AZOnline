// src/toolingLayer/pageActions/generator/core/action/buildActionName.ts

import type { PageObjectManifestPage } from "../../manifest/types";
import type { ActionNaming } from "../../shared/types";
import {
    toCamelCase,
} from "../../shared/naming";

export function buildActionName(
    page: PageObjectManifestPage
): ActionNaming {
    const actionSlug = page.scope.name;
    const actionBase = toCamelCase(actionSlug);

    return {
        actionName: `${actionBase}Action`,
        actionFileName: `${actionBase}.action.ts`,
        actionKey: `${page.pageKey}.action`,
        actionSlug,
    };
}
