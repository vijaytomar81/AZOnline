// src/pages/motor/ad-driving-licence-details/aliases.ts
// HUMAN-MAINTAINED FILE
// pageKey: motor.ad-driving-licence-details
//
// This file is safe to edit.
// Generator behavior:
// - On first creation, it adds a 1:1 alias for each element (alias == element key).
// - On later runs, it ONLY appends aliases for NEW element keys.
// - It detects "already mapped" by RHS usage: aliasesGenerated.<elementKey>
//   so you can rename the alias key on the left and it won't re-add duplicates.

import type { ElementKey } from "./elements";
import { aliasesGenerated } from "./aliases.generated";

// Business-friendly aliases (edit freely)
// NOTE: AliasKey is derived ONLY from this object, so renaming LHS is fully supported.
export const aliases = {
  addFrontOfLicence: aliasesGenerated.addFrontOfLicence,
  addFrontOfLicence2: aliasesGenerated.addFrontOfLicence2,
  additionaldriver1partialdrivinglicencenumberquestionmonthpart: aliasesGenerated.additionaldriver1partialdrivinglicencenumberquestionmonthpart,
  additionaldriver1partialdrivinglicencenumberquestionrandompart: aliasesGenerated.additionaldriver1partialdrivinglicencenumberquestionrandompart,
  addresslookupwidgetAddresslookupquestioninputBuilding: aliasesGenerated.addresslookupwidgetAddresslookupquestioninputBuilding,
  addresslookupwidgetAddresslookupquestioninputPostcode: aliasesGenerated.addresslookupwidgetAddresslookupquestioninputPostcode,
  addressOptional: aliasesGenerated.addressOptional,
  back: aliasesGenerated.back,
  day: aliasesGenerated.day,
  euFull: aliasesGenerated.euFull,
  euProvisional: aliasesGenerated.euProvisional,
  findAddress: aliasesGenerated.findAddress,
  firstName: aliasesGenerated.firstName,
  howLongHaveAdditionalDriverHeldLicenceFor: aliasesGenerated.howLongHaveAdditionalDriverHeldLicenceFor,
  lastName: aliasesGenerated.lastName,
  linkToAllianzHomePage: aliasesGenerated.linkToAllianzHomePage,
  month: aliasesGenerated.month,
  month2: aliasesGenerated.month2,
  month3: aliasesGenerated.month3,
  month4: aliasesGenerated.month4,
  next: aliasesGenerated.next,
  no: aliasesGenerated.no,
  no2: aliasesGenerated.no2,
  no3: aliasesGenerated.no3,
  no4: aliasesGenerated.no4,
  no5: aliasesGenerated.no5,
  other: aliasesGenerated.other,
  reactSelect13Input: aliasesGenerated.reactSelect13Input,
  reactSelect14Input: aliasesGenerated.reactSelect14Input,
  reactSelect15Input: aliasesGenerated.reactSelect15Input,
  removeConviction: aliasesGenerated.removeConviction,
  removeConviction2: aliasesGenerated.removeConviction2,
  removeConviction3: aliasesGenerated.removeConviction3,
  title: aliasesGenerated.title,
  ukFull: aliasesGenerated.ukFull,
  ukFullAutomaticOnly: aliasesGenerated.ukFullAutomaticOnly,
  ukProvisional: aliasesGenerated.ukProvisional,
  year: aliasesGenerated.year,
  year2: aliasesGenerated.year2,
  year3: aliasesGenerated.year3,
  year4: aliasesGenerated.year4,
  yes: aliasesGenerated.yes,
  yes2: aliasesGenerated.yes2,
  yes3: aliasesGenerated.yes3,
  yes4: aliasesGenerated.yes4,
  yes5: aliasesGenerated.yes5,
} as const satisfies Record<string, ElementKey>;

// Primary type used by Page Objects (business alias keys)
export type AliasKey = keyof typeof aliases;

// Optional: includes generated element keys too (useful for debugging/tools)
export const allAliases = { ...aliasesGenerated, ...aliases } as const;
export type AnyAliasKey = keyof typeof allAliases;