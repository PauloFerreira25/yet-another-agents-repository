---
name: cdk-components-inheritance-typescript
Scope: Before creating or extending a component
description: TypeScript class hierarchy for CDK components — abstract base in stacks/base/, concrete in stacks/components/, regional override in stacks/region/{region}/base/ or components/.
---

See [[cdk-directory-and-layers]] for where each file lives. See [[cdk-stack-base-http-lambda-construct]] for a complete sample of the hierarchy applied to HTTP Lambda constructs.

Use inheritance, not composition. When a region requires a structural variant of a component, extend the base class — do not add a conditional parameter. Regional behavior is a structural invariant, not optional behavior.

Abstract base classes live in `stacks/base/`. Concrete components live in `stacks/components/`. A region-specific override lives in `stacks/region/{region}/base/` (if abstract) or `stacks/region/{region}/components/` (if concrete) — only when the region requires a structural difference.

Instantiate components directly in stacks — never through a factory or helper function. The stack is the composition root.
