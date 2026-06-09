---
name: cdk-components-inheritance-typescript
Scope: Before creating or extending a component
description: Three-level TypeScript class hierarchy for CDK components — abstract base, abstract regional, concrete region-specific.
---

Components follow a three-level inheritance hierarchy that mirrors the directory structure:

```
components/                          ← abstract base — shared contract and common logic
stacks/region/components/            ← abstract regional — adds regional behavior
stacks/region/{region}/components/   ← concrete — region-specific implementation
```

Use inheritance, not composition. Each level's behavior is a structural invariant — every Lambda in `us-east-1` always has VPC attachment and regional endpoints, without exception. This is not optional behavior activated by a parameter; it is part of what it means to be a component of that region. The three-level class hierarchy maps directly to the three-level directory hierarchy.

The abstract base class contains shared logic and extension points — not just an interface. Common resources (IAM base role, log group, tags) are built in the abstract class; subclasses complete what is region-specific:

```ts
// components/base-lambda.ts
abstract class BaseLambda extends Construct {
  protected readonly role: iam.Role;
  // builds base role, common log group
}

// stacks/region/components/regional-lambda.ts
abstract class RegionalLambda extends BaseLambda {
  // adds VPC attachment, regional endpoints
}

// stacks/region/us-east-1/components/us-east-1-lambda.ts
class UsEast1Lambda extends RegionalLambda {
  // concrete implementation for us-east-1
}
```

Instantiate components directly in stacks — never through a factory or helper function. The stack is the composition root.
