---
name: cdk-entrypoints-typescript
Scope: Before creating files in bin/ or deploy scripts
description: One TypeScript entrypoint file per region+environment; no cdk.json; each bin/ file is a self-contained CDK app.
---

Each file in `bin/` is a complete, independent CDK app: creates its own `App`, instantiates all stacks for that context, and calls `app.synth()`. Never use a single `app.ts` with context parameters.

Stacks within the same environment are independent of each other — no parent stack instantiates the others. Never use nested stacks.

```ts
// bin/us-east-1-dev.ts
const app = new cdk.App();
const env = { region: devConfig.region, account: devConfig.account };

new UsEast1Dev(app, "UsEast1Dev", { env, config: devConfig });
new UsEast1DevApi(app, "UsEast1DevApi", { env, config: devConfig });
new UsEast1DevData(app, "UsEast1DevData", { env, config: devConfig });

app.synth();
```

`global-stack` has its own entrypoint (`bin/global.ts`) — never instantiate it inside a regional entrypoint.

Each region's `shared-stack` has its own entrypoint (`bin/{region}-shared.ts`) — never instantiate it inside an environment entrypoint.

There is no `cdk.json`. Every npm script passes `--app` explicitly:

```json
"deploy:us-east-1:dev": "cdk deploy --app 'npx ts-node bin/us-east-1-dev.ts' --require-approval never --verbose",
"deploy:us-east-1:prd": "cdk deploy --app 'npx ts-node bin/us-east-1-prd.ts' --require-approval never --verbose"
```

Adding a new region means creating `bin/{region}-{env}.ts` and the corresponding npm script.

To deploy a single stack: `cdk deploy --app 'npx ts-node bin/us-east-1-dev.ts' UsEast1DevApi`
