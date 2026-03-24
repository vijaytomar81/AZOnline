// src/tools/page-object-validator/validatorHelp.ts

import { strong, info } from "@utils/cliFormat";
import { ICONS } from "@utils/icons";

export function usage(): string {
    return `
${strong("Usage")}
  page-object-validator <command> [options]

${strong("Commands")}
  validate           Run validation pipeline for all page objects
  repair             Attempt to repair generator outputs

${strong("Options")}
  --verbose                Show detailed rule output
  --strict                 Treat warnings as errors
  --mapsDir <path>         Override page maps directory
  --pageObjectsDir <path>  Override page objects directory
  --pageRegistryDir <path> Override page registry directory
  --manifestFile <path>    Override page manifest directory or index file

${strong("Examples")}
  ${info("# run validator")}
  npm run validator -- validate

  ${info("# verbose validation")}
  npm run validator -- validate --verbose

  ${info("# strict mode (warnings fail build)")}
  npm run validator -- validate --strict

${strong("Validation checks")}
  ${ICONS.successIcon} Environment
      paths exist, page maps found

  ${ICONS.successIcon} Source
      page-map schema
      page-map key structure

  ${ICONS.successIcon} Outputs
      generated files exist

  ${ICONS.successIcon} Page Chain
      page-map → elements.ts
      elements.ts → aliases.generated.ts
      aliases.generated.ts → aliases.ts
      aliases.ts → Page Object methods

  ${ICONS.successIcon} Manifest
      manifest matches page-maps
      manifest files exist

  ${ICONS.successIcon} Registry
      src/pages/index.ts exports
      src/pages/pageManager.ts entries

  ${ICONS.successIcon} Hygiene
      generated modules contain markers

  ${ICONS.successIcon} Conventions
      pageKey naming
      className naming
      element key naming
`;
}