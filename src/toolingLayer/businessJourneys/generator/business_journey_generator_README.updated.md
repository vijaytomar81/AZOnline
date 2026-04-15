<!-- /mnt/data/business_journey_generator_README.updated.md -->

# Business Journey Generator

Generates scaffolded business-journey files from the page-actions manifest.

## What it does

The generator reads page-action manifest entries, derives supported journey targets, and creates a business-journey folder structure with:

- framework files under the shared, runner, and registry areas
- per-journey runner files
- entry-point builder files
- common step files
- generated step wrappers for matched page actions
- index files for the generated folders

The generator is scaffold-first. It mainly creates missing files and avoids overwriting existing files unless a lower-level writer is explicitly designed to do so.

## Current command behavior

The CLI currently supports one command:

- `generate`
- `generate --verbose`

If no positional command is supplied, it defaults to `generate`.

Examples:

```bash
npm run businessjourney:generate
npm run businessjourney:generate -- --verbose
```

If an unknown command is provided, the tool prints help and exits with code `1`.

## CLI flow

The CLI entrypoint:

1. reads `--verbose`
2. resolves the first non-flag argument as the command
3. defaults that command to `generate`
4. calls `runGenerateCommand({ verbose })`
5. prints help for unsupported commands

`runGenerateCommand` delegates directly to `generateBusinessJourneys` and returns exit code `0`.

## Inputs

The generator loads input data from the page-actions manifest:

- `PAGE_ACTIONS_MANIFEST_INDEX_FILE`
- files referenced from `PAGE_ACTIONS_MANIFEST_ACTIONS_DIR`

Each usable manifest entry is mapped to:

- `actionKey`
- `pageKey`
- `group`
- `actionName`
- `actionFile`

If the manifest index is missing or does not contain `actions`, generation proceeds with an empty input set.

## Target discovery

`buildJourneyTargets` derives targets from manifest entries that:

- have a `pageKey` starting with `athena.`
- are not in the `common` group
- belong to supported products

Supported products are currently:

- `motor`
- `home`

Generated targets are:

### Athena targets

For each supported product:

- `application: athena`
- `journey: newBusiness`
- `entryPoint: direct`
- `entryPoint: pcwTool`

### Partner targets

For each supported product and each configured partner application:

- `journey: newBusiness`
- `entryPoint: pcw`

## Candidate selection rules

For a given target, candidate page actions are selected when:

- the `actionKey` contains `.{product}.` or `.common.`
- the namespace starts with the target application or `athena.`

This means partner journeys can still include Athena-prefixed actions, which appears intentional for shared downstream flow reuse.

## Step mapping rules

Each selected page action becomes a generated journey step:

- `SomeAction` becomes step name `some`
- the exported step name becomes `stepSome`
- the file name becomes `stepSome.ts`

Step folder placement is determined from `pageKey`:

- `athena.*` -> Athena step folder
- anything else -> partner step folder

Generated step wrappers currently import actions from `@pageActions` and call them with:

- `context: context.pageActionContext`
- `payload: data`

## Generated structure

For each target, the generator creates files under:

```text
@businessLayer/businessJourneys/journeys/<application>/<product>/<journey>/
```

Typical files include:

- `run<...>.journey.ts`
- `build<...>Steps.ts`
- `index.ts`
- `entryPoints/build<...>EntrySteps.ts`
- `entryPoints/index.ts`
- `steps/common/stepOpenStartUrl.ts`
- `steps/common/index.ts`
- `steps/index.ts`
- generated step files under `steps/athena` or `steps/partner`

It also ensures shared framework files exist under:

- `shared/`
- `runner/`
- `registry/`
- root `index.ts`

## Generation flow

`generateBusinessJourneys` performs this sequence:

1. print command title and environment
2. load manifest-backed inputs
3. build journey targets
4. ensure framework files exist
5. generate files for each target
6. print summary

Verbose mode also prints per-target details:

- application
- product
- journey
- entry point
- files created

## File-writing behavior

Two different write strategies exist:

### `writeFileIfMissing`

Used by target and framework generation.

Behavior:

- creates a file only when it does not already exist
- skips existing files entirely

### `writeFileAlways`

Behavior:

- writes only when file contents differ
- currently present, but not used by this generator flow

## Important current limitations

### 1. Existing generated files are not refreshed

Most generation uses `writeFileIfMissing`, so changes to templates will not propagate into already-created files.

Impact:

- template fixes do not update older generated outputs
- index files may become stale if more candidate steps appear later
- reruns mainly help with first-time scaffolding

### 2. `buildSteps` does not yet include mapped step exports

`renderBuildStepsFile` currently returns only entry steps plus TODO comments. Generated action steps are created on disk, but they are not yet appended into the returned step list.

Impact:

- generated step files exist
- runtime journey execution will currently run entry steps only

### 3. Entry-point argument is currently unused in `buildSteps`

`build<...>Steps({ entryPoint })` accepts `entryPoint`, but the rendered implementation chooses its builder at generation time and does not use the runtime argument.

Impact:

- the function signature suggests dynamic behavior
- current behavior is static per generated file

### 4. Common step index is not re-exported from the top-level steps index

`steps/index.ts` exports only mapped generated steps. It does not re-export `steps/common`.

Impact:

- this is not breaking for the current generated files
- it can become inconvenient for broader step imports later

### 5. Framework types still use broad placeholders

Shared framework types currently use `any` for some important fields such as:

- `page`
- `pageActionContext`

Impact:

- scaffolding remains flexible
- compile-time safety is limited until these types are refined

### 6. Registry and runner are still placeholders

The generated framework includes placeholder implementations such as:

- empty `journeyRegistry`
- TODO-only `runBusinessJourney`

Impact:

- the generator scaffolds structure, not a complete runnable registry pipeline

## Suggested next improvements

Highest-value next steps:

1. switch selected generated files from `writeFileIfMissing` to content-aware updating
2. render mapped steps into `build<...>Steps.ts`
3. decide whether `entryPoint` should be compile-time only or truly runtime-driven
4. generate richer index files that include common steps where useful
5. replace `any` in shared types with actual framework types
6. register generated journeys in `journeyRegistry`

## Example generated lifecycle

```text
manifest -> inputs -> targets -> candidate actions -> step mappings -> rendered files
```

More concretely:

```text
page actions manifest
  -> supported products inferred from Athena entries
  -> targets built for Athena and partner applications
  -> candidate actions filtered per target
  -> actions mapped to step files
  -> journey/run/build/index/framework files created if missing
```

## Exit codes

- `0` for successful `generate`
- `1` for unsupported commands after help is printed

## Quick usage

```bash
npm run businessjourney:generate
npm run businessjourney:generate -- --verbose
```

## Maintainer notes

This generator is already useful for bootstrapping folder structure and journey scaffolding. The main gap is that it currently generates wrapper files more effectively than it wires them into executable journey flow. Treat it as a scaffold generator first, not a finished orchestration generator.
