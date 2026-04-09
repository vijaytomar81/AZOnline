// src/frameworkCore/executionLayer/runtime/itemData/resolve/resolveExecutionItemData.ts

import { AppError } from "@utils/errors";
import { normalizeSpaces } from "@utils/text";
import type {
    ExecutionItem,
    ExecutionScenario,
} from "@frameworkCore/executionLayer/contracts";
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
    scenario: ExecutionScenario;
    item: ExecutionItem;
    logScope: string;
    debugCollector?: ExecutionItemDataDebugCollector;
}): ResolvedExecutionItemData {
    const testCaseRef = normalizeSpaces(args.item.testCaseRef);

    const source = findExecutionItemDataSource({
        registry: args.registry,
        item: args.item,
    });

    if (!source) {
        throw new AppError({
            code: "EXECUTION_ITEM_DATA_SOURCE_NOT_FOUND",
            stage: "resolve-execution-item-data",
            source: "resolveExecutionItemData",
            message: `No data source found for action="${args.item.action}" subType="${args.item.subType ?? ""}".`,
            context: {
                action: args.item.action,
                subType: args.item.subType ?? "",
                testCaseRef,
            },
        });
    }

    const casesFile = getOrLoadExecutionItemCasesFile({
        registry: args.registry,
        scenario: args.scenario,
        source,
        item: args.item,
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
            message: `TestCaseRef "${testCaseRef}" not found for action="${args.item.action}".`,
            context: {
                testCaseRef,
                action: args.item.action,
                subType: args.item.subType ?? "",
            },
        });
    }

    return {
        testCaseRef,
        payload: hit.data,
        source,
    };
}
