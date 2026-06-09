---
name: cdk-stack-dependencies
Scope: When sharing values between stacks
description: Three mechanisms for sharing values between stacks — each for a specific case.
---

Use exactly one mechanism per case:

| Case | Mechanism |
|---|---|
| Predictable value (name you define) | config |
| AWS-generated ID/ARN, stacks in the same environment | CfnOutput + Fn.importValue |
| Value that crosses scope boundary (global→regional, shared→env) | SSM Parameter Store |

Decision tree:

```
Is the value predictable (you define the name)?
  └─ yes → config
  └─ no (AWS-generated ID/ARN)
       └─ does it cross a scope boundary (different entrypoints)?
            └─ yes → SSM Parameter Store
            └─ no (same entrypoint / same environment) → CfnOutput + Fn.importValue
```

Canonical examples:

| Resource | Created by | Consumed by | Mechanism | Reason |
|---|---|---|---|---|
| Route53 Hosted Zone | `global-stack` | regional stack | SSM | AWS-generated ID, crosses global→regional |
| ACM Certificate | `us-east-1/shared-stack` | `us-east-1/dev-stack` | SSM | AWS-generated ARN, crosses shared→env |
| S3 Bucket | `us-east-1/dev-stack` | `us-east-1/dev/api-stack` | config | Name defined by you, predictable |
| EC2 Instance | `us-east-1/dev-stack` | `us-east-1/dev/api-stack` | CfnOutput + importValue | AWS-generated ID, same entrypoint |

`exportName` convention for CfnOutput: `{StackId}-{resource-name}-{attribute}`

SSM path convention: `/{scope}/{type}/{resource-name}/{attribute}` in kebab-case:

```
/global/route53/example-com/hosted-zone-id
/us-east-1/shared/acm/api-example-com/cert-arn
/us-east-1/dev/ec2/ec2-dev-db-01/instance-id
```

The `{resource-name}` comes from config — creating and consuming stacks use the same name to build the path.

Never use `Fn.importValue` across different entrypoints — it only resolves within the same CDK app.
