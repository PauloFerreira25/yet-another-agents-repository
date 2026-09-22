---
name: vue-feedback-patterns
Scope: When displaying feedback for user actions or showing temporary notifications
description: One centrally mounted notification surface driven by a store, never an instance per screen.
---

Transient feedback uses the UI library's own notification component, mounted once in the application layout and driven by a store.

**Never declare a notification component per page.** Multiple instances stack, overlap, and each one disappears when its own page unmounts — so the confirmation of an action that navigates is destroyed by the navigation that follows it.

The store exposes intent-named methods, not styling:

```ts
notify.success('product.created')
notify.error('product.createFailed')
```

Callers state what happened; the store decides how it looks and how long it stays.

Messages are translation keys, never literal strings — see [[coding/vue/i18n]].

## What deserves which surface

**Transient notification** suits a completed action whose result is visible elsewhere, or a background failure the user did not trigger.

**Inline message** suits anything the user must act on. A validation failure belongs next to the field — see [[coding/vue/form-patterns]]. A notification that disappears after four seconds is the wrong place for information the user needs in order to fix something.

**Dialog** suits a decision that must be made before continuing, and nothing else. Never use one to deliver information the user cannot act on.

Never show a notification for an action whose result is already obvious on screen. Confirming what the user can plainly see trains them to dismiss notifications without reading.

Never put a raw error object or a status code in user-facing text. Log the detail and show a message the user can act on — see [[coding/vue/error-handling]].
