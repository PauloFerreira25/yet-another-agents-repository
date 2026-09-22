---
name: vue-lint
Scope: Before configuring lint or resolving lint errors in a Vue project
description: oxlint-vue is the single linter, replacing the oxlint binary so that template rules run; ESLint is not part of this stack.
---

This stack lints with `oxlint-vue`, a drop-in replacement for the `oxlint` binary that adds Single File Component and `<template>` support while passing JavaScript and TypeScript through to oxlint unchanged. Existing oxlint configuration continues to apply.

Invoke `oxlint-vue` in the project's lint script. Never invoke `oxlint` directly in a Vue project — it parses the script block of a Single File Component but does not read the template, so every template rule silently does nothing.

**ESLint is not part of this stack.** Never add `eslint`, `eslint-plugin-vue` or `eslint-plugin-oxlint` to a project following these rules. They exist only as the fallback described below.

## Why this is an exception, and when it ends

This is a deliberate exception to [[common/dependency-version-matrix]], which otherwise requires a stable release.

The forcing reason: oxlint alone does not lint Vue templates, and the oxc project has stated that full compatibility with `eslint-plugin-vue` is not a target. Template rules are where the defects that matter live — a missing `v-for` key, an unused component, unsanitized markup. `oxlint-vue` covers them; it is pre-1.0 with a single maintainer.

Before pinning a version, confirm the project is still actively maintained.

The exit path, if it is not: revert to `oxlint` for script and TypeScript, add ESLint restricted to `eslint-plugin-vue` template rules, and use `eslint-plugin-oxlint` to switch off everything oxlint already covers. That is the configuration this stack would otherwise have used, so the cost of leaving is low — which is what makes the exception acceptable.

Revisit this whenever oxlint gains native template linting, at which point the extra dependency is no longer needed and is removed.

## Resolving findings

Fix the cause. Never silence a rule with an inline disable comment to make output clean.

Where a disable is genuinely correct, scope it to the single line, name the rule explicitly, and state the reason in the comment. A bare, file-wide disable is never acceptable.

Never disable a rule project-wide to resolve a finding in one file.

See [[coding-principles/code-quality]] for the general principles.
