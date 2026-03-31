// src/evidence/artifacts/excel/buildExecutionExcelRows.ts

import { EXECUTION_EXCEL_COLUMNS } from "./executionExcelColumns";

type EvidenceCase = Record<string, unknown>;
type EvidenceCases = Record<string, EvidenceCase>;
type EvidenceFile = {
    runId: string;
    cases: EvidenceCases;
};

type EvidenceItemResult = {
    itemNo: number;
    action: string;
    testCaseRef: string;
    status: string;
    startedAt: string;
    finishedAt: string;
    errorDetails: string;
    outputs: Record<string, unknown>;
};

export type SummaryRow = {
    Field: string;
    Value: string | number;
};

export type ExecutionCaseRow = Record<string, string | number>;

export type BuildExecutionExcelRowsInput = {
    runId: string;
    metadata: Record<string, unknown>;
    passedEvidence: EvidenceFile;
    failedEvidence?: EvidenceFile;
};

function getString(value: unknown): string {
    return String(value ?? "");
}

function getNumberOrBlank(value: unknown): number | string {
    if (typeof value === "number") {
        return value;
    }

    const text = String(value ?? "").trim();
    if (!text) {
        return "";
    }

    const parsed = Number(text);
    return Number.isFinite(parsed) ? parsed : text;
}

function createSummaryRow(
    field: string,
    value: string | number
): SummaryRow {
    return {
        Field: field,
        Value: value,
    };
}

function asRecord(value: unknown): Record<string, unknown> {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value as Record<string, unknown>;
    }

    return {};
}

function asItemResults(value: unknown): EvidenceItemResult[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value as EvidenceItemResult[];
}

function buildItemRow(
    scenarioId: string,
    scenario: EvidenceCase,
    item: EvidenceItemResult
): ExecutionCaseRow {
    const row: ExecutionCaseRow = {};

    EXECUTION_EXCEL_COLUMNS.forEach((column) => {
        if (column.kind === "scenario") {
            const value =
                column.sourceKey === "scenarioId"
                    ? scenario.scenarioId ?? scenarioId
                    : scenario[column.sourceKey];

            row[column.header] = getString(value);
            return;
        }

        if (column.kind === "item") {
            const value = (item as unknown as Record<string, unknown>)[column.sourceKey];

            row[column.header] =
                column.sourceKey === "itemNo"
                    ? getNumberOrBlank(value)
                    : getString(value);

            return;
        }

        const outputs = asRecord(item.outputs);
        row[column.header] = getString(outputs[column.sourceKey]);
    });

    return row;
}

function buildRowsFromCases(cases: EvidenceCases): ExecutionCaseRow[] {
    const rows: ExecutionCaseRow[] = [];

    Object.entries(cases).forEach(([scenarioId, scenario]) => {
        const itemResults = asItemResults(scenario.itemResults);

        itemResults.forEach((item) => {
            rows.push(buildItemRow(scenarioId, scenario, item));
        });
    });

    return rows;
}

// src/evidence/artifacts/excel/buildExecutionExcelRows.ts

export function buildExecutionExcelRows(
    input: BuildExecutionExcelRowsInput
): {
    summaryRows: SummaryRow[];
    passedRows: ExecutionCaseRow[];
    failedRows: ExecutionCaseRow[];
    notExecutedRows: ExecutionCaseRow[];
} {
    const allCases = {
        ...(input.passedEvidence?.cases ?? {}),
        ...(input.failedEvidence?.cases ?? {}),
    };

    const allRows = buildRowsFromCases(allCases);

    const passedRows = allRows.filter(
        (row) => getString(row["Item Status"]).toLowerCase() === "passed"
    );

    const failedRows = allRows.filter(
        (row) => getString(row["Item Status"]).toLowerCase() === "failed"
    );

    const notExecutedRows = allRows.filter(
        (row) => getString(row["Item Status"]).toLowerCase() === "not_executed"
    );

    const totalItems = allRows.length;
    const passedCount = passedRows.length;
    const failedCount = failedRows.length;
    const notExecutedCount = notExecutedRows.length;
    const passRate =
        totalItems > 0 ? `${((passedCount / totalItems) * 100).toFixed(2)}%` : "0%";

    // ✅ Extract runtime safely
    const runtimeInfo = (input.metadata.runtimeInfo ?? {}) as Record<string, any>;
    const system = runtimeInfo.system ?? {};
    const browser = runtimeInfo.browser ?? {};

    const summaryRows: SummaryRow[] = [
        createSummaryRow("Run Id", input.runId),

        createSummaryRow("Mode", getString(input.metadata.mode)),
        createSummaryRow("Environment", getString(input.metadata.environment)),

        // =============================
        // 🖥 SYSTEM INFO
        // =============================
        createSummaryRow("Machine Name", getString(system.machineName)),
        createSummaryRow("User", getString(system.user)),
        createSummaryRow("Platform", getString(system.platform)),
        createSummaryRow("OS Version", getString(system.osVersion)),

        // =============================
        // 🌐 BROWSER INFO
        // =============================
        createSummaryRow("Browser", getString(browser.name)),
        createSummaryRow("Browser Channel", getString(browser.channel)),
        createSummaryRow("Browser Version", getString(browser.version)),
        createSummaryRow("Headless", getString(browser.headless)),

        // =============================
        // 📊 EXECUTION STATS
        // =============================
        createSummaryRow("Total Items", totalItems),
        createSummaryRow("Passed", passedCount),
        createSummaryRow("Failed", failedCount),
        createSummaryRow("Not Executed", notExecutedCount),
        createSummaryRow("Pass Rate (%)", passRate),

        // =============================
        // ⏱ TIMING
        // =============================
        createSummaryRow("Execution Time", getString(input.metadata.totalTime)),
        createSummaryRow("Started At", getString(input.metadata.startedAt)),
        createSummaryRow("Finished At", getString(input.metadata.finishedAt)),

        createSummaryRow(
            "Evidence Directory",
            getString(input.metadata.evidenceDir)
        ),
    ];

    return {
        summaryRows,
        passedRows,
        failedRows,
        notExecutedRows,
    };
}
