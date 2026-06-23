---
name: dark-mode
Scope: When implementing theme switching, dark mode, or reading the user's color scheme preference
description: next-themes with class strategy; shadcn/ui components use dark: classes automatically
---

Use `next-themes` to manage theme state and persistence. Despite the name, it works in any React SPA — it is not Next.js-specific.

```bash
npm install next-themes
```

## Setup

Wrap the app in `ThemeProvider` in `main.tsx`:

```tsx
// main.tsx
import { ThemeProvider } from 'next-themes'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </ThemeProvider>
)
```

- `attribute="class"` — adds `dark` class to `<html>`, required by Tailwind's `dark:` strategy
- `defaultTheme="system"` — respects OS preference on first visit
- `enableSystem` — enables the `"system"` option in the toggle

## Toggle component

```tsx
// src/component/atom/themeToggle.tsx
import { useTheme } from 'next-themes'
import { Button } from '@/component/ui/button'
import { SunIcon, MoonIcon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}
```

## Persistence

`next-themes` persists the user's preference in `localStorage` automatically under the key `theme`. No additional code needed.

## Tailwind configuration

Ensure `darkMode: 'class'` is set in `tailwind.config.ts`:

```ts
export default {
  darkMode: 'class',
  // ...
}
```

shadcn/ui components already use `dark:` variants — they work automatically once `ThemeProvider` is configured.
