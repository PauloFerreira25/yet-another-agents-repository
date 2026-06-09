---
name: cdk-directory-and-layers
Scope: Before creating any file in cdk/
description: Directory structure and three-layer model (components, stacks, config) for the CDK project.
---

## Directory structure

```
cdk/
  bin/                               ← one entrypoint file per region+environment
  config/
    global/                          ← values with no region or environment dependency
    region/
      {region}/
        shared-config.ts             ← values shared across all environments in this region
        dev/dev-config.ts
        prd/prd-config.ts
  stacks/
    base/                            ← how to build — abstract constructs, never instantiated directly
      {resource-type}/               ← e.g. lambdas/, tables/, apis/, buckets/
    components/                      ← what to instantiate — concrete constructs, ready to use
      {resource-type}/               ← e.g. lambdas/, tables/, apis/, buckets/
    shared/                          ← non-construct shared code
      utils/                         ← helper functions, naming conventions
    global/                          ← AWS global resources (Route53, generic IAM roles)
    region/
      {region}/
        base/                        ← how to build — region-specific abstract overrides
          {resource-type}/
        components/                  ← what to instantiate — region-specific concrete overrides
          {resource-type}/
        shared-stack.ts              ← regional resources with no environment dependency
        dev/                         ← what is instantiated
        prd/                         ← what is instantiated
```

## The three layers

**base/** — *how to build*. Abstract CDK Constructs that define construction logic and extension points. Never instantiated directly. Lives in `stacks/base/` for shared abstractions, or `stacks/region/{region}/base/` for region-specific overrides.

**components/** — *what to instantiate*. Concrete CDK Constructs that own the full construction of a domain resource. Each component encapsulates all AWS resources and wiring for its domain — the stack receives the result and connects it to other components. Every file in `components/` must be directly instantiable. Never place files directly at the root of a `components/` directory — every construct file must live inside a subdirectory named after its AWS resource type (e.g. `lambdas/`, `tables/`, `apis/`, `buckets/`).

**stacks/{region}/{env}/** — *what is instantiated*. What is actually deployed for a given region and environment. Contains zero construction logic — only instantiates components, passes config, and wires outputs together.

**stacks/** — the *where*. Instantiates components and connects them. Contains zero resource construction logic — no `new` calls that build AWS resources directly. Stacks are pure composition roots: they pass config to components and wire the outputs together.

**config/** — the *what*. Plain objects with names, values, and parameters. Never imports or instantiates anything from CDK.

## Scope hierarchy

| Level | Scope |
|---|---|
| `config/global` | AWS resources with no region (Route53, generic IAM roles) |
| `config/region/{region}/shared` | Regional resources, environment-independent (VPC, ACM) |
| `config/region/{region}/{env}` | Resources of a specific environment within a region |
| `stacks/base/` | Abstract constructs — how to build |
| `stacks/components/` | Concrete constructs — what to instantiate |
| `stacks/region/{region}/base/` | Region-specific abstract overrides |
| `stacks/region/{region}/components/` | Region-specific concrete overrides |
| `stacks/region/{region}/{env}/` | What is instantiated — what is deployed |

The config hierarchy mirrors the stacks hierarchy — each stack consumes the config from the matching scope level.
