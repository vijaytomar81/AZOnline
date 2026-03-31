# Evidence Layer

---

# 1. Overview

The **Evidence Layer** captures, structures, writes, merges, and exports execution evidence.

It transforms execution outputs into stable artifacts that can be used for:

- debugging
- auditability
- traceability
- run summaries
- Excel reporting

It is the reporting and artifact layer of the framework.

---

# 2. Purpose

The Evidence Layer exists to make execution outcomes observable and reusable.

Its primary goals are:

- capture normalized execution evidence
- separate execution from reporting concerns
- persist run-level and scenario-level evidence
- merge worker artifacts into final run artifacts
- generate final JSON evidence files
- generate human-readable Excel reports
- support artifact cleanup and retention

---

# 3. Toolchain Context

~~~mermaid
flowchart LR

    A[Execution Layer]
    B[Evidence Context / Store]
    C[Scenario Evidence]
    D[Worker Artifacts]
    E[Merged Run Evidence]
    F[Final JSON]
    G[Excel Report]

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
~~~

---

# 4. Inputs

The Evidence Layer receives:

- execution context
- scenario result
- run metadata
- worker id
- run id
- output root configuration

It does not execute business logic itself.

---

# 5. Outputs

The Evidence Layer generates:

- metadata.json
- passed-evidence.json
- failed-evidence.json (only when needed)
- execution-summary.xlsx

---

# 6. Artifact Structure

results/evidence/<runId>/
├── metadata.json
├── passed-evidence.json
├── failed-evidence.json
└── execution-summary.xlsx

---

# 7. Evidence Levels

## Scenario / Case Level

Each scenario stores:

- scenario metadata
- scenario status
- item results
- outputs
- error details

---

## Run Level

Run-level artifacts store:

- totals
- runtime metadata
- grouped cases
- Excel summary

---

# 8. Evidence Store

Uses an in-memory store abstraction:

- set values
- get values
- snapshot evidence

Decoupled from execution logic.

---

# 9. Evidence Context

Combines:

- run info
- evidence store

---

# 10. JSON Artifacts

## passed-evidence.json
All passed cases

## failed-evidence.json
All failed cases

## metadata.json
Run-level metadata

---

# 11. Runtime Metadata

Includes:

- mode
- environment
- execution timing
- system info
- browser info

---

# 12. Item-Level Evidence

Each item stores:

- item number
- action
- status
- timestamps
- outputs
- errors

---

# 13. Summary Counts

Supports:

- total
- passed
- failed
- not executed
- pass rate

---

# 14. Worker Artifact Flow

~~~mermaid
flowchart TD

    A[Scenario execution]
    B[Write worker artifact]
    C[worker-artifacts]
    D[Merge]
    E[Final evidence]

    A --> B
    B --> C
    C --> D
    D --> E
~~~

---

# 15. Finalization Flow

1. merge worker artifacts  
2. split passed / failed  
3. write metadata  
4. generate Excel  
5. cleanup  

---

# 16. Excel Reporting

Sheets:

- Summary
- Passed
- Failed
- Not Executed

Summary includes:

- run info
- system info
- browser info
- execution stats
- timing

---

# 17. Why Excel Uses JSON

Benefits:

- separation of concerns
- reproducibility
- easier debugging
- re-generation capability

---

# 18. Cleanup & Retention

Supports:

- temp cleanup
- retention limits
- optional failed file removal

---

# 19. Configuration

Located in:

src/evidence/config

---

# 20. Folder Responsibilities

contracts → types  
core → store  
runtime → context  
artifacts/json → JSON builders  
artifacts/run → merge & finalize  
artifacts/excel → Excel generation  

---

# 21. Design Principles

- execution-independent
- JSON-first
- modular
- scalable
- report-focused

---

# 22. What It Should Not Do

- run business logic  
- control browser  
- read raw Excel  
- embed heavy payloads  

---

# 23. Future Extensions

- scenario summary sheet  
- trends  
- flaky detection  
- screenshot links  
- CI metadata  

---

# 24. Summary

The Evidence Layer converts execution results into structured, durable artifacts and professional reports.
