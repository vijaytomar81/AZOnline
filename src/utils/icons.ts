// src/utils/icons.ts

export const ICONS = {
    headerCheckIcon: "📦",
    typecheckIcon: "🧠",
    toolsBuildIcon: "🛠",

    pageScannerIcon: "🛰",
    elementsGeneratorIcon: "⚙️",

    validateIcon: "🔍",
    repairIcon: "🔧",

    dataBuilderIcon: "🧾",

    caseRunnerIcon: "🚀",
    selfHealIcon: "🧬",
    locatorEngineIcon: "🎯",
    doneIcon: "✅",

    // status icons (NEW)
    successIcon: "✔",
    failIcon: "✖",
    warningIcon: "⚠",
    addIcon: "+",
    hintIcon: "ℹ",
} as const;

export type IconKey = keyof typeof ICONS;