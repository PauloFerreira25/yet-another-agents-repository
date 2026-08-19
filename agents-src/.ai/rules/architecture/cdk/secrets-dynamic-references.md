---
name: cdk-secrets-dynamic-references
Scope: Before adding a Secrets Manager value to a Lambda's environment, or when a deployed Lambda needs to pick up a changed secret value
description: A CloudFormation dynamic reference to a Secrets Manager value does not re-resolve when only the secret's value changes — the Lambda needs its own Environment diff to force CloudFormation to fetch the new value.
---

Never assume that changing a Secrets Manager secret's value alone updates a Lambda that reads it via a dynamic reference (`secretsmanager.Secret.secretValue.unsafeUnwrap()` or equivalent) in its environment. CloudFormation only resolves a `{{resolve:secretsmanager:...}}` reference when it calls an update operation on the resource that contains it. If nothing else on that Lambda's template properties changed, CloudFormation sees no diff, never touches the Lambda, and the function keeps running with the stale value — even though the underlying `AWS::SecretsManager::Secret` resource itself reports `UPDATE_COMPLETE`.

Never use a CDK `Tag` (`cdk.Tags.of(fn).add(...)`) as the mechanism to force that update. Lambda tags are applied through a separate API call (`TagResource`) from the one that applies `Environment`, `Description`, `MemorySize`, and the function's other configuration (`UpdateFunctionConfiguration`). A tags-only diff never triggers `UpdateFunctionConfiguration`, so the dynamic reference inside `Environment.Variables` is never re-evaluated — the deploy still succeeds and still serves the old value.

The correct forcing mechanism is a synthetic environment variable, placed inside the same `environment` map as the dynamic-reference variable, whose value is a hash of the plaintext secret:

```ts
environment: {
  THIRD_PARTY_API_KEY: secret.secretValue.unsafeUnwrap(),
  THIRD_PARTY_API_KEY_VERSION: hashOf(plaintextApiKey), // never read by the handler — exists only to force the diff
}
```

Because this literal string changes whenever the source value changes, CloudFormation sees a real diff on `Environment`, calls `UpdateFunctionConfiguration`, and that single call re-resolves every dynamic reference inside the same `Environment.Variables` map — including the actual secret variable the version variable exists only to drag along.

An alternative that avoids this class of problem entirely: read the secret at runtime inside the handler (`GetSecretValue`) instead of injecting it via an environment variable. That trades a per-invocation Secrets Manager call — its own latency and cost — for never needing a forced redeploy when the secret changes or rotates. Prefer the environment-variable-plus-version-marker pattern for secrets that change rarely and where an extra network call per invocation is unacceptable; prefer runtime retrieval for secrets that rotate automatically or change often.

For more detail on when CloudFormation resolves a dynamic reference: [Get a secret or secret value from Secrets Manager](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references-secretsmanager.html).
