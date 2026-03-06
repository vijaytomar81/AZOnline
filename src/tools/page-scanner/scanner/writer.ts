// src/tools/page-scanner/scanner/writer.ts

import fs from "node:fs";
import path from "node:path";

import { ensureDir } from "../../../utils/fs";
import type { PageMap, ScanPageOptions } from "./types";
import { PAGE_SCANNER_MAPS_DIR } from "../../../utils/paths";

export function writePageMap(opts: ScanPageOptions, pageMap: PageMap) {
    const outDir = opts.outDir ?? PAGE_SCANNER_MAPS_DIR;
    ensureDir(outDir);
    const outFile = path.join(outDir, `${opts.pageKey}.json`);
    fs.writeFileSync(outFile, JSON.stringify(pageMap, null, 2), "utf8");
    return outFile;
}