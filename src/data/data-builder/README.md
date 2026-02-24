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

