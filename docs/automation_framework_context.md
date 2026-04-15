# ChatGPT Context — Playwright Automation Framework (Config-Driven Architecture)

This document provides context for AI assistants (such as ChatGPT) to understand the automation framework used in this repository.

---

## Framework Overview

This repository implements a scalable, config-driven Playwright automation framework.

Key capabilities:
- page discovery (scanner)
- page-object generation
- structured data execution
- scenario-based E2E execution
- validation and repair
- evidence generation via EvidenceFactory

---

## Architecture Layers

src/
- configLayer        → source of truth (platform, application, product)
- dataLayer          → excel → json pipeline
- executionLayer     → runtime orchestration
- businessLayer      → journeys & actions
- toolingLayer       → scanner, generator, validator, repair
- evidenceFactory    → artifact generation
- utils              → shared utilities

---

## Design Principles

- Config-driven (no hardcoding)
- Strong separation of concerns
- Evidence-first architecture
- Executor-driven execution
- Scalable for multi-platform systems

---

## Toolchain

Browser → Scanner → Page Maps → Generator → Page Objects → Validator → Repair

---

## Execution Layer

Responsibilities:
- run scenarios
- manage execution context
- execute items via registry
- collect results
- integrate EvidenceFactory

Execution Flow:
CLI → runScenarios → runScenarioWorker → runScenarioItems → runExecutionItem → executor → results → EvidenceFactory

---

## Evidence System

- Centralized via EvidenceFactory
- Supports JSON + Excel outputs
- Handles:
  - item evidence
  - summary evidence
  - finalization
  - archive

---

## Key Rules

- No hardcoding of platform/application/product
- Use configLayer as source of truth
- elements.ts is source of truth for page objects
- Execution layer must remain orchestration-only
- Evidence must be config-driven

---

## Future Extension

- retry logic
- flaky detection
- CI metadata
- richer reporting
