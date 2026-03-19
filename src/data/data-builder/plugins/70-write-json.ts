// src/data/data-builder/plugins/70-write-json.ts
import fs from "node:fs";
import path from "node:path";
import type { PipelinePlugin } from "../core/pipeline";
import type { DataBuilderContext } from "../types";

function safeSheetFilename(name: string) {
  return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").trim() || "Sheet";
}

function isLikelyDir(p: string): boolean {
  const normalized = p.replace(/\\/g, "/").trim();
  if (!normalized) return true;
  if (normalized.endsWith("/")) return true;
  if (normalized.endsWith("\\")) return true;
  return path.extname(normalized) === "";
}

const plugin: PipelinePlugin = {
  name: "write-json",
  order: 70,
  requires: ["casesFile", "external:sheetName", "external:outputPath"],
  provides: ["absOut"],

  run: async (ctx: DataBuilderContext) => {
    const casesFile = ctx.data.casesFile;
    if (!casesFile) {
      throw new Error("casesFile missing. build-cases must run before write-json.");
    }

    const sheetName = String(casesFile.sheet ?? ctx.data.sheetName ?? "").trim();
    if (!sheetName) {
      throw new Error("sheetName missing.");
    }

    const outRaw = String(ctx.data.outputPath ?? "").trim();
    if (!outRaw) {
      throw new Error("outputPath missing. Ensure args.ts sets default or pass --out.");
    }

    let targetPath = outRaw;
    if (isLikelyDir(outRaw)) {
      targetPath = path.join(outRaw, `${safeSheetFilename(sheetName)}.json`);
    }

    const absOut = path.isAbsolute(targetPath)
      ? targetPath
      : path.join(process.cwd(), targetPath);

    fs.mkdirSync(path.dirname(absOut), { recursive: true });
    fs.writeFileSync(absOut, JSON.stringify(casesFile, null, 2), "utf-8");

    if (ctx.data.validationReport) {
      const reportPath = absOut.replace(/\.json$/i, ".validation.json");
      ctx.data.validationReport.reportPath = reportPath;
      fs.writeFileSync(reportPath, JSON.stringify(ctx.data.validationReport, null, 2), "utf-8");
      ctx.log.info(`Validation report written: ${reportPath}`);
    }

    ctx.data.absOut = absOut;

    ctx.log.info(`JSON written: ${absOut}`);
    ctx.log.debug?.(`cases=${casesFile.caseCount}`);
  },
};

export default plugin;