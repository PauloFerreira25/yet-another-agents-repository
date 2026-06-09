---
name: lambda-api-gateway
Scope: Before creating or updating an API Gateway construct
description: API Gateway constructs must be standalone — routes are added by lambda constructs, not by the API Gateway itself.
---

Never receive lambda functions as props in an API Gateway construct. Never add routes inside an API Gateway construct.

An API Gateway construct creates only the `HttpApi` resource and exposes it as a public property. It has no knowledge of the lambdas that will integrate with it.

```typescript
export class SamplesApi extends Construct {
  readonly api: apigwv2.HttpApi;

  constructor(scope: Construct, id: string, props: SamplesApiProps) {
    super(scope, id);

    this.api = new apigwv2.HttpApi(this, "Api", {
      apiName: props.apiName,
    });
  }
}
```

Routes are the responsibility of the lambda constructs that own them. Each lambda construct that exposes an HTTP endpoint receives the `HttpApi` as a prop and registers its own route after creating the function.

This inverts the dependency: the API Gateway does not know about lambdas; lambdas know about the API Gateway.
