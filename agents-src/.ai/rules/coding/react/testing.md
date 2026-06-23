---
name: react-testing
Scope: When writing tests for React components, hooks, or services
description: Test behavior via Testing Library; mock services with vi.mock; tests mirror src/ structure in root test/
---

Test everything. No component, hook, or service is exempt.

**File location**: mirror `src/` under the root `test/` directory:

```
src/component/atom/button/button.tsx        →  test/component/atom/button/button.test.tsx
src/service/produto/produto.service.ts      →  test/service/produto/produto.service.test.tsx
src/store/produto/produto.store.ts          →  test/store/produto/produto.store.test.tsx
```

**Mock the service module**: always use `vi.mock()` on the entire service module. Never mock `fetch` or `axios` directly — the service layer is the isolation boundary.

```ts
vi.mock('@/service/produto/produto.service', () => ({
  produtoService: {
    getAll: vi.fn().mockResolvedValue([{ id: '1', nome: 'Produto A' }]),
    create: vi.fn().mockResolvedValue({ id: '2', nome: 'Produto B' }),
  },
}))
```

**Test behavior, not implementation**: query by what the user sees. Follow Testing Library query priority:

1. `getByRole` — semantic role (button, heading, input)
2. `getByLabelText` — form labels
3. `getByText` — visible text content
4. `getByTestId` — last resort only

Never query by class name, component name, or internal state.

**i18n in tests**: initialize i18n before tests so `t()` resolves keys correctly. Add the i18n import to `src/test/setup.ts` (the setup file configured in `vite.config.ts`):

```ts
// src/test/setup.ts
import '@testing-library/jest-dom'
import '@/lib/i18n'
```

With this setup, `t('common.save')` resolves to the actual string from `public/locale/pt-BR/translation.json` in tests. Query by the resolved text, not by translation keys.

**Component test structure**: render, interact, assert on visible result:

```ts
render(<ProductCard produto={mockProduto} />)
expect(screen.getByText('Produto A')).toBeInTheDocument()
await userEvent.click(screen.getByRole('button', { name: 'Ver detalhe' }))
expect(produtoService.getById).toHaveBeenCalledWith('1')
```
