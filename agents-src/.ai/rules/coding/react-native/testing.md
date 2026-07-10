---
name: react-native-testing
Scope: When writing tests for React Native components, hooks, or services
description: Jest + React Native Testing Library replace Vitest + Testing Library; same behavior-first querying philosophy
---

Test everything. No component, hook, or service is exempt — same standard as the web stack.

```bash
npm install -D jest jest-expo @testing-library/react-native
```

`jest-expo` is the required preset — it configures the React Native transform and mocks Expo-specific native modules that plain `jest` does not know about.

```json
// package.json
{
  "jest": {
    "preset": "jest-expo",
    "setupFilesAfterEach": ["@testing-library/react-native/extend-expect"]
  }
}
```

**File location**: mirror `src/` and `app/` under the root `test/` directory, same convention as the web stack:

```
src/service/produto/produto.service.ts   →  test/service/produto/produto.service.test.ts
app/(private)/produto/[id].tsx           →  test/app/(private)/produto/[id].test.tsx
```

**Mock the service module**: always use `jest.mock()` on the entire service module. Never mock `fetch` directly — the service layer is the isolation boundary, identical rule to the web stack.

```ts
jest.mock('@/service/produto/produto.service', () => ({
  produtoService: {
    getAll: jest.fn().mockResolvedValue([{ id: '1', nome: 'Produto A' }]),
  },
}))
```

**Test behavior, not implementation**: query by what the user (and screen reader) perceives, following React Native Testing Library's query priority:

1. `getByRole` — `accessibilityRole` (button, header, ...)
2. `getByLabelText` — `accessibilityLabel`
3. `getByText` — visible text content
4. `getByTestId` — last resort only, via `testID`

Never query by component display name or internal state.

## i18n in tests

Initialize i18n before tests so `t()` resolves real keys, same rationale as the web stack:

```ts
// test/setup.ts
import '@/lib/i18n'
```

## Native module mocks

`jest-expo` mocks most Expo native modules (SecureStore, MMKV via community mocks, notifications) automatically. When a test needs a specific mocked return value from a native module, mock it explicitly per test file rather than relying on the preset's default:

```ts
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue('mock-refresh-token'),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}))
```

## Component test structure

```ts
render(<ProductCard produto={mockProduto} />)
expect(screen.getByText('Produto A')).toBeOnTheScreen()
await userEvent.press(screen.getByRole('button', { name: 'Ver detalhe' }))
expect(produtoService.getById).toHaveBeenCalledWith('1')
```

`toBeOnTheScreen()` is React Native Testing Library's equivalent of `toBeInTheDocument()` — there is no DOM, so the matcher name differs even though the intent is identical.
