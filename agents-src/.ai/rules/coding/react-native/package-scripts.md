---
name: react-native-package-scripts
Scope: Before setting up or modifying package.json scripts, or installing dependencies in an Expo project
description: Expo scripts for dev, build, and test; expo install replaces npm install for native-linked packages
---

## Installing dependencies

Use `npx expo install <package>` instead of `npm install <package>` for any package with a native module — Expo resolves the version compatible with the installed SDK, which plain `npm install` does not know how to do:

```bash
# correct — Expo resolves the SDK-compatible version
npx expo install @shopify/flash-list

# wrong for native-linked packages — may install an incompatible version
npm install @shopify/flash-list
```

Pure-JS packages with no native code (Zustand, Zod, TanStack Query) can use plain `npm install` — there is no version-compatibility concern for those.

## Scripts

```json
{
  "scripts": {
    "start":      "expo start",
    "android":    "expo start --android",
    "ios":        "expo start --ios",
    "lint":       "expo lint",
    "typecheck":  "tsc --noEmit",
    "test":       "jest",
    "test:watch": "jest --watch",
    "build:preview":    "eas build --profile preview",
    "build:production": "eas build --profile production",
    "ci": "npm run lint && npm run typecheck && npm run test"
  }
}
```

- `start` — Metro dev server; `android`/`ios` shortcuts open the respective simulator/dev client directly
- `typecheck` — separate from `build`, since there is no `tsc -b && ...` bundling step the way Vite's `build` script has; Metro never type-checks
- `ci` — lint, typecheck, tests; each step must pass before the next runs. There is no build step in `ci` — a native build only makes sense as an explicit `eas build` invocation, not part of every commit's checks

Never use `vite`, `vitest`, or `tsc -b` scripts in an Expo project — those are the web stack's tooling.
