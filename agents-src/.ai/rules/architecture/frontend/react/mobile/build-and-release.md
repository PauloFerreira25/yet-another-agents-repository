---
name: build-and-release
Scope: Before configuring a build profile, publishing an OTA update, or preparing a store submission
description: EAS Build produces installable binaries per profile; EAS Update ships JS-only changes over the air between binary releases
---

## EAS Build profiles

`eas.json` defines named build profiles — never hand-configure native build settings outside this file:

```json
{
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "preview": { "distribution": "internal" },
    "production": { "autoIncrement": true }
  }
}
```

- `development` — dev client build, used for local development with custom native modules
- `preview` — internal distribution build for QA, mirrors production native config
- `production` — store-bound build; `autoIncrement` bumps the build number automatically

Never ship a `development` profile build to end users, and never skip `preview` for a change that touches native modules or config plugins.

## App versioning

`app.config.ts` owns `version` (user-facing, semantic) and native build numbers are derived by EAS via `autoIncrement`. Bump `version` deliberately for store releases; never bump it for an OTA-only update.

## EAS Update (OTA)

JavaScript, asset, and most config changes can ship without a store review via `eas update`. Native code changes, new native dependencies, and most `app.config.ts` plugin changes cannot — those require a new binary via EAS Build.

Each update targets a **channel**, mapped to a build profile:

```bash
eas update --branch production --message "fix: correct total calculation"
```

Never publish an OTA update that changes the native API surface (new native module, permission, or config plugin) — the running binary does not have the corresponding native code and will crash or silently no-op. When in doubt whether a change is OTA-safe, the deciding question is: does this change anything outside `src/` and JS-evaluable config? If yes, it needs a new build.

## Store submission

`eas submit` uploads a production build to the App Store / Play Store. Store metadata (screenshots, descriptions, privacy answers) is out of this agent's scope — it is a product/release-management concern, not a code change.
