// src/reporters/dashboard/dashboardHelp.ts

export type HelpTopic = "root";

export function usage(_topic: HelpTopic = "root") {
    return `
Playwright Dashboard Builder

What it does:
  - Reads Playwright JSON report: reports/json/results.json
  - Writes dashboard artifacts:
      reports/dashboard/latest.json
      reports/dashboard/history.json

Usage:
  node -r ts-node/register src/reporters/dashboard/index.ts [options]

Options:
  --repoRoot <path>         Repo root (default: process.cwd())
  --keepHistoryDays <n>     Keep last N daily points in history.json (default: 30)
  --verbose                 Verbose logging
  --logToFile               Write logs to file
  --logFilePath <path>      Log file path (default: reports/dashboard/build.log)
  --help, -h                Show this help

Examples:
  node -r ts-node/register src/reporters/dashboard/index.ts
  node -r ts-node/register src/reporters/dashboard/index.ts --keepHistoryDays 60
  node -r ts-node/register src/reporters/dashboard/index.ts --verbose
  node -r ts-node/register src/reporters/dashboard/index.ts --logToFile
`.trim();
}