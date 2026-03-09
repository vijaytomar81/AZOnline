// src/utils/icons.ts

export const ICONS = {
    headerCheckIcon: "📦",
    typecheckIcon: "🧠",
    toolsBuildIcon: "🛠",

    pageScannerIcon: "🛰",
    elementsGeneratorIcon: "⚙️",

    validateIcon: "🔍",
    repairIcon: "🔧",
    doctorIcon: "🧪",

    dataBuilderIcon: "🧾",

    caseRunnerIcon: "🚀",
    selfHealIcon: "🧬",
    locatorEngineIcon: "🎯",

    // status icons (NEW)
    successIcon: "✓",
    warningIcon: "⚠️",
    failIcon: "❌",
    addIcon: "➕",
    hintIcon: "💡",
    doneIcon: "✅",
} as const;

export type IconKey = keyof typeof ICONS;