// src/pageObjectTools/page-object-repair/repair/shared/pageObjectReadiness.ts

const READINESS_DECLARATION = "const readinessLocators: Locator[] =";
const WAIT_FOR_STANDARD_READY_CALL = "await this.waitForStandardReady({";

function uniqueAliasKeys(aliasKeys: string[]): string[] {
    return [...new Set(aliasKeys.filter((key) => key.trim().length > 0))];
}

function buildEmptyReadinessBlock(): string {
    return `    const readinessLocators: Locator[] = [];\n\n`;
}

function buildLocatorLine(aliasKey: string): string {
    return `      this.resolveAliasLocator(aliases, elements, aliasKeys.${aliasKey}).then((result) => result.locator),`;
}

function buildMappedReadinessBlock(aliasKeys: string[]): string {
    const lines = [
        `    const readinessLocators: Locator[] = await Promise.all([`,
        ...aliasKeys.map((aliasKey) => buildLocatorLine(aliasKey)),
        `    ]);`,
        ``,
    ];

    return `${lines.join("\n")}\n`;
}

export function buildReadinessBlock(aliasKeys: string[]): string {
    const uniqueKeys = uniqueAliasKeys(aliasKeys);

    if (uniqueKeys.length === 0) {
        return buildEmptyReadinessBlock();
    }

    return buildMappedReadinessBlock(uniqueKeys);
}

export function extractReadinessAliasKeys(pageTs: string): string[] {
    const waitCallIndex = pageTs.indexOf(WAIT_FOR_STANDARD_READY_CALL);

    if (waitCallIndex < 0) {
        return [];
    }

    const declarationIndex = pageTs.lastIndexOf(
        READINESS_DECLARATION,
        waitCallIndex
    );

    if (declarationIndex < 0) {
        return [];
    }

    const blockText = pageTs.slice(declarationIndex, waitCallIndex);
    const matches = blockText.matchAll(
        /aliasKeys\.([A-Za-z_$][A-Za-z0-9_$]*)/g
    );

    return uniqueAliasKeys(
        [...matches]
            .map((match) => match[1])
            .filter((value): value is string => Boolean(value))
    );
}

export function replaceReadinessBlock(
    pageTs: string,
    aliasKeys: string[]
): string {
    const waitCallIndex = pageTs.indexOf(WAIT_FOR_STANDARD_READY_CALL);

    if (waitCallIndex < 0) {
        return pageTs;
    }

    const readinessBlock = buildReadinessBlock(aliasKeys);
    const declarationIndex = pageTs.lastIndexOf(
        READINESS_DECLARATION,
        waitCallIndex
    );

    if (declarationIndex < 0) {
        return (
            pageTs.slice(0, waitCallIndex) +
            readinessBlock +
            pageTs.slice(waitCallIndex)
        );
    }

    const lineStart = pageTs.lastIndexOf("\n", declarationIndex);
    const blockStart = lineStart < 0 ? 0 : lineStart + 1;

    return (
        pageTs.slice(0, blockStart) +
        readinessBlock +
        pageTs.slice(waitCallIndex)
    );
}

export function sameAliasKeys(a: string[], b: string[]): boolean {
    const left = uniqueAliasKeys(a).sort((x, y) => x.localeCompare(y));
    const right = uniqueAliasKeys(b).sort((x, y) => x.localeCompare(y));

    if (left.length !== right.length) {
        return false;
    }

    return left.every((value, index) => value === right[index]);
}
