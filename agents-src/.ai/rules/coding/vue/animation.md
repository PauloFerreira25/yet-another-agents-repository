---
name: vue-animation
Scope: When adding animations, transitions, or motion to components
description: Native transitions for the common cases, motion-v for what they cannot express, and motion that always respects a reduced-motion preference.
---

Use Vue's built-in transition components for enter and leave, list reordering and state changes. They cover most of what an interface needs without a dependency.

Reach for `motion-v` when the built-ins cannot express it: gesture-driven motion, sequences with interdependent timing, animation driven by a continuously changing value.

Never animate by manipulating styles in a watcher, and never drive animation from a timer.

## Respecting the user

**Always honor a reduced-motion preference.** Some users experience animation as nausea, and for some it is disabling. Read the preference and reduce to an instant state change or a simple fade.

Never make reduced motion mean no feedback. The state change still needs to be visible; it just arrives without travel.

## Restraint

Animate to explain, never to decorate. Motion earns its place by showing where something came from, what changed, or that the interface is working. Motion that exists to be noticed competes with the content.

Keep durations short. Interface transitions live in the low hundreds of milliseconds; anything longer is felt as latency, and the user is waiting for the application rather than watching it.

Never animate an element that appears during initial load. The first paint is where the user is orienting.

Never block interaction on an animation finishing. A control is operable as soon as it is visible.

## Cost

Animate transform and opacity, which the compositor handles. Animating layout properties forces reflow on every frame and is where animation jank comes from.

Never animate long lists item by item. Animate the container, or nothing.
