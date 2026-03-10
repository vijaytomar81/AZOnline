// src/tools/page-elements-validator/validators/pageChain/pageMetaValidator.ts

export function extractPageMeta(ts: string) {
    const hasPageMeta = /export\s+const\s+pageMeta\s*=/.test(ts);

    const hasUrlRe =
        /urlRe\s*:\s*\/.*\/[gimsuy]*/.test(ts) ||
        /urlRe\s*:\s*new\s+RegExp\(/.test(ts);

    const hasUrlPath = /urlPath\s*:\s*["']\//.test(ts);

    return { hasPageMeta, hasUrlRe, hasUrlPath };
}