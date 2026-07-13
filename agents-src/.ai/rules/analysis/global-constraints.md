---
name: global-constraints
Scope: When a technical constraint is identified or written into a spec
description: Distinguishes domain-scoped constraints from system-wide technical standards, and routes the latter to one or more shared global constraint files instead of duplicating them across domain specs.
---

A constraint is domain-scoped when it applies only to the unit currently being interviewed. A constraint is global only when the human explicitly states it applies to the whole system (e.g. an identifier format, an audit field convention, a naming rule) — never infer this on your own from the content of the constraint alone.

## Location

Global constraint files live in a `_global/` subdirectory, sibling to the domain spec files themselves — never nested inside a domain's own file or folder.

If the specs root directory is not already known in this session, resolve it the same way domain specs are resolved: ask the human, never assume a default path.

Example: if domain specs are saved at `<root>/product.md` and `<root>/order.md`, global constraint files live at `<root>/_global/<name>.md`.

Multiple global files may exist. Each one can hold one or more categories of related standards — the split between files is decided by content (e.g. `_global/identifiers.md`, `_global/audit-fields.md`, or a single `_global/technical-standards.md` covering several categories), not by a fixed count or a one-category-per-file rule.

## When a global constraint is identified during the interview

1. Do not add it to the current domain spec's Constraints section.
2. Resolve the `_global/` directory location as described above, if not already resolved this session.
3. Read every file currently in `_global/`, if the directory exists, and inspect their `## Category` headings — do not rely on filenames alone. Reuse a matching category if one already exists, regardless of which file it lives in.
4. If no existing file fits, confirm a new filename with the human before creating it.
5. If reusing an existing category, compare the new constraint against every entry already listed under it. If it conflicts with an existing entry, apply the contradiction-handling procedure from `interview-conduct.md` — and additionally ask the human whether the new constraint replaces the old one, or both coexist as distinct rules (e.g. one is a scoped exception to the other). Do not proceed until resolved.
6. Append the constraint under the matching category — creating a new category heading within the file if none fits. Use `Edit` to insert into an existing file without touching its other content; use `Write` only when creating the file for the first time.

## Before modifying an existing global file structurally

Appending a brand-new constraint under an existing, unchanged category never requires this check — nothing yet references something that did not exist before. This check applies only when renaming or removing a category, or merging/splitting a global file — any change that could break a reference a domain spec already made.

1. Search the domain spec files in the specs root (excluding `_global/` itself) for any Constraints table row referencing the Global File/Category about to change. Use `Bash` (e.g. `grep`) for the exact `_global/<name>.md` path and category name.
2. If any spec references it, list which specs would end up with a broken reference and ask the human whether to update those specs' Constraints tables to match before proceeding.
3. Only apply the structural change after the human confirms. If they agreed to update the affected specs, do so in the same pass — do not leave a spec with a dangling reference.

## Before writing the Constraints section of any domain spec

1. Resolve the `_global/` directory location as described above, if not already resolved this session.
2. Read every file currently in `_global/`, if the directory exists, and determine which files and categories are relevant to the current domain.
3. Add the Global File/Category reference table to the top of the Constraints section, using the table format defined in the Spec Format rule (`.ai/rules/analysis/spec-format.md`) — never restate the constraint text itself.
4. List domain-scoped constraints (Simple or Model form, per the Spec Format rule) below this table, in the same section.

## Global constraint file format

```
---
Last updated: <ISO 8601>
---

## <Category>
- <Constraint statement>
```

Run `date -u +"%Y-%m-%dT%H:%M:%SZ"` via the Bash tool to set `Last updated` whenever a global file is created or modified. Never hardcode or assume a date.

Reuse an existing category or file before creating a new one. Never remove an existing constraint without explicit human confirmation.
