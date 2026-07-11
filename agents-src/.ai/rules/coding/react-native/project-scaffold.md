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

### Known failure: `Could not parse JSON returned from "npm pack ... --dry-run"`

If this command fails with an error containing `Could not parse JSON returned from "npm pack <pkg>@<tag> --dry-run"`, **do not debug it** — this is a known, already-diagnosed bug, not a new problem to investigate. Apply the workaround below immediately.

**Root cause**: `create-expo-app` (confirmed on `4.0.0`, no fix published as of this writing — tracked upstream at `expo/expo#31106`, a recurring class of bug across npm versions) calls `npm pack <template>@<tag> --dry-run` internally and parses its stdout as JSON. Starting with npm 12.x (confirmed on `12.0.1`), `--dry-run` alone no longer emits JSON by default — it prints human-readable text — so the parse fails and the scaffold command aborts with that exact error.

**Already tried and confirmed NOT to work** — do not spend time re-attempting any of these:
- `npm_config_json=true` as a command prefix
- `export npm_config_json=true` in the shell before running the command
- `json=true` persisted in `~/.npmrc` (user config)

None of these reach the internal `npm pack` call `create-expo-app` makes — it isolates that call from the user's npm config entirely.

**The workaround** — bypass `create-expo-app`'s downloader and scaffold the template manually:

```bash
# 1. Resolve the current Expo SDK tag for the template at run time — never hardcode
#    a tag (e.g. "sdk-57"), it goes stale the moment a new SDK ships.
TAG=$(npm view expo-template-default dist-tags --json | node -e \
  "process.stdout.write(Object.keys(JSON.parse(require('fs').readFileSync(0,'utf-8'))).sort().pop())")

# 2. Pack with --json (not --dry-run) — this variant still emits valid JSON on
#    npm 12.x and also produces the real .tgz on disk.
npm pack "expo-template-default@${TAG}" --json > pack.json

# 3. Extract into the target project directory.
TARBALL=$(node -e "console.log(Object.values(JSON.parse(require('fs').readFileSync('pack.json','utf-8')))[0].filename)")
mkdir -p /workspace/<project-name>-mobile
tar -xzf "$TARBALL" -C /workspace/<project-name>-mobile --strip-components=1
cd /workspace/<project-name>-mobile
```

Then finish what `create-expo-app` would normally have done:

- The tarball contains a file literally named `gitignore` (no leading dot) — rename it to `.gitignore`.
- Edit `package.json`'s `"name"` field to the real project name — the template ships with the template's own name.
- Run `npm install`.

This manual path only replicates the template download/extraction step — it does not run any other `create-expo-app` prompt or flag.

**Always try the normal `npx create-expo-app@latest` command first** on a new project — only fall back to this workaround when the exact error above appears. Do not skip straight to the manual path by default; the underlying npm/create-expo-app version combination may already be fixed by the time this runs again.

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
