// src/executionLayer/runtime/itemData/resolve/resolveExecutionItemData.ts

import { AppError } from "@utils/errors";
import { normalizeSpaces } from "@utils/text";
import type { ExecutionItem } from "@frameworkCore/executionLayer/contracts";
import type {
    ExecutionItemDataDebugCollector,
    ExecutionItemDataRegistry,
    ResolvedExecutionItemData,
} from "../types";
import { findExecutionItemCase } from "./findExecutionItemCase";
import { findExecutionItemDataSource } from "./findExecutionItemDataSource";
import { emitResolverDebug } from "../utils/emitResolverDebug";
import { getOrLoadExecutionItemCasesFile } from "../utils/getOrLoadExecutionItemCasesFile";

export function resolveExecutionItemData(args: {
    registry: ExecutionItemDataRegistry;
    journey: string;
    item: ExecutionItem;
    logScope: string;
    debugCollector?: ExecutionItemDataDebugCollector;
}): ResolvedExecutionItemData {
    const testCaseRef = normalizeSpaces(args.item.testCaseRef);

    emitResolverDebug({
        message:
            `Resolving execution item data -> action=${args.item.action}, journey=${args.journey}, ` +
            `subType=${args.item.subType ?? ""}, testCaseRef=${testCaseRef}`,
        logScope: args.logScope,
        debugCollector: args.debugCollector,
    });

    const source = findExecutionItemDataSource({
        registry: args.registry,
        journey: args.journey,
        item: args.item,
    });

    if (!source) {
        throw new AppError({
            code: "EXECUTION_ITEM_DATA_SOURCE_NOT_FOUND",
            stage: "resolve-execution-item-data",
            source: "resolveExecutionItemData",
            message:
                `No execution item data source registered for action="${args.item.action}", ` +
                `journey="${args.journey}", subType="${args.item.subType ?? ""}".`,
            context: {
                action: args.item.action,
                journey: args.journey,
                subType: args.item.subType ?? "",
                testCaseRef,
            },
        });
    }

    emitResolverDebug({
        message:
            `Matched execution item data source -> action=${source.action}, ` +
            `journey=${source.journey ?? ""}, subType=${source.subType ?? ""}, ` +
            `sheet=${source.sheetName}, schema=${source.schemaName ?? ""}`,
        logScope: args.logScope,
        debugCollector: args.debugCollector,
    });

    const casesFile = getOrLoadExecutionItemCasesFile({
        registry: args.registry,
        source,
        logScope: args.logScope,
        debugCollector: args.debugCollector,
    });

    const hit = findExecutionItemCase({
        casesFile,
        testCaseRef,
    });

    if (!hit) {
        throw new AppError({
            code: "EXECUTION_ITEM_TEST_CASE_NOT_FOUND",
            stage: "resolve-execution-item-data",
            source: "resolveExecutionItemData",
            message:
                `TestCaseRef "${testCaseRef}" not found in sheet "${source.sheetName}" ` +
                `for action "${args.item.action}".`,
            context: {
                testCaseRef,
                action: args.item.action,
                sheetName: source.sheetName,
                schemaName: source.schemaName ?? "",
            },
        });
    }

    emitResolverDebug({
        message: `Resolved test case -> scriptId=${hit.scriptId ?? ""}, scriptName=${hit.scriptName}`,
        logScope: args.logScope,
        debugCollector: args.debugCollector,
    });

    return {
        testCaseRef,
        payload: hit.data,
        source,
        sourceFileSheet: casesFile.sheet,
    };
}
