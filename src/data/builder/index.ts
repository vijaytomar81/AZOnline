// src/data/builder/index.ts

import { runDataBuilder } from "./app/runDataBuilder";
import { buildRawFailureContext } from "./app/buildFailureContext";
import { printBuilderFailure } from "./app/printBuilderFailure";

runDataBuilder().catch((error: unknown) => {
    printBuilderFailure({
        raw: buildRawFailureContext(),
        error,
        logScope: "data-builder",
    });
});