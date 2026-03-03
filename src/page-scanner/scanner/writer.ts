// src/scanner/page-scanner/writer.ts

import fs from "node:fs";
import path from "node:path";
import type { PageMap, ScanPageOptions } from "./types";

function ensureDir(dir: string) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function writePageMap(opts: ScanPageOptions, pageMap: PageMap) {
    const outDir = opts.outDir ?? path.join(process.cwd(), "src", "page-maps");
    ensureDir(outDir);
    const outFile = path.join(outDir, `${opts.pageKey}.json`);
    fs.writeFileSync(outFile, JSON.stringify(pageMap, null, 2), "utf8");
    return outFile;
}