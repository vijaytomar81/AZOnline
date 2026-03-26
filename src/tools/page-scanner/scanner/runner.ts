// src/tools/page-scanner/scanner/runner.ts

import fs from "node:fs";
import path from "node:path";

import { ensureDir, safeReadJson } from "@utils/fs";
import { PAGE_MAPS_DIR } from "@utils/paths";
import type { PageMap, ScanPageOptions } from "./types";
import { connectAndGetPage } from "./browser";
import { extractDomElements } from "./domExtract";
import { buildPageMap } from "./pageMap/buildPageMap";
import { mergePageMaps } from "./pageMap/mergePageMaps";
import { diffPageMaps } from "./pageMap/diffPageMaps";

export async function scanPage(opts: ScanPageOptions): Promise<void> {
    const log = opts.log;

    const outDir = opts.outDir ?? PAGE_MAPS_DIR;
    ensureDir(outDir);

    const outFile = path.join(outDir, `${opts.pageKey}.json`);

    log.info(`Connecting to browser: ${opts.connectCdp}`);

    const { page, detach, url } = await connectAndGetPage(opts);

    try {
        let title: string | undefined;
        try {
            const t = await page.title();
            title = t?.trim() ? t.trim() : undefined;
        } catch {
            title = undefined;
        }

        log.info(`Scanning tab[${opts.tabIndex ?? 0}]: ${url}${title ? ` (title: ${title})` : ""}`);

        const scanned = await extractDomElements(page);

        const pageMap = buildPageMap({
            pageKey: opts.pageKey,
            url,
            title,
            scanned,
            verbose: opts.verbose,
            onDebug: opts.verbose ? (message) => log.debug(message) : undefined,
        });

        log.info(`Scanned entries found: ${Object.keys(pageMap.elements).length}`);

        if (opts.merge) {
            log.info(`Merging into existing mapper (if any): ${outFile}`);

            const existing = safeReadJson<PageMap>(outFile);

            if (!existing) {
                fs.writeFileSync(outFile, JSON.stringify(pageMap, null, 2), "utf8");
                log.info(`Mapper written (new file): ${outFile}`);
                return;
            }

            const merged = mergePageMaps(existing, pageMap);
            const diff = diffPageMaps(existing, merged);

            fs.writeFileSync(outFile, JSON.stringify(merged, null, 2), "utf8");
            log.info(`Mapper written (merged): ${outFile}`);

            log.info(
                `Page diff summary: added=${diff.added.length}, updated=${diff.updated.length}, removed=${diff.removed.length}, unchanged=${diff.unchanged.length}`
            );

            if (opts.verbose) {
                if (diff.added.length) {
                    log.debug(`Added: ${diff.added.join(", ")}`);
                }
                if (diff.updated.length) {
                    log.debug(`Updated: ${diff.updated.join(", ")}`);
                }
                if (diff.removed.length) {
                    log.debug(`Removed: ${diff.removed.join(", ")}`);
                }
            }
        } else {
            fs.writeFileSync(outFile, JSON.stringify(pageMap, null, 2), "utf8");
            log.info(`Mapper written: ${outFile}`);
        }
    } finally {
        await detach();
    }
}