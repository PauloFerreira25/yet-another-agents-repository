---
name: native-permissions
Scope: Before requesting camera, location, notifications, or any other OS-level device permission
description: Request native permissions only at the point of use, with a rationale shown first; never request everything at launch
---

This rule covers **OS-level device permissions** (camera, location, microphone, contacts, notifications) — unrelated to the auth/UI permission model covered by `Permissions`, despite the shared name.

## Request at the point of use, never at launch

Never request every permission the app might ever need during `bootstrap()` or on the first screen. Request each permission immediately before the feature that needs it runs, so the OS prompt appears in a context the user understands:

```ts
// wrong — requested at app launch, before the user has any context
useEffect(() => { requestCameraPermission() }, [])

// correct — requested when the user taps "Scan document"
async function handleScanPress() {
  const { status } = await Camera.requestCameraPermissionsAsync()
  if (status !== 'granted') return showPermissionDeniedState()
  openScanner()
}
```

## Check before requesting

Always check the current permission status before prompting — requesting a permission the user already granted or already permanently denied produces a confusing or silently-ignored prompt:

```ts
const { status } = await Camera.getCameraPermissionsAsync()
if (status === 'granted') return openScanner()
if (status === 'denied' && !canAskAgain) return showOpenSettingsPrompt()
const { status: requested } = await Camera.requestCameraPermissionsAsync()
if (requested === 'granted') openScanner()
```

`canAskAgain` distinguishes "not yet asked" from "permanently denied" (user checked "don't ask again", or denied twice on iOS). Once permanently denied, the only path forward is `Linking.openSettings()` — requesting again does nothing.

## Rationale before the OS prompt, especially on iOS

iOS shows its permission dialog exactly once per permission per install; if the user denies it without understanding why the app wants it, there is no second chance without going to Settings. For any non-obvious permission request, show a short explanation in-app immediately before triggering the OS prompt.

## Declare usage descriptions

Every permission requires a usage description string in `app.config.ts`, surfaced by the OS in its prompt — a missing description causes the OS to reject the permission request outright (iOS) or omit context (Android):

```ts
// app.config.ts
{
  ios: {
    infoPlist: {
      NSCameraUsageDescription: 'Usado para escanear documentos de produtos.',
      NSLocationWhenInUseUsageDescription: 'Usado para mostrar lojas próximas.',
    },
  },
  android: {
    permissions: ['CAMERA', 'ACCESS_FINE_LOCATION'],
  },
}
```

Adding or changing a permission is a native-config change — it requires a new build via EAS Build, not just an OTA update (see `Build & Release`).
