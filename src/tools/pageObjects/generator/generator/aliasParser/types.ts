// src/tools/pageObjects/generator/generator/aliasParser/types.ts
export type AliasPair = {
    aliasKey: string;
    elementKey: string;
};

export type AliasEntry = {
    rawLine: string;
    aliasKey: string | null;
    generatedKey: string | null;
};

export type AliasesObjectBody = {
    body: string;
    bodyStartIndex: number;
    bodyEndIndex: number;
};