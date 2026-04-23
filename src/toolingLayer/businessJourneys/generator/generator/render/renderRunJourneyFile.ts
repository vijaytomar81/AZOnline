// src/toolingLayer/businessJourneys/generator/generator/render/renderRunJourneyFile.ts

import { toRepoRelative } from "@utils/paths";
import { toCamelCase } from "@toolingLayer/pageActions/generator/shared/naming";
import type { JourneyTarget, PageActionEntry } from "../types";

function toRegistryKey(value: string): string {
    return value.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function buildActionAccess(
    target: JourneyTarget,
    entry: PageActionEntry
): string {
    const platform = toRegistryKey(String(target.platform));
    const application = toRegistryKey(String(target.application));
    const product = toRegistryKey(entry.scope.product);
    const member = toCamelCase(entry.scope.name);

    return `pageActionsRegistry.${platform}.${application}.${product}.${member}`;
}

function buildDraftSteps(
    target: JourneyTarget,
    entries: PageActionEntry[]
): string[] {
    return entries.map((entry) => {
        const access = buildActionAccess(target, entry);

        return `        async () => {
            await ${access}({
                context: context.pageActionContext,
                payload,
            });
        },`;
    });
}

function buildExtraAvailableActions(
    target: JourneyTarget,
    entries: PageActionEntry[]
): string[] {
    const used = new Set(entries.map((entry) => buildActionAccess(target, entry)));
    const all = entries.map((entry) => buildActionAccess(target, entry));

    return all.filter((item, index) => !used.has(item) && all.indexOf(item) === index);
}

export function renderRunJourneyFile(args: {
    filePath: string;
    target: JourneyTarget;
    entries: PageActionEntry[];
}): string {
    const draftSteps = buildDraftSteps(args.target, args.entries);
    const extraAvailableActions = buildExtraAvailableActions(
        args.target,
        args.entries
    );
    const journeyName = String(args.target.journeyType);

    const extraBlock =
        extraAvailableActions.length > 0
            ? `

    /*
     ---------------------------------------------------------------------------
     ADDITIONAL AVAILABLE PAGE ACTIONS FOR THIS JOURNEY
     ---------------------------------------------------------------------------
${extraAvailableActions.map((item) => `     ${item}`).join("\n")}
    */`
            : "";

    return `// ${toRepoRelative(args.filePath)}

import { pageActionsRegistry } from "@businessLayer/pageActions";
import {
    runJourney,
    type BusinessJourney,
} from "@businessLayer/businessJourneys/framework";

export const run${journeyName}Journey: BusinessJourney = async ({
    context,
    payload,
}) => {
    await runJourney({
        steps: [
${draftSteps.length > 0 ? draftSteps.join("\n") : `            async () => {
                // TODO: no pageActions were matched for this journey yet
            },`}
        ],
    });${extraBlock}
};
`;
}
