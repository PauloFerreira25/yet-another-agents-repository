---
name: push-notifications
Scope: When implementing push notifications, registering for a push token, or handling a notification tap
description: expo-notifications for permission, token registration, and handling; token registration follows the same request-at-point-of-use rule as other native permissions
---

Use `expo-notifications` for push notifications — permission request, token registration, and foreground/tap handling all go through this module.

```bash
npx expo install expo-notifications expo-device
```

## Requesting permission and registering a token

Follow `Native Permissions`: request at the point where push notifications are meaningful to the user (e.g. after they opt into notifications for an order they just placed), not unconditionally at launch.

```ts
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) return null // push tokens do not work in simulators

  const { status: existing } = await Notifications.getPermissionsAsync()
  let status = existing
  if (existing !== 'granted') {
    const { status: requested } = await Notifications.requestPermissionsAsync()
    status = requested
  }
  if (status !== 'granted') return null

  const { data: token } = await Notifications.getExpoPushTokenAsync()
  return token
}
```

Send the resulting token to the backend via the existing service layer (`notificationService.registerToken(token)`, following `Service Layer`) — never store it only on-device; the backend needs it to send notifications.

## Foreground behavior

By default, a notification received while the app is foregrounded does not show a banner — set an explicit handler at app startup (in the root layout, alongside other bootstrap concerns):

```ts
// src/lib/notifications.ts
import * as Notifications from 'expo-notifications'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
})
```

## Handling a tap

Listen for the response outside of any single screen — a tapped notification can open the app from a cold start, so the listener must be registered in the root layout, not a screen that may not be mounted yet:

```ts
Notifications.addNotificationResponseReceivedListener((response) => {
  const { screen, id } = response.notification.request.content.data as { screen: string; id: string }
  router.push({ pathname: screen, params: { id } })
})
```

## Native config

Adding `expo-notifications` requires a config plugin entry in `app.config.ts` and, like any native module addition, a new build via EAS Build — it cannot ship through an OTA update alone (see `Build & Release`).
