// src/tools/page-scanner/scanner/runner.ts

import fs from "node:fs";
import path from "node:path";

import { ensureDir, safeReadJson } from "../../../utils/fs";
import { PAGE_SCANNER_MAPS_DIR } from "../../../utils/paths";
import type { PageMap, ScanPageOptions } from "./types";
import { connectAndGetPage } from "./browser";
import { extractDomElements } from "./domExtract";
import { buildPageMap } from "./pageMap/buildPageMap";
import { mergePageMaps } from "./pageMap/mergePageMaps";

export async function scanPage(opts: ScanPageOptions): Promise<void> {
    const log = opts.log;

    const outDir = opts.outDir ?? PAGE_SCANNER_MAPS_DIR;
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

        log.info(`Elements found: ${Object.keys(pageMap.elements).length}`);

        if (opts.merge) {
            log.info(`Merging into existing mapper (if any): ${outFile}`);
            const existing = safeReadJson<PageMap>(outFile);
            const merged = existing ? mergePageMaps(existing, pageMap) : pageMap;
            fs.writeFileSync(outFile, JSON.stringify(merged, null, 2), "utf8");
            log.info(`Mapper written (merged): ${outFile}`);
        } else {
            fs.writeFileSync(outFile, JSON.stringify(pageMap, null, 2), "utf8");
            log.info(`Mapper written: ${outFile}`);
        }
    } finally {
        await detach();
    }
}