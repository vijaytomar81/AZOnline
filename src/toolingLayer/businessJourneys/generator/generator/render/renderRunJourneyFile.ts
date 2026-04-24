// src/toolingLayer/businessJourneys/generator/generator/render/renderRunJourneyFile.ts

import { toRepoRelative } from "@utils/paths";
import { toCamelCase } from "@toolingLayer/pageActions/generator/shared/naming";
import type { JourneyTarget, PageActionEntry } from "../types";
import { buildJourneyExportName } from "../journey/journeyNaming";

function toRegistryKey(value: string): string {
    return value.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function buildActionAlias(entry: PageActionEntry): string {
    const product = toRegistryKey(entry.scope.product);
    const member = toCamelCase(entry.scope.name);

    return `actions.${product}.${member}`;
}

function buildExampleActions(entries: PageActionEntry[]): string[] {
    return entries.slice(0, 2).map((entry) => buildActionAlias(entry));
}

function buildJourneyLabel(target: JourneyTarget): string {
    if ("subType" in target.journeyContext) {
        return `${target.journeyContext.type} / ${target.journeyContext.subType}`;
    }

    return target.journeyContext.type;
}

function renderExampleBlock(actions: string[]): string {
    if (actions.length === 0) {
        return `            // No pageActions are currently available for this route.`;
    }

    const first = actions[0];

    return `            // Example:
            // async () => {
            //     await ${first}({
            //         context: context.pageActionContext,
            //         payload,
            //     });
            // },`;
}

function renderGuidanceBlock(actions: string[]): string {
    const examples =
        actions.length > 0
            ? actions.map((action) => `     // ${action}`).join("\n")
            : "     // No examples available yet.";

    return `    /*
     ---------------------------------------------------------------------------
     QA GUIDANCE
     ---------------------------------------------------------------------------
     This generated runner is intentionally a skeleton.

     PageActions are reusable and may apply to NewBusiness, Renewal, MTC, or MTA.
     The generator does not know the correct business sequence for this journey.

     QA should:
     - add only the pageActions required for this journey
     - order the steps according to the real user flow
     - keep route-specific conditions inside this runner
     - use pageActionsRegistry autocomplete via the "actions" variable

     Example available actions:
${examples}

     To explore all available actions, type:
     actions.
    */`;
}

export function renderRunJourneyFile(args: {
    filePath: string;
    target: JourneyTarget;
    entries: PageActionEntry[];
}): string {
    const exportName = buildJourneyExportName(args.target.journeyContext);
    const platform = toRegistryKey(String(args.target.platform));
    const application = toRegistryKey(String(args.target.application));
    const journeyLabel = buildJourneyLabel(args.target);
    const exampleActions = buildExampleActions(args.entries);

    return `// ${toRepoRelative(args.filePath)}

import { pageActionsRegistry } from "@businessLayer/pageActions";
import {
    runJourney,
    type BusinessJourney,
} from "@businessLayer/businessJourneys/framework";

export const ${exportName}: BusinessJourney = async ({
    context,
    payload,
}) => {
    const actions = pageActionsRegistry.${platform}.${application};

    await runJourney({
        steps: [
            // TODO: QA to add ${journeyLabel} journey sequence.
${renderExampleBlock(exampleActions)}
        ],
    });

${renderGuidanceBlock(exampleActions)}

    void actions;
    void context;
    void payload;
};
`;
}
