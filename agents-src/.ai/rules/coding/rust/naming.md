---
name: rust-naming
Scope: Before naming, writing or reviewing any Rust
description: Naming conventions for Rust code, based on the Rust API Guidelines and enforced by Clippy
---

The Rust API Guidelines (https://rust-lang.github.io/api-guidelines/naming.html) are the baseline. Clippy enforces these conventions — violations produce warnings that are treated as errors in CI.

## Code identifiers

| Identifier type | Style |
|---|---|
| Modules, files, functions, methods, variables, fields | `snake_case` |
| Types, traits, enum variants | `PascalCase` |
| Constants, statics | `UPPER_SNAKE_CASE` |
| Lifetimes, generic type parameters | short `lowercase` (`'a`, `T`, `E`) |

```rust
mod order_service;                    // snake_case

pub struct OrderService { ... }       // PascalCase
pub trait Repository { ... }          // PascalCase
pub enum OrderStatus { Draft, Final } // PascalCase variants

fn find_by_id(id: &str) { ... }       // snake_case

const MAX_RETRIES: u32 = 3;           // UPPER_SNAKE_CASE
```

## Modules and files (directories)

Module names must be valid Rust identifiers and follow `snake_case`. Directory names used as modules must match the module name.

Never use `kebab-case` for module directories — hyphens are not valid Rust identifiers and Clippy will flag the mismatch.

Exception: crate names in `Cargo.toml` conventionally use `kebab-case` (e.g. `my-crate`), which Cargo automatically maps to `snake_case` for the module name.

## Abbreviations and acronyms

Rust API Guidelines follow `PascalCase` for types, treating acronyms as words: `HttpClient`, `XmlParser`, `UuidGenerator`. Do not use `HTTPClient` or `XMLParser`.

## Language

All identifiers must be in English.
