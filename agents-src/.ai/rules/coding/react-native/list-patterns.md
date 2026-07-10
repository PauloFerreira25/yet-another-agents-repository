---
name: list-patterns
Scope: When rendering a list of data — feeds, search results, or any collection larger than a handful of items
description: FlashList for any sizable or dynamic list; FlatList only for trivial, rarely-changing short lists; never map() into a ScrollView
---

There is no table/grid layer on mobile — `FlashList` (`@shopify/flash-list`) is the equivalent of the web stack's TanStack Table + shadcn Table combination for anything beyond a handful of static rows.

```bash
npx expo install @shopify/flash-list
```

Never render a list of unknown or unbounded length by mapping items into a `ScrollView` — it mounts every item at once and degrades badly past a few dozen rows. Use `FlashList` (or, for truly trivial short lists, `FlatList`) instead.

```tsx
import { FlashList } from '@shopify/flash-list'

<FlashList
  data={produtos}
  renderItem={({ item }) => <ProductCard produto={item} />}
  estimatedItemSize={96}
  keyExtractor={(item) => item.id}
/>
```

`estimatedItemSize` is required and must approximate the real rendered row height — an inaccurate estimate causes visible jank on fast scroll. Measure a representative row once rather than guessing.

## `renderItem` must be stable

Never define `renderItem` as an inline arrow function that closes over changing values without memoizing it — this defeats FlashList's recycling and re-renders every visible row on unrelated state changes:

```tsx
// wrong — new function identity every render, closes over `selectedId` directly
<FlashList renderItem={({ item }) => <Row item={item} selected={item.id === selectedId} />} />

// correct — extracted component reads only its own props; renderItem itself is stable
const renderItem = useCallback(({ item }: { item: Produto }) => <ProductRow produto={item} />, [])
<FlashList data={produtos} renderItem={renderItem} estimatedItemSize={96} keyExtractor={(item) => item.id} />
```

## Pagination

Use `onEndReached` with `onEndReachedThreshold` to trigger the next page of a cursor-based `useInfiniteQuery` (see `Query Patterns`) — this is the mobile equivalent of the web stack's infinite-scroll feed pattern:

```tsx
<FlashList
  data={notifications}
  renderItem={renderItem}
  estimatedItemSize={72}
  onEndReached={() => hasNextPage && fetchNextPage()}
  onEndReachedThreshold={0.5}
/>
```

## Add/remove/reorder animation

`FlashList` handles item transitions internally when the `data` array reference changes and `keyExtractor` returns stable keys — never wrap items in a separate animation library for this (see `Animation`).

## When `FlatList` is acceptable

For a short, rarely-updated, non-virtualization-critical list (e.g. a settings menu with a dozen static rows), the built-in `FlatList` is acceptable and avoids adding a dependency for no measurable benefit. Move to `FlashList` as soon as the list is data-driven, can grow unbounded, or appears in a performance profile.

## Sorting and filtering

Unlike the web stack's fetch-all-and-paginate-in-memory pattern for administrative tables, mobile lists filter and sort via query parameters sent to the backend — never fetch an unbounded dataset into memory on a device to sort/filter client-side. If the backend cannot filter server-side, that is a backend gap to raise, not a reason to load everything onto the device.
