# 🧱 Data Builder — Enterprise Level (Level-2)

## 🎯 Purpose

Data Builder converts **Excel test data** into structured JSON used by automated Playwright execution.

It exists to:

- Standardize test data
- Decouple test logic from Excel structure
- Support scalable automation frameworks
- Provide deterministic, validated data output

---

# 🏗 Architecture Overview
CLI
│
▼
index.ts  (Orchestrator)
│
├── Args Parser
├── Logger + Timer
│
▼
Excel Loader
│
▼
Transform Pipeline (excelToCases.ts)
│
├── Parent detection
├── Child mapping
├── Script filtering
├── AdditionalDrivers pruning
│
▼
Validation Layer
│
▼
JSON Writer
│
▼
Execution Summary

---

# 📂 Project Structure
src/data-builder
│
├── index.ts
│   └── Entry point (CLI execution)
│
├── cli/
│   └── args.ts
│       └── Command line argument parsing
│
├── core/
│   ├── logger.ts
│   └── timer.ts
│
├── excel/
│   └── workbook.ts
│       └── Excel loading utilities
│
├── transforms/
│   └── excelToCases.ts
│       └── Core transformation engine
│
├── validators/
│   └── validations.ts
│
├── writers/
│   └── jsonWriter.ts
│
├── types.ts
│
└── README.md

---

# 🧭 Execution Lifecycle

When running:

```bash
npx ts-node src/data-builder/index.ts --excel ... --sheet ...
Sequence
	1.	CLI Entry (index.ts)
	•	Parse arguments
	•	Start logger
	•	Start timer
	2.	Excel Load
	•	Open workbook
	•	Validate sheet existence
	3.	Transform Stage
	•	Read all rows
	•	Detect parents (P__)
	•	Map children
	•	Build case objects
	4.	Business Rules
	•	Script filtering
	•	AdditionalDrivers pruning
	•	Empty-field handling
	5.	Validation
	•	Duplicate Script IDs
	•	Duplicate Script Names
	•	Missing requested IDs
	6.	Writer
	•	Serialize JSON
	•	Save output
	7.	Summary
	•	Execution time
	•	Case count
	•	Output location

- **Data Builder**: Converts your Excel sheet into a JSON file under `src/data/generated/<Sheet>.json`.

# 1) Data Builder commands

### `npm run data:build`
Runs the data builder with default CLI parameters (whatever your data-builder `args.ts` defines as defaults).

**Typical use**: Build cases before running tests.

---

### `npm run data:build:verbose`
Same as `data:build`, but adds `--verbose`.

**What it does**:
- Enables debug logs (plugin discovery, run order, timings, etc.)

---

### `npm run data:build:empty`
Runs data builder with:
- `--includeEmptyChildFields true`

**What it does**:
- Keeps empty/blank fields in generated JSON where your builder supports that behavior.
- Useful when your API expects keys to exist even if values are empty.

---

### `npm run data:build:empty:verbose`
Same as `data:build:empty` plus `--verbose`.

**Use it when**:
- You’re troubleshooting why empty values are/aren’t included.

---

### `npm run data:build:flowNB`
Runs data builder with:
- `--sheet FlowNB`

**What it does**:
- Forces the sheet name to `FlowNB` (instead of relying on defaults).

---

### `npm run data:build:debug`
Same as:
- `--includeEmptyChildFields true --verbose`

**Use it when**:
- You want maximum logging + empty fields included.

---

# 2) Test execution commands

### `npm run e2e`
Runs:
1) `npm run data:build`
2) then `npm run test:e2e`

**What it does**:
- One-shot “build data then execute tests”.

**Important**:
- If you need specific data-builder params (sheet / verbose / includeEmptyChildFields),
  run those variants first OR create another combined script.

---
