---
name: project-scaffold
Scope: When initializing a new React TypeScript project from scratch
description: Scaffold with Vite directly in the workspace, then install the full stack in order
---

## Step 1 — Confirm project name with the human

Before running any command, ask the human to confirm the project name. Never infer it from context alone.

Present it explicitly: "The project will be created at `/workspace/<project-name>-react`. Confirm?"

Only proceed after receiving explicit confirmation.

## Step 2 — Scaffold in the workspace

```bash
cd /workspace
npm create vite@latest <project-name>-react -- --template react-ts
cd <project-name>-react
```

## Step 3 — Install Tailwind CSS v4

```bash
npm install tailwindcss @tailwindcss/vite
```

Add the Tailwind plugin to `vite.config.ts`:

```ts
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
})
```

Replace `src/index.css` content with:

```css
@import "tailwindcss";
```

## Step 4 — Initialize shadcn/ui

```bash
npx shadcn@latest init
```

shadcn/ui configures path aliases (`@/*`) automatically. After init, verify that `vite.config.ts` still has the Tailwind plugin — shadcn may overwrite the file. If it does, re-add `tailwindcss()` to the plugins array.

## Step 5 — Install runtime dependencies

```bash
npm install \
  @tanstack/react-router \
  @tanstack/react-query \
  @tanstack/react-table \
  zustand \
  react-hook-form \
  @hookform/resolvers \
  zod \
  recharts \
  motion \
  @formkit/auto-animate \
  sonner \
  i18next \
  react-i18next \
  next-themes
```

## Step 6 — Install dev dependencies (testing)

```bash
npm install -D \
  vitest \
  jsdom \
  @testing-library/react \
  @testing-library/user-event \
  @testing-library/jest-dom
```

Update `vite.config.ts` — use `vitest/config` instead of `vite` so TypeScript recognizes the `test` property:

```ts
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

Add `"vitest/globals"` to the `types` array in `tsconfig.app.json`:

```json
"types": ["vite/client", "vitest/globals"]
```

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom'
```
