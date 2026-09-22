---
name: vue-ui-library-extension
Scope: When creating or extending a UI component
description: Never modify a component belonging to the UI library; extend by wrapping it in an atom that owns the addition.
---

Never edit, patch or fork a component that belongs to the UI library. It is upgraded as a dependency, and a local modification is silently lost or silently conflicts on the next upgrade.

When a library component needs variants, defaults or behavior it does not provide, wrap it in an atom under `app/components/atom/` that owns the addition:

```
app/components/(atom)/AppButton.vue    ← wraps the library button
```

The wrapper forwards attributes and slots so the original's full interface stays available, and adds only what is genuinely new. Never reimplement what the wrapped component already does.

Prefix wrappers consistently so a reader can tell at a glance whether a component in the template is ours or the library's.

**Configure before wrapping.** Most of what looks like a missing variant is a default the library exposes through its own configuration. Set it once there rather than creating a wrapper whose only purpose is to pass the same prop everywhere.

**Never build from scratch what the library provides.** Check the library's component set before writing a new component; a hand-built replacement carries none of the accessibility and theming behavior the library already implements.

When a component genuinely has no equivalent in the library, build it as a normal component under the appropriate Atomic Design level, and make it consume theme tokens rather than hard-coded values — see [[coding/vue/theming]].

This rule is written about the UI library as a role, not about one product. It holds unchanged if the library is ever replaced.
