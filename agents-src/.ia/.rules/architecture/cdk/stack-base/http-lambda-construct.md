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
stacks/components/lambdas/*.ts           ← concrete — extends BaseHttpLambda, domain wiring + route
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

Extends `BaseHttpLambda`. Sets domain-specific env vars, grants, and registers its own route via `addRoute()`. This is the only class that lives in `stacks/components/`.

```ts
// stacks/components/lambdas/list-samples-lambda.ts
import { Construct } from "constructs";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import {
  BaseHttpLambda,
  BaseHttpLambdaProps,
} from "../../base/lambdas/base-http-lambda";

export interface ListSamplesLambdaProps
  extends Omit<BaseHttpLambdaProps, "environment"> {
  readonly table: dynamodb.Table;
}

export class ListSamplesLambda extends BaseHttpLambda {
  constructor(scope: Construct, id: string, props: ListSamplesLambdaProps) {
    super(scope, id, {
      ...props,
      environment: {
        SAMPLES_TABLE: props.table.tableName,
      },
    });

    props.table.grantReadData(this.fn);

    this.addRoute("ListSamplesIntegration", "/samples", apigwv2.HttpMethod.GET);
  }
}
```

Never add routes inside `BaseHttpLambda` — only in the concrete class. Never receive lambda functions as props in the API Gateway construct. See [[lambda-api-gateway]].
