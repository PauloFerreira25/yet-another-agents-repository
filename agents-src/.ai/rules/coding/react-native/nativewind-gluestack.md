---
name: nativewind-gluestack
Scope: When creating or extending a UI component
description: NativeWind brings Tailwind classes to React Native; gluestack-ui components in component/ui/ are never modified directly
---

Never modify files under `src/component/ui/`. These are gluestack-ui components — install with the gluestack CLI and treat as read-only, exactly like shadcn/ui on the web stack.

```bash
npx gluestack-ui add button
```

## NativeWind

Style with Tailwind `className` on React Native primitives — NativeWind compiles them to native styles at build time.

```bash
npm install nativewind tailwindcss
```

```ts
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{tsx,jsx}', './src/**/*.{tsx,jsx}'],
  presets: [require('nativewind/preset')],
  theme: { extend: {} },
}
```

```tsx
<View className="flex-1 items-center justify-center bg-white dark:bg-black">
  <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">Produtos</Text>
</View>
```

Not every native style has a Tailwind equivalent (e.g. some Shadow/elevation props) — for those, use the `style` prop directly rather than forcing a NativeWind class that does not exist.

## Extending a gluestack-ui component

When a component needs variants or props beyond what gluestack-ui provides, wrap it in `src/component/atom/`, the same convention as the web stack's shadcn wrappers:

```
src/component/ui/button.tsx           ← gluestack-ui original, never touch
src/component/atom/button/button.tsx  ← wrapper with extra variants
```

gluestack-ui components are built with `tva` (tailwind-variants) for variant management — use the same tool in wrappers rather than introducing a second variant system:

```ts
import { tva } from '@gluestack-ui/nativewind-utils/tva'
import { Button as GluestackButton } from '@/component/ui/button'

const buttonStyle = tva({
  base: '',
  variants: {
    intent: { danger: 'bg-red-500 active:bg-red-600' },
  },
})

type ButtonProps = React.ComponentProps<typeof GluestackButton> & { intent?: 'danger' }

export function Button({ intent, className, ...props }: ButtonProps) {
  return <GluestackButton className={buttonStyle({ intent, class: className })} {...props} />
}
```

When a component has no gluestack-ui equivalent, build it from scratch with NativeWind classes directly, using `tva` for variants when applicable.
