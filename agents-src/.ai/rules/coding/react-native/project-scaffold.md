---
name: react-native-project-scaffold
Scope: When initializing a new React Native project from scratch
description: Scaffold with create-expo-app, then install the full stack in order
---

## Step 1 — Confirm project name with the human

Before running any command, infer the project name from context — conversation history, existing folder names, or any explicit mention. Present your understanding and ask the human to confirm or correct it:

"Based on our conversation, I'll create the project at `/workspace/<inferred-name>-mobile`. Confirm, or tell me a different name."

Only proceed after receiving explicit confirmation.

## Step 2 — Scaffold in the workspace

```bash
cd /workspace
npx create-expo-app@latest <project-name>-mobile --template default
cd <project-name>-mobile
```

## Step 3 — Set up Expo Router (already included by the default template) and file structure

Confirm `app/` exists with `expo-router` as the entry point in `package.json` (`"main": "expo-router/entry"`). Create the `(public)`/`(private)` groups and `src/` layer directories per `Folder Structure`.

## Step 4 — Install NativeWind and gluestack-ui

```bash
npx expo install nativewind tailwindcss react-native-reanimated react-native-safe-area-context
npx gluestack-ui init
```

`gluestack-ui init` scaffolds `src/component/ui/` and the `GluestackUIProvider`. Verify `tailwind.config.js` `content` globs include both `app/**` and `src/**` after init — the CLI sometimes only wires one.

## Step 5 — Install runtime dependencies

```bash
npx expo install \
  expo-router \
  expo-splash-screen \
  expo-secure-store \
  expo-localization \
  expo-image \
  react-native-mmkv \
  react-native-gesture-handler \
  @shopify/flash-list \
  @shopify/react-native-skia

npm install \
  @tanstack/react-query \
  zustand \
  react-hook-form \
  @hookform/resolvers \
  zod \
  victory-native \
  moti \
  i18next \
  react-i18next
```

Packages with native code go through `npx expo install`; pure-JS packages use plain `npm install` — see `Package Scripts`.

## Step 6 — Install dev dependencies (testing, linting)

```bash
npm install -D jest jest-expo @testing-library/react-native eslint eslint-config-expo babel-plugin-module-resolver
```

Configure `jest` in `package.json` per `Testing`, and `eslint.config.js` per the ESLint rule.

## Step 7 — Configure path aliases

Wire `@/*` in both `tsconfig.json` and `babel.config.js` per `Path Aliases` — both must be updated together.

## Step 8 — EAS setup

```bash
npx eas login
npx eas build:configure
```

This generates `eas.json` — configure the `development`/`preview`/`production` profiles per `Build & Release` before the first build.

## Step 9 — Devcontainer / Expo Go note

Expo's dev server (`expo start`) requires the physical device or simulator to reach the Metro bundler's host and port. Inside a devcontainer, check `.devcontainer/devcontainer.json` for `forwardPorts` and ensure `8081` (Metro's default) is forwarded, and start Metro with `--tunnel` if the device is not on the same network as the container host.
