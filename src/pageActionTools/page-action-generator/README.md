<!-- src/pageActionTools/page-action-generator/README.md -->

# Page Action Generator

Generates draft page action files from page object manifest entries.

## What it owns
- creates missing page action files
- creates page action manifest files
- creates/updates page action index exports
- keeps generation logs compact and readable

## What it does not own
- final business-data mapping
- custom QA logic
- nested schema decisions

## Output strategy
Each page object produces one page action file. Generated output includes:
- active high-confidence mappings
- active conditional indexed scaffolding for repeated numeric fields
- bulk TODO blocks for lower-confidence value mappings
- bulk TODO blocks for click/radio/link interactions

## Typical usage
```bash
npm run pageactions:generate
npm run pageactions:generate:verbose
```

## Follow-up expectation
Automation QA should review generated page action files and refine:
- payload source paths
- fieldName debug paths
- business conditions
- nested schema mapping
