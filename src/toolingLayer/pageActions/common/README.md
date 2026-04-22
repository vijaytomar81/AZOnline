<!-- src/toolingLayer/pageActions/common/README.md -->

# Page Actions Common Layer

Shared logic used by:

- generator
- validator
- repair

This layer prevents duplication and keeps all tools aligned to the same expected state.

---

## Owns

### Manifest loaders

- loadPageObjectManifestIndex
- loadPageObjectManifestPage
- loadPageActionManifestIndex
- loadPageActionManifestEntry

### File helpers

- readTextIfExists
- writeIfChanged

### Expected-state builders

- buildExpectedActionState
- buildExpectedManifestEntry

### Registry builders

- buildRootIndexContent
- buildActionsIndexContent
- buildPlatformIndexContent
- buildApplicationIndexContent
- buildProductIndexContent

---

## Goal

One source of truth for:

- expected page action names
- expected paths
- expected manifest content
- expected registry exports

---

## Usage

Generator writes from common expectations.

Validator compares against common expectations.

Repair restores from common expectations.
