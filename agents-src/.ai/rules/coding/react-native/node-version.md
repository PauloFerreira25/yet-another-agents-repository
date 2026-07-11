---
name: react-native-node-version
Scope: Before installing dependencies, running any Expo/Metro CLI command, or configuring CI or a devcontainer for this project
description: This project's toolchain requires Node.js 22 — Node 24 is not yet supported and must never be used
---

This project's React Native/Expo toolchain requires **Node.js 22**. Node 24 is not yet supported — never install dependencies, run `expo`/`eas` commands, or configure CI/devcontainer images against Node 24 (or any version other than 22) unless a human explicitly confirms support has changed.

## Enforce and verify

Before running any `npm install`, `npx expo ...`, or `eas ...` command, check the active Node version:

```bash
node -v
```

If it does not resolve to a `v22.x.x`, switch to Node 22 before proceeding — do not run the command anyway "to see if it works." A tooling failure caused by the wrong Node version can look like an unrelated bug; ruling out the runtime version first avoids chasing a false lead.

## Pin the version in the project

```
# .nvmrc
22
```

```json
// package.json
{
  "engines": { "node": "22.x" }
}
```

## CI and devcontainer

Any CI workflow file or `.devcontainer/devcontainer.json` image/feature that installs Node must pin `22`, never `lts/*`, `latest`, or an unpinned major — those can silently resolve to 24 once it becomes the LTS default and break the build.

When scaffolding a new project (see `Project Scaffold`) or reviewing an existing one, verify `.nvmrc` and `engines.node` exist and say `22` before considering setup complete.
