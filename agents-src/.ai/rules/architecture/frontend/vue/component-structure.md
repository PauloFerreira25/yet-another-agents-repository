---
name: vue-component-structure
Scope: When creating or classifying a Vue component
description: Atomic Design classification with DDD subdivision, and the grouping mechanism that keeps directory structure out of the registered component name.
---

Classify every component into exactly one level before creating it:

- **atom**: single-purpose, presentational building blocks — a button, an input, a label, an icon
- **molecule**: a functional unit assembled from atoms — a search field, a form row, a summary card
- **organism**: a self-contained section composed of molecules and atoms — a header, a listing, a form
- **template**: a layout with slot structure and no real data

Place generic components under `app/components/<level>/`.

When a molecule, organism or template belongs to one domain, place it in a domain subdirectory:

```
app/components/molecule/product/ProductCard.vue
app/components/organism/order/OrderSummary.vue
```

Never place domain logic inside an atom. Atoms are domain-agnostic by definition — an atom that knows what a product is has been misclassified.

**Layouts are not an Atomic Design level.** A full-screen layout that hosts routed children lives in `app/layouts/`, never in `app/components/template/`.

**Pages are not components in this scheme.** A page lives in `app/pages/` and is governed by [[coding/vue/page-responsibilities]].

When the level is unclear, resolve it before writing the file by asking whether the component stands alone as a primitive, assembles primitives into a unit, or composes units into a section.

## Keeping structure out of the component name

Vue and Nuxt derive the registered component name from the file path, so `components/molecule/product/ProductCard.vue` would register as `MoleculeProductProductCard`. That is noise, and the structure above would make every component name unusable.

Use a grouping directory — a directory name wrapped in parentheses — for any path segment that exists to organize rather than to name:

```
app/components/(molecule)/(product)/ProductCard.vue   → <ProductCard />
```

The grouping segments are ignored when the name is derived, so the component is referenced by its own name while the directory structure stays intact.

Never solve this by flattening the structure, and never solve it by encoding the path into the file name.
