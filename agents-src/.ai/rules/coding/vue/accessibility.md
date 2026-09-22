---
name: vue-accessibility
Scope: When creating interactive components, forms, dialogs, or page layouts
description: Semantic elements first, every control labelled and reachable by keyboard, and state never signalled by color alone.
---

Use the semantic element for the job. A button is a `<button>`, a link is an `<a>` with a destination. A `<div>` with a click handler is invisible to assistive technology, unreachable by keyboard, and has to have every one of those behaviors rebuilt by hand.

Use the UI library's components rather than rebuilding their behavior — they already implement focus management, keyboard interaction and the necessary roles. See [[coding/vue/ui-library-extension]].

## Labels

Every control has an accessible name. A form field is associated with a real label, not a placeholder — a placeholder disappears the moment the user types and was never a label to begin with.

An icon-only control carries an accessible name in text. Never rely on a tooltip, which does not exist for a keyboard or screen-reader user.

Accessible names are translated — see [[coding/vue/i18n]].

## Keyboard

Everything actionable is reachable and operable by keyboard, in an order that matches the visual order.

Never remove the focus indicator. Restyle it if the default does not suit the design, but never to the point where a keyboard user cannot tell where they are.

A dialog traps focus while open, returns focus to the element that opened it when closed, and closes on the escape key.

## State and feedback

Never signal state by color alone. Pair it with text, an icon or a shape, so the distinction survives for a reader who cannot distinguish the hues.

Announce content that appears without a user action — a validation summary, a completed background operation — through a live region. A visual-only change is invisible to a screen-reader user.

Associate a validation message with the field it describes, and mark the field invalid, so it is announced when the field receives focus.

## Structure

One `<h1>` per page, with heading levels descending without gaps. Never choose a heading level for its size; that is what styling is for.

Give the page a title that identifies it, so a user with many tabs open can tell them apart.
