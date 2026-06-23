---
name: shadcn-tailwind
Scope: When creating or extending a UI component
description: shadcn components in component/ui/ are never modified; extensions are atom wrappers using cva for variants
---

Never modify files under `src/component/ui/`. These are shadcn/ui components — install with `npx shadcn@latest add` and treat as read-only.

When you need additional variants or props beyond what a shadcn component provides, create a wrapper in `src/component/atom/` with the same name:

```
src/component/ui/button.tsx              ← shadcn original, never touch
src/component/atom/button/button.tsx     ← wrapper with extra variants
```

Use `cva` (class-variance-authority) for variant management in wrappers — it is already a dependency of shadcn/ui:

```ts
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Button as ShadcnButton } from '@/component/ui/button'

const buttonVariants = cva('', {
  variants: {
    intent: {
      danger: 'bg-red-500 hover:bg-red-600 text-white',
    },
  },
})

type ButtonProps =
  React.ComponentProps<typeof ShadcnButton> &
  VariantProps<typeof buttonVariants>

export function Button({ intent, className, ...props }: ButtonProps) {
  return (
    <ShadcnButton className={cn(buttonVariants({ intent }), className)} {...props} />
  )
}
```

Use `cn()` from `@/lib/utils` for all Tailwind class merging — it handles conflicting classes correctly via `tailwind-merge`.

When a component has no shadcn equivalent, build it from scratch with Tailwind classes directly, using `cva` for variants when applicable.
