---
name: spec-implementation-marker
Scope: After finishing implementation work driven by a spec document
description: Marks a domain spec document's header with this agent's name, implementation status, and date, so specs that are Final but not yet implemented — or only partially implemented — by a given agent can be identified.
---

This rule applies only to domain spec documents (the header format defined by
`.ai/rules/analysis/spec-format.md`: `Domain / Last updated / Status`). It never applies to
global constraint files (`_global/<name>.md`, defined by
`.ai/rules/analysis/global-constraints.md`) — those are shared technical standards, not
implementation targets.

A spec is "driven by" only when it was explicitly presented as the task's input — by the human
directly, or relayed verbatim through `master-of-puppets`. Never infer that a spec is being
implemented from incidental reads (e.g. a spec opened only for reference context) or from
memory of a prior session.

A single task may be driven by more than one spec document. Mark each spec independently, at
the moment work on that specific spec is finished — do not wait for every spec in the task to
finish before marking any of them.

## Line format

Add or update a line in the spec's header:

```
<agent-name>-implemented: <status>, <ISO 8601 date>
```

`<agent-name>` is this agent's own `name` frontmatter value (e.g. `aws-lambda-typescript`,
`react-web`). `<status>` is `complete` or `partial`:

- `complete` — every part of the spec relevant to this agent's domain was implemented (e.g. for
  `cdk`, every infrastructure requirement the spec implied; for `aws-lambda-typescript`, every
  use case within its layer). Use Cases outside this agent's domain do not count against
  completeness.
- `partial` — anything short of that: an interrupted session, a deliberately staged rollout, a
  blocked dependency, or any other gap.

The agent decides the status itself, using its own judgment of domain-relevant coverage. No
mandatory human confirmation is required before marking — if genuine ambiguity exists about
coverage, resolve it per the How to Think rule instead of guessing.

Example:
```
aws-lambda-typescript-implemented: complete, 2026-07-16T14:32:00Z
```

## Writing the line

Immediately before editing, re-read the spec file — do not reuse an earlier read from the same
session. This avoids clobbering a line another agent may have added or updated concurrently.

Run `date -u +"%Y-%m-%dT%H:%M:%SZ"` via the Bash tool to get the current datetime. Never
hardcode or assume a date.

If a line for this agent's name already exists in the header, update it in place (status and/or
date) instead of adding a duplicate. Otherwise, insert the new line as the last line before the
closing `---`, preserving every other line in the header untouched.

If the spec file has no header block, do not add one — this rule only marks specs that already
carry the header defined by the Spec Format rule.

Use `Edit` to modify only the header lines. Never touch the rest of the spec's content.

Each agent that implements from the same spec adds its own line — never overwrite or remove
another agent's line.
