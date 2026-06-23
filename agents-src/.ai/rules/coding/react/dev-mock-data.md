---
name: dev-mock-data
Scope: When simulating backend data or building UI without a real backend endpoint
description: Simulated data belongs exclusively in the service layer, isolated in a .service.mock.ts file
---

When a backend endpoint does not yet exist, simulate data in the service layer only. Never place fake data in components, pages, stores, or hooks.

Create a sibling file named `<domain>.service.mock.ts` next to the service file. This file contains the mock objects typed against the domain model:

```ts
// src/service/produto/produto.service.mock.ts
import type { ProdutoModel } from '@/type/produto/produto.type'

export const produtoMock = {
  list: [{ id: '1', nome: 'Produto A', preco: 99.9 }] as ProdutoModel[],
  single: { id: '1', nome: 'Produto A', preco: 99.9 } as ProdutoModel,
}
```

In the service file, import the mock and use it in place of the HTTP client. Write the real implementation as a commented line so it is ready to activate when the backend is available:

```ts
// src/service/produto/produto.service.ts
import { produtoMock } from './produto.service.mock'
// import { mainClient } from '@/service/api/main.httpClient'

export const produtoService = {
  // using mock until backend endpoint is available
  getAll: (): Promise<ProdutoModel[]> => Promise.resolve(produtoMock.list),
  // getAll: (): Promise<ProdutoModel[]> => mainClient.get<ProdutoModel[]>('/produtos'),

  getById: (id: string): Promise<ProdutoModel> => Promise.resolve(produtoMock.single),
  // getById: (id: string): Promise<ProdutoModel> => mainClient.get<ProdutoModel>(`/produtos/${id}`),
}
```

When the real endpoint is available: uncomment the `mainClient` import and real method, remove the mock import and mock method, and delete the `.service.mock.ts` file.

Never commit a `.service.mock.ts` file as a permanent part of the codebase. It is a development scaffold, not a fixture.
