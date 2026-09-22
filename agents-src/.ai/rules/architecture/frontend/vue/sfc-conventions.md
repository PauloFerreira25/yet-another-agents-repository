---
name: vue-sfc-conventions
Scope: Before writing any Single File Component
description: Block order, script style, and typed props and emits for every SFC.
---

Every component is written as `<script setup lang="ts">`. Never use the Options API, and never write a component without `lang="ts"`.

## Block order

```vue
<script setup lang="ts">
</script>

<template>
</template>

<style scoped>
</style>
```

Script first, always. Beyond readability, the linting toolchain only processes a Single File Component that has an extracted script block — see [[coding/vue/lint]].

Omit the `<style>` block entirely when a component has no styles. Never leave an empty block.

Style is `scoped` by default. Global style belongs in the theme configuration, not in a component — see [[coding/vue/theming]].

## Props and emits

Declare both with type-only syntax. Never use the runtime object form, which duplicates in JavaScript what the type system already states:

```ts
const props = defineProps<{ productId: string; compact?: boolean }>()
const emit = defineEmits<{ select: [id: string]; dismiss: [] }>()
```

Use `withDefaults` when a prop needs a default value. Never declare a prop optional and then substitute a fallback in the body — the default belongs in the declaration, where a reader looking at the component's interface will find it.

Never mutate a prop. A prop is input; if the component needs to change it, it emits and lets the owner decide.

## Template discipline

Always give `v-for` a `key` bound to a stable identity from the data. Never key by array index.

Never place `v-if` and `v-for` on the same element.

Never pass unsanitized content to `v-html`. Where rendered markup is genuinely required, sanitize at the service layer and state why in a comment at the point of use.

Keep expressions in the template simple enough to read at a glance. Anything with a condition chain or a transformation becomes a `computed` in the script block.
