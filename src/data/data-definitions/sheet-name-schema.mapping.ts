// src/data/data-definitions/sheet-name-schema.mapping.ts

import { normalizeSpaces, normalizeSheetKey } from "../../utils/text";

function normKey(value: string): string {
    return normalizeSheetKey(value);
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

    cnf_pcw_testtool: "cnf_pcw_testtool",
    cnfpcwtesttool: "cnf_pcw_testtool",

    ctm_pcw_testtool: "ctm_pcw_testtool",
    ctmpcwtesttool: "ctm_pcw_testtool",

    goco_pcw_testtool: "goco_pcw_testtool",
    gocopcwtesttool: "goco_pcw_testtool",

    msm_pcw_testtool: "msm_pcw_testtool",
    msmpcwtesttool: "msm_pcw_testtool",
};

export function resolveSchemaFromSheet(sheetName: string): string | null {
    const normalized = normKey(sheetName);
    return sheetToSchema[normalized] ?? null;
}

export function listSheetSchemaMappings(): Array<{ sheet: string; schema: string }> {
    return Object.entries(sheetToSchema).map(([sheet, schema]) => ({
        sheet,
        schema,
    }));
}