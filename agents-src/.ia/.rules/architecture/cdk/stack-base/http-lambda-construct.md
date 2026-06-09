---
name: cdk-stack-base-http-lambda-construct
Scope: Before creating a Lambda construct that exposes an HTTP endpoint
description: Three-level class hierarchy for HTTP Lambda constructs — BaseLambda, BaseHttpLambda, and the concrete domain component.
---

See [[cdk-directory-and-layers]] for where each file lives.

## Class hierarchy

```
stacks/base/lambdas/base-lambda.ts       ← abstract — role, log group, lambda.Function
stacks/base/lambdas/base-http-lambda.ts  ← abstract — extends BaseLambda, adds HttpApi wiring
stacks/components/lambdas/*.ts           ← concrete — one file per domain, owns all lambdas for that domain
```

## BaseLambda

Creates the IAM role, log group, and `lambda.Function`. Never knows about HTTP or domain resources.

```ts
// stacks/base/lambdas/base-lambda.ts
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as logs from "aws-cdk-lib/aws-logs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { RemovalPolicy } from "aws-cdk-lib";

export interface BaseLambdaProps {
  readonly functionName: string;
  readonly assetPath: string;
  readonly handler: string;
  readonly environment?: Record<string, string>;
}

export abstract class BaseLambda extends Construct {
  readonly fn: lambda.Function;
  protected readonly role: iam.Role;
  protected readonly logGroup: logs.LogGroup;

  constructor(scope: Construct, id: string, props: BaseLambdaProps) {
    super(scope, id);

    this.logGroup = new logs.LogGroup(this, "LogGroup", {
      logGroupName: `/aws/lambda/${props.functionName}`,
      removalPolicy: RemovalPolicy.DESTROY,
      retention: logs.RetentionDays.ONE_WEEK,
    });

    this.role = new iam.Role(this, "Role", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole"
        ),
      ],
    });

    this.fn = new lambda.Function(this, "Function", {
      functionName: props.functionName,
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: props.handler,
      code: lambda.Code.fromAsset(props.assetPath),
      role: this.role,
      logGroup: this.logGroup,
      environment: props.environment,
    });
  }
}
```

## BaseHttpLambda

Extends `BaseLambda`. Receives the `HttpApi` as a prop and exposes `addRoute()` for the concrete class to register its own route. Never adds routes itself.

```ts
// stacks/base/lambdas/base-http-lambda.ts
import { Construct } from "constructs";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { BaseLambda, BaseLambdaProps } from "./base-lambda";

export interface BaseHttpLambdaProps extends BaseLambdaProps {
  readonly api: apigwv2.HttpApi;
}

export abstract class BaseHttpLambda extends BaseLambda {
  private readonly api: apigwv2.HttpApi;

  constructor(scope: Construct, id: string, props: BaseHttpLambdaProps) {
    super(scope, id, props);
    this.api = props.api;
  }

  protected addRoute(
    integrationId: string,
    path: string,
    method: apigwv2.HttpMethod
  ): void {
    this.api.addRoutes({
      path,
      methods: [method],
      integration: new HttpLambdaIntegration(integrationId, this.fn),
    });
  }
}
```

## Concrete domain component

One file per domain. The domain class creates all lambdas for that domain internally — each as a separate `BaseHttpLambda` subclass instantiated inside the constructor. It sets domain-specific env vars, grants, and registers all routes. The stack instantiates one domain component and wires it to the table and API.

```ts
// stacks/components/lambdas/samples-lambda.ts
import { Construct } from "constructs";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import {
  BaseHttpLambda,
  BaseHttpLambdaProps,
} from "../../base/lambdas/base-http-lambda";

interface SamplesLambdaFnProps extends Omit<BaseHttpLambdaProps, "environment"> {
  readonly table: dynamodb.Table;
}

class ListSamplesFn extends BaseHttpLambda {
  constructor(scope: Construct, id: string, props: SamplesLambdaFnProps) {
    super(scope, id, {
      ...props,
      environment: { SAMPLES_TABLE: props.table.tableName },
    });
    props.table.grantReadData(this.fn);
    this.addRoute("ListSamplesIntegration", "/samples", apigwv2.HttpMethod.GET);
  }
}

class CreateSampleFn extends BaseHttpLambda {
  constructor(scope: Construct, id: string, props: SamplesLambdaFnProps) {
    super(scope, id, {
      ...props,
      environment: { SAMPLES_TABLE: props.table.tableName },
    });
    props.table.grantWriteData(this.fn);
    this.addRoute("CreateSampleIntegration", "/samples", apigwv2.HttpMethod.POST);
  }
}

export interface SamplesLambdaProps {
  readonly table: dynamodb.Table;
  readonly api: apigwv2.HttpApi;
  readonly assetPath: string;
  readonly handler: string;
}

export class SamplesLambda extends Construct {
  constructor(scope: Construct, id: string, props: SamplesLambdaProps) {
    super(scope, id);

    new ListSamplesFn(this, "ListSamples", {
      functionName: "list-samples",
      assetPath: props.assetPath,
      handler: props.handler,
      api: props.api,
      table: props.table,
    });

    new CreateSampleFn(this, "CreateSample", {
      functionName: "create-sample",
      assetPath: props.assetPath,
      handler: props.handler,
      api: props.api,
      table: props.table,
    });
  }
}
```

The stack instantiates `SamplesLambda` once — it never creates individual lambda constructs directly:

```ts
new SamplesLambda(this, "SamplesLambda", {
  table: samplesTable.table,
  api: samplesApi.api,
  assetPath: props.config.lambdaAssets.samples,
  handler: "index.handler",
});
```

Never add routes inside `BaseHttpLambda` — only in the concrete function class. Never receive lambda functions as props in the API Gateway construct. See [[lambda-api-gateway]].
