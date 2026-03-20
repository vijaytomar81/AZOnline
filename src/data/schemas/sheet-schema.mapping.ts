// src/data/input-data-schema/sheet-schema.mapping.ts

function normKey(value: string): string {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/[^\w]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

const sheetToSchema: Record<string, string> = {
    master_template: "master",
    master: "master",

    direct: "direct",
    flownb: "direct",
    ferrynb: "direct",
    ferrydriveawayplusannual: "direct",
    ferrydriveawayannualnb: "direct",
    ferrydriveawayonlynb: "direct",
    agentportal_driveawayplusannual: "direct",
    agentportal_driveawayonly: "direct",
    agentportal_annual: "direct",
    motor_multipolicy: "direct",

    cnf: "cnf",
    ctm: "ctm",
    goco: "goco",
    msm: "msm",
};

export function resolveSchemaFromSheet(sheetName: string): string | null {
    const normalized = normKey(sheetName);
    return sheetToSchema[normalized] ?? null;
}

export function listSheetSchemaMappings(): Array<{ sheet: string; schema: string }> {
    return Object.entries(sheetToSchema).map(([sheet, schema]) => ({ sheet, schema }));
}