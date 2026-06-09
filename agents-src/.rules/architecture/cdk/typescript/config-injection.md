---
name: cdk-config-injection-typescript
Scope: Before passing config to a stack or component
description: Config flows from bin/ into stacks via props.config — never imported directly by stacks or components.
---

Config is injected into stacks via `props.config` by the entrypoint (`bin/`). Stacks never import config files directly.

When an environment stack needs values from the shared scope, `bin/` imports both configs and merges them before passing to the stacks — `dev-config.ts` never imports `shared-config.ts` directly:

```ts
// bin/us-east-1-dev.ts
import { sharedConfig } from "../config/region/us-east-1/shared-config";
import { devConfig } from "../config/region/us-east-1/dev/dev-config";

const config = { ...sharedConfig, ...devConfig };

new UsEast1Dev(app, "UsEast1Dev", { env, config });
```

The config type is defined and exported in the config file itself. The stack imports that type only for its props — the type is not propagated further:

```ts
// stacks/region/us-east-1/dev/db-stack.ts
import { UsEast1DevConfig } from "../../../../config/region/us-east-1/dev/dev-config";

interface DbStackProps extends StackProps {
  config: UsEast1DevConfig;
}
```

All sub-stacks of the same environment receive the full config object — the entrypoint passes the same object to each. Never create partial config types per sub-stack.

Components never import config directly — they receive individual values via props:

```ts
new RdsAurora(this, "RdsAurora", {
  databaseName: props.config.databaseName,  // string
  rootPassword: props.config.rootPassword,  // string
});
```

Never pass the config object to a component — always extract and pass individual values.
