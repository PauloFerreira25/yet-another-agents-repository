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
    global/                          ← AWS global resources (Route53, generic IAM roles)
    region/
      components/                    ← constructs shared across all regions
      {region}/
        components/                  ← constructs specific to this region
        shared-stack.ts              ← regional resources with no environment dependency
        dev/
        prd/
  components/                        ← global constructs, no region dependency
```

## The three layers

**components/** — the *how*. A CDK Construct that builds an AWS resource. Never knows which region or environment it serves — receives that via props.

**stacks/** — the *where*. Instantiates and organizes components by region and environment. Contains no resource construction logic — delegates entirely to components. Stacks are composition roots.

**config/** — the *what*. Plain objects with names, values, and parameters. Never imports or instantiates anything from CDK.

## Scope hierarchy

| Level | Scope |
|---|---|
| `config/global` | AWS resources with no region (Route53, generic IAM roles) |
| `config/region/{region}/shared` | Regional resources, environment-independent (VPC, ACM) |
| `config/region/{region}/{env}` | Resources of a specific environment within a region |
| `components/` (root) | Constructs with no region dependency |
| `stacks/region/components/` | Constructs shared across all regions |
| `stacks/region/{region}/components/` | Constructs specific to one region |

The config hierarchy mirrors the stacks hierarchy — each stack consumes the config from the matching scope level.
