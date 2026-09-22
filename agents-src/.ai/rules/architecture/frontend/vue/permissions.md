---
name: vue-permissions
Scope: When protecting routes by permission, or showing and hiding UI based on access
description: Route protection is declarative on the route, UI gating is declarative at the element, and neither is ever the only enforcement.
---

Permissions are loaded once as part of session state and held in the session store. Never re-fetch them per component, and never derive them from the presence of a token.

## Route protection

Declare the requirement on the page itself, through page meta, and enforce it in a single navigation guard in `app/middleware/` that reads the declaration.

Never write a bespoke check inside a page's own setup. A page that redirects itself when unauthorized has already rendered, and the check is invisible to anyone auditing which routes are protected.

Never enumerate protected routes in a central list that must be kept in sync with the pages.

## UI gating

Hiding an element the user cannot act on is a courtesy, not a control. Express it declaratively at the element, reading from the session store.

Prefer disabling with an explanation over hiding, where the absence of a control would leave the user unable to understand why an action is unavailable.

## The rule that outranks both

**Client-side permission checks are presentation, never enforcement.** Everything above only decides what to draw. The backend authorizes every request regardless, and no client-side gate is treated as a security boundary.

Never omit a server-side check because the UI already hides the action. See [[coding-principles/security]].
