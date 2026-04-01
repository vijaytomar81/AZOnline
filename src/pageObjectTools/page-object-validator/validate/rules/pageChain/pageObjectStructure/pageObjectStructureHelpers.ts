// src/pageObjectTools/page-object-validator/validate/rules/pageChain/pageObjectStructure/pageObjectStructureHelpers.ts

export function hasClickAliasKeyHelper(pageObjectTs: string): boolean {
    return pageObjectTs.includes(
        `protected async clickAliasKey(aliasKey: keyof typeof aliases)`
    );
}

export function hasFillAliasKeyHelper(pageObjectTs: string): boolean {
    return pageObjectTs.includes(
        `protected async fillAliasKey(aliasKey: keyof typeof aliases, value: string)`
    );
}

export function hasSelectAliasKeyHelper(pageObjectTs: string): boolean {
    return pageObjectTs.includes(
        `protected async selectAliasKey(aliasKey: keyof typeof aliases, value: string)`
    );
}

export function hasSetCheckedAliasKeyHelper(pageObjectTs: string): boolean {
    return pageObjectTs.includes(
        `protected async setCheckedAliasKey(aliasKey: keyof typeof aliases, checked: boolean = true)`
    );
}
