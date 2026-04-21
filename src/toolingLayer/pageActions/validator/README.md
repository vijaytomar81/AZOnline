<!-- src/toolingLayer/pageActions/validator/README.md -->

# Page Action Validator

Validates generated page-action structure, manifests, and registry files.

This validator is intended to verify framework correctness while staying permissive toward QA-owned action-body customization.

Current V1 rule groups:

- environment
- source
- actions
- manifest
- registry

Future versions may add:

- runtime contract checks
- managed-region validation
- repair guidance
