// src/utils/cliTree.ts
import { success, warning, failure } from "./cliFormat";

export type TreeStep = {
    icon: string;
    title: string;
    summary?: string;
};

function formatIcon(icon: string): string {
    if (icon === "✔") {
        return `${success(icon)} `;
    }

    if (icon === "⚠") {
        return `${warning(icon)} `;
    }

    if (icon === "✖") {
        return `${failure(icon)} `;
    }

    return `${icon} `;
}

export function printTree(steps: TreeStep[]) {
    steps.forEach((step, i) => {
        const last = i === steps.length - 1;
        const branch = last ? "└─" : "├─";
        const icon = formatIcon(step.icon);

        if (step.summary) {
            console.log(`${branch} ${icon}${step.title} : ${step.summary}`);
        } else {
            console.log(`${branch} ${icon}${step.title}`);
        }
    });
}