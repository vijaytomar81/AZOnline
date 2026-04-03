<!-- src/pageActionTools/page-action-repair/README.md -->

# Page Action Repair

Repairs safe structural inconsistencies for page action tooling.

## Repair scope
Repair only applies non-destructive fixes:
- missing manifest entries
- stale manifest paths
- action key mismatches
- missing index exports
- incorrect generated header path
- missing action files by regeneration

## Safety model
Repair does not rewrite QA-owned page action body logic.

## Typical usage
```bash
npm run pageactions:repair
npm run pageactions:repair:verbose
```
