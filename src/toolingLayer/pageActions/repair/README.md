<!-- src/toolingLayer/pageActions/repair/README.md -->

# Page Action Repair

Repairs generated page-action structure safely.

Repair focuses on:

- manifests
- registry indexes
- missing generated files

Repair avoids overwriting QA-owned custom logic.

---

## Safe principles

- repair structure, not business behavior
- create missing files only
- rewrite generated metadata only
- keep manual edits intact

---

## Commands

npm run pageactions:repair
npm run pageactions:repair:verbose

---

## Planned rule groups

- environment
- actions
- manifest
- registry
- runtime (safe only)
