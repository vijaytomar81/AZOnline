// src/reporters/dashboard/renderHtml.ts

import fs from "node:fs";
import path from "node:path";

import { getReporterPaths } from "../paths";
import type { DashboardLatestPayload } from "../schema";

type RenderHtmlOptions = {
    repoRoot?: string;

    // configurable header/footer
    pageTitle?: string;
    headerHtml?: string;
    footerHtml?: string;

    // allow overriding template/css locations if you want later
    templatePath?: string;
    cssPath?: string;
};

function readFileIfExists(p: string): string | null {
    try {
        if (!fs.existsSync(p)) return null;
        return fs.readFileSync(p, "utf8");
    } catch {
        return null;
    }
}

function ensureDir(dirPath: string) {
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

// ES2015-safe (no replaceAll)
function escapeHtml(s: string) {
    return String(s)
        .split("&").join("&amp;")
        .split("<").join("&lt;")
        .split(">").join("&gt;")
        .split('"').join("&quot;")
        .split("'").join("&#39;");
}

function msToHuman(ms: number) {
    const n = Number.isFinite(ms) ? ms : 0;
    if (n < 1000) return `${Math.round(n)}ms`;
    const s = n / 1000;
    if (s < 60) return `${Math.round(s * 10) / 10}s`;
    const m = Math.floor(s / 60);
    const rem = Math.round((s % 60) * 10) / 10;
    return `${m}m ${rem}s`;
}

function pct(p: number) {
    const x = Math.max(0, Math.min(1, p));
    return `${Math.round(x * 1000) / 10}%`; // 1 decimal
}

function safeReadJson<T>(filePath: string): T | null {
    try {
        if (!fs.existsSync(filePath)) return null;
        return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
    } catch {
        return null;
    }
}

function buildRowsFlaky(payload: DashboardLatestPayload) {
    const rows = payload.flakyTop ?? [];
    if (!rows.length) {
        return `<tr><td colspan="5" class="muted">No flaky tests 🎉</td></tr>`;
    }

    return rows
        .map((r) => {
            const title = escapeHtml(r.title);
            const proj = escapeHtml(r.project);
            const err = escapeHtml(r.lastError ?? "");
            return [
                `<tr>`,
                `<td class="mono">${title}</td>`,
                `<td>${proj}</td>`,
                `<td>${r.retries}</td>`,
                `<td>${msToHuman(r.lastDurationMs)}</td>`,
                `<td class="muted">${err}</td>`,
                `</tr>`,
            ].join("");
        })
        .join("\n");
}

function buildRowsSlow(payload: DashboardLatestPayload) {
    const rows = payload.slowTop ?? [];
    if (!rows.length) {
        return `<tr><td colspan="4" class="muted">No slow tests</td></tr>`;
    }

    return rows
        .map((r) => {
            const title = escapeHtml(r.title);
            const proj = escapeHtml(r.project);
            const st = escapeHtml(r.status);
            return [
                `<tr>`,
                `<td class="mono">${title}</td>`,
                `<td>${proj}</td>`,
                `<td><span class="pill ${st}">${st}</span></td>`,
                `<td>${msToHuman(r.durationMs)}</td>`,
                `</tr>`,
            ].join("");
        })
        .join("\n");
}

function buildRowsFiles(payload: DashboardLatestPayload) {
    const rows = payload.files ?? [];
    if (!rows.length) {
        return `<tr><td colspan="7" class="muted">No file data</td></tr>`;
    }

    return rows
        .map((r) => {
            const file = escapeHtml(r.file);
            return [
                `<tr>`,
                `<td class="mono">${file}</td>`,
                `<td>${r.total}</td>`,
                `<td>${r.passed}</td>`,
                `<td>${r.failed}</td>`,
                `<td>${r.flaky}</td>`,
                `<td>${r.skipped}</td>`,
                `<td>${r.avgDurationMs}</td>`,
                `</tr>`,
            ].join("");
        })
        .join("\n");
}

export function renderDashboardHtml(opts?: RenderHtmlOptions): string {
    const repoRoot = opts?.repoRoot ?? process.cwd();
    const paths = getReporterPaths({ repoRoot });

    const payload = safeReadJson<DashboardLatestPayload>(paths.dashboardLatestJson);
    if (!payload) {
        throw new Error(
            `latest.json not found. Run dashboard build first: ${paths.dashboardLatestJson}`
        );
    }

    const templatePath =
        opts?.templatePath ??
        path.join(repoRoot, "src", "reporters", "dashboard", "template.html");

    const tpl = readFileIfExists(templatePath);
    if (!tpl) throw new Error(`template.html not found: ${templatePath}`);

    // header/footer config (env fallback)
    const pageTitle =
        opts?.pageTitle ?? process.env.DASHBOARD_TITLE ?? "Playwright Test Dashboard";

    const headerHtml =
        opts?.headerHtml ??
        process.env.DASHBOARD_HEADER_HTML ??
        `<div><b>${escapeHtml(pageTitle)}</b></div><div class="muted">Generated from Playwright JSON</div>`;

    const footerHtml =
        opts?.footerHtml ??
        process.env.DASHBOARD_FOOTER_HTML ??
        `<div class="muted">AZOnline • Dashboard</div>`;

    const summary = payload.summary;

    const flakyRows = buildRowsFlaky(payload);
    const slowRows = buildRowsSlow(payload);
    const fileRows = buildRowsFiles(payload);

    const trendText = payload.trend?.length
        ? escapeHtml(JSON.stringify(payload.trend, null, 2))
        : "No history yet.";

    // NOTE: template.html must include:
    //   <link rel="stylesheet" href="./styles.css" />
    // (so we don't inject CSS into the template)
    const html = tpl
        .split("{{PAGE_TITLE}}").join(escapeHtml(pageTitle))
        .split("{{HEADER_HTML}}").join(headerHtml)
        .split("{{FOOTER_HTML}}").join(footerHtml)
        .split("{{PASS_RATE}}").join(pct(summary.passRate))
        .split("{{EXECUTED_NOTE}}").join(
            escapeHtml(
                `Executed: ${summary.passed + summary.failed + summary.flaky} / Total: ${summary.total}`
            )
        )
        .split("{{PASSED}}").join(String(summary.passed))
        .split("{{FAILED}}").join(String(summary.failed))
        .split("{{FLAKY}}").join(String(summary.flaky))
        .split("{{SKIPPED}}").join(String(summary.skipped))
        .split("{{RUN_ID}}").join(escapeHtml(summary.runId))
        .split("{{GENERATED_AT}}").join(escapeHtml(new Date().toISOString()))
        .split("{{FLAKY_ROWS}}").join(flakyRows)
        .split("{{SLOW_ROWS}}").join(slowRows)
        .split("{{FILE_ROWS}}").join(fileRows)
        .split("{{TREND_TEXT}}").join(trendText)
        .split("{{DATA_JSON}}").join(escapeHtml(JSON.stringify(payload)));

    return html;
}

export function writeDashboardHtml(
    opts?: RenderHtmlOptions & { outFile?: string; strictCss?: boolean }
): { htmlPath: string; cssPath: string } {
    const repoRoot = opts?.repoRoot ?? process.cwd();
    const paths = getReporterPaths({ repoRoot });

    const outFile = opts?.outFile ?? path.join(paths.dashboardOutDir, "index.html");

    // 1) Render HTML (expects template.html already has <link rel="stylesheet" href="./styles.css" />)
    const html = renderDashboardHtml(opts);

    ensureDir(path.dirname(outFile));
    fs.writeFileSync(outFile, html, "utf8");

    // 2) Copy styles.css next to index.html so the relative link works
    const cssSrc =
        opts?.cssPath ?? path.join(repoRoot, "src", "reporters", "dashboard", "styles.css");

    const cssDst = path.join(path.dirname(outFile), "styles.css");

    const strictCss = opts?.strictCss ?? true; // default: true (recommended)

    if (!fs.existsSync(cssSrc)) {
        const msg = `styles.css not found: ${cssSrc}`;
        if (strictCss) throw new Error(msg);
        // non-strict: still return html path but css path points where it *would* be
    } else {
        fs.copyFileSync(cssSrc, cssDst);
    }

    return { htmlPath: outFile, cssPath: cssDst };
}