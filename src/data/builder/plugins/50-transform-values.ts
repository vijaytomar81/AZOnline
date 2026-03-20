// src/data/builder/plugins/50-transform-values.ts
import type { PipelinePlugin } from "../core/pipeline";
import type { DataBuilderContext } from "../types";

function toNumberIfPossible(value: string): string | number {
    const trimmed = value.trim();
    if (trimmed === "") return "";
    if (!/^-?\d+$/.test(trimmed)) return trimmed;

    const parsed = Number(trimmed);
    return Number.isSafeInteger(parsed) ? parsed : trimmed;
}

function transformNode(node: any, parentKey = ""): any {
    if (Array.isArray(node)) {
        return node.map((item) => transformNode(item));
    }

    if (!node || typeof node !== "object") {
        if (typeof node === "string") {
            if (parentKey === "count" || parentKey.endsWith("Count")) {
                return toNumberIfPossible(node);
            }
            return node.trim();
        }
        return node;
    }

    const out: Record<string, any> = {};
    for (const [key, value] of Object.entries(node)) {
        if (typeof value === "string") {
            if (key === "count" || key.endsWith("Count")) {
                out[key] = toNumberIfPossible(value);
            } else {
                out[key] = value.trim();
            }
            continue;
        }

        out[key] = transformNode(value, key);
    }
    return out;
}

const plugin: PipelinePlugin = {
    name: "transform-values",
    order: 50,
    requires: ["casesFile"],

    run: async (ctx: DataBuilderContext) => {
        const casesFile = ctx.data.casesFile;
        if (!casesFile) {
            throw new Error("casesFile missing. build-cases must run before transform-values.");
        }

        let transformed = 0;

        casesFile.cases = casesFile.cases.map((builtCase) => {
            transformed++;
            return {
                ...builtCase,
                data: transformNode(builtCase.data),
            };
        });

        ctx.data.casesFile = {
            ...casesFile,
            caseCount: Number(casesFile.caseCount),
        };

        ctx.log.info(`Value transformation applied to ${transformed} case(s).`);
        ctx.log.debug?.("Transforms: trim strings, convert count/count-like values to numbers.");
    },
};

export default plugin;