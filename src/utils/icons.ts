// src/utils/icons.ts

export const ICONS = {
    headerCheckIcon: "📦",
    typecheckIcon: "🧠",
    toolsBuildIcon: "🛠",

    pageScannerIcon: "🛰",
    elementsGeneratorIcon: "⚙️",

    validateIcon: "🔍",
    repairIcon: "🔧",
    doctorIcon: "🩺",

    dataBuilderIcon: "🧾",

    caseRunnerIcon: "🚀",
    selfHealIcon: "🧬",
    locatorEngineIcon: "🎯",
} as const;

export type IconKey = keyof typeof ICONS;