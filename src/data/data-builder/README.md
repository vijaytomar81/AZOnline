---
# Data Builder

The Data Builder converts Excel-based input into JSON test cases.

---

# Plugins

Plugin                      | Purpose
----------------------------|-----------------------
00-load-excel 				| read Excel
10-extract-meta 			| extract metadata
20-build-cases 				| create case objects
30-filter-scriptIds 		| filter tests
40-prune-additional-drivers | normalize driver count
70-write-json 				| write JSON output
----------------------------|-----------------------

# Output

Generated test case JSON consumed by caseRunner.


# Pipeline

```mermaid
flowchart LR

Excel --> LoadExcel
LoadExcel --> ExtractMeta
ExtractMeta --> BuildCases
BuildCases --> FilterScriptIds
FilterScriptIds --> PruneDrivers
PruneDrivers --> WriteJSON
