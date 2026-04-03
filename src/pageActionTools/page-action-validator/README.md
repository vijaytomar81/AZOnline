<!-- src/pageActionTools/page-action-validator/README.md -->

# Page Action Validator

Validates page action structure against page objects, manifests, and exports.

## Source of truth
Page objects remain the source of truth for page coverage and structural wiring.

## Validator scope
Validator checks only safe structural concerns:
- environment readiness
- page object to page action coverage
- missing or orphan action files
- manifest consistency
- action key consistency
- index exports
- header path comment
- exported action function naming

## Out of scope
Validator does not attempt to validate QA-owned action body logic.

## Typical usage
```bash
npm run pageactions:validate
npm run pageactions:validate:verbose
npm run pageactions:validate:strict
```
