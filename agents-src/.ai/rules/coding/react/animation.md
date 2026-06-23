---
name: animation
Scope: When adding animations, transitions, or motion to components
description: Motion for component animations; Auto-Animate for list/DOM change transitions; Tailwind for micro-transitions
---

Use three layers of animation — each for a different scope:

1. **Tailwind** (`transition`, `duration-*`, `animate-*`) — hover states, color transitions, simple show/hide
2. **Motion** (`motion/react`) — component enter/exit, layout animations, route transitions, orchestrated sequences
3. **Auto-Animate** (`@formkit/auto-animate`) — list add/remove/reorder with zero config

Never use GSAP, React Spring, or CSS keyframe animations directly — they are covered by the three layers above.

## Motion

```bash
npm install motion
```

Use `<motion.div>` for elements that animate on mount, unmount, or layout change:

```tsx
import { motion, AnimatePresence } from 'motion/react'

// enter/exit animation
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.div>
  )}
</AnimatePresence>

// layout animation — element repositions smoothly when siblings change
<motion.li layout key={item.id}>
  {item.nome}
</motion.li>
```

Use `AnimatePresence` whenever an element conditionally renders — it enables the `exit` animation before unmounting.

Keep `duration` short for UI transitions: `0.1`–`0.2s` for micro-interactions, `0.2`–`0.35s` for panels and modals. Never exceed `0.5s` for interface elements.

## Auto-Animate

```bash
npm install @formkit/auto-animate
```

Use `useAutoAnimate` on the parent container of a dynamic list. Auto-Animate handles add, remove, and reorder automatically:

```tsx
import { useAutoAnimate } from '@formkit/auto-animate/react'

export function ProdutoList({ produtos }: { produtos: Produto[] }) {
  const [parent] = useAutoAnimate()

  return (
    <ul ref={parent}>
      {produtos.map(p => (
        <li key={p.id}>{p.nome}</li>
      ))}
    </ul>
  )
}
```

Use Auto-Animate when:
- A list renders items that can be added, removed, or reordered
- You want zero-config smooth DOM transitions

Do not use Auto-Animate for enter/exit of entire sections or modals — use Motion for those.

## When to use Tailwind only

Tailwind is sufficient for:
- Button hover/focus states (`hover:bg-primary/90 transition-colors`)
- Skeleton loading placeholders (`animate-pulse`)
- Spinner (`animate-spin`)
- Simple opacity toggle without unmounting (`transition-opacity`)

Reach for Motion only when the element unmounts or needs a coordinated sequence.
