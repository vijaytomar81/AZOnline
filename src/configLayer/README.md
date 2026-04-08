# Config Layer

---

# 1. Overview

The **Config Layer** defines all **domain-level configuration** used across the framework.

It acts as the **single source of truth** for:

- platform definitions
- application definitions
- product definitions
- journey context definitions
- schema selection rules

This layer is **pure configuration + normalization**, with **no business logic or runtime execution**.

---

# 2. Purpose

The Config Layer ensures:

- consistent domain modeling across the framework
- centralized control of platform/application/product definitions
- deterministic schema selection
- decoupling between data builder and execution layer
- strong typing and validation for inputs

---

# 3. Core Concepts

## Platform

Represents the entry point system.

Examples:

- Athena
- PCW
- PCWTool

---

## Application

Represents the application or channel.

Examples:

- AzOnline
- CTM
- CNF

---

## Product

Represents the insurance product.

Examples:

- Motor
- Van
- Home

---

## Journey Context

Represents the journey type.

Supported:

- NewBusiness
- Renewal
- MTC
- MTA (future extension)

---

# 4. Responsibilities

The Config Layer is responsible for:

- defining enums/constants for domain entities
- normalizing CLI/user inputs
- validating supported values
- resolving schema selection inputs
- exposing strongly typed models

---

# 5. Folder Structure

```
src/configLayer
│
├── models
│   ├── platform.config.ts
│   ├── application.config.ts
│   ├── product.config.ts
│   └── journeyContext.config.ts
│
├── normalizers
│   ├── normalizePlatform.ts
│   ├── normalizeApplication.ts
│   └── normalizeProduct.ts
│
└── domain
    └── (future domain-specific logic)
```

---

# 6. Platform Model

Defines all supported platforms.

Example:

- ATHENA
- PCW
- PCW_TOOL

Used for:

- schema selection
- routing
- execution behavior

---

# 7. Application Model

Defines supported applications.

Example:

- AZONLINE
- CTM
- CNF

Used for:

- output path structure
- execution context

---

# 8. Product Model

Defines supported products.

Example:

- MOTOR
- VAN
- HOME

Used for:

- output organization
- test coverage segmentation

---

# 9. Journey Context Model

Defines journey types.

Example:

- NEW_BUSINESS
- RENEWAL
- MTC

Structure:

```
{ type: "NewBusiness" }
```

---

# 10. Normalization

All CLI inputs are normalized via:

- normalizePlatform
- normalizeApplication
- normalizeProduct

Purpose:

- case-insensitive handling
- alias support
- strict validation

---

# 11. Schema Selection Integration

The Config Layer provides inputs for schema selection.

Flow:

```
CLI → Config Layer → Data Layer → Schema Selection
```

Schema is selected using:

- journeyContext
- platform

Defined in:

src/dataLayer/data-definitions/schemaSelection.config.ts

---

# 12. Example Flow

```
Input:

--platform Athena
--application AzOnline
--product Motor
--journeyContext NewBusiness

↓

Normalized:

platform = ATHENA
application = AZONLINE
product = MOTOR
journeyContext = { type: NEW_BUSINESS }

↓

Passed to Data Layer

↓

Schema resolved:
new_business_journey
```

---

# 13. Design Principles

The Config Layer is:

- centralized
- strongly typed
- normalization-first
- validation-driven
- dependency-free (no runtime coupling)
- reusable across layers

---

# 14. Extension Guide

To add new platform:

1. update platform.config.ts
2. update normalizePlatform.ts
3. update schemaSelection.config.ts (if needed)

---

To add new application:

1. update application.config.ts
2. update normalizeApplication.ts

---

To add new product:

1. update product.config.ts
2. update normalizeProduct.ts

---

To add new journey:

1. update journeyContext.config.ts
2. update schemaSelection.config.ts
3. implement schema in dataLayer

---

# 15. Boundaries

Config Layer DOES:

- define domain
- normalize inputs
- validate values

Config Layer DOES NOT:

- read Excel
- build data
- execute tests
- manage runtime state

---

# 16. Relationship with Other Layers

| Layer | Responsibility |
|------|----------------|
| Config Layer | domain + normalization |
| Data Layer | schema + data generation |
| Execution Layer | runtime + test execution |

---

# 17. Future Enhancements

- subtype support for MTA journeys
- richer platform capability mapping
- environment-based configuration overrides
- feature flags for platform-specific behavior

---