// src/executionLayer/logging/e2eScenario/getTreeTokens.ts

export function getTreeTokens(index: number, total: number) {
    const isLast = index === total - 1;

    return {
        branch: isLast ? "└─" : "├─",
        indent: isLast ? "   " : "│  ",
    };
}
