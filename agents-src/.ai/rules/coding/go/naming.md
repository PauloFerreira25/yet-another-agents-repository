---
name: go-naming
Scope: Before naming, writing or reviewing any Go
description: Naming conventions for Go code, based on the Google Go Style Guide
---

The Google Go Style Guide (https://google.github.io/styleguide/go/) and Effective Go (https://go.dev/doc/effective_go) are the baseline.

## Code identifiers

| Identifier type | Style |
|---|---|
| Packages | `lowercase` (short, no separators) |
| Exported (public) identifiers | `PascalCase` |
| Unexported (private) identifiers | `camelCase` |
| Constants | same style as variables — no `UPPER_SNAKE_CASE` |

```go
package orderservice   // lowercase, no separator

type OrderService struct { ... }   // PascalCase (exported)

func (s *OrderService) findByID(id string) { ... }   // camelCase (unexported)

const maxRetries = 3   // camelCase (unexported constant)
const MaxRetries = 3   // PascalCase (exported constant)
```

## Packages (directories)

Package names must be lowercase, short, and use only letters and numbers. No underscores, no hyphens, no uppercase.

Directory names are not Go identifiers and have fewer restrictions, but they should match the package name to avoid confusion.

## Initialisms and acronyms

Go treats initialisms differently from most languages: keep them consistently all-uppercase or all-lowercase, never mixed.

```go
// correct
var userID string
func ServeHTTP(...)
type URLParser struct{}

// wrong
var userId string
func ServeHttp(...)
type UrlParser struct{}
```

This is the opposite of the TypeScript rule — in Go, `ID`, `URL`, `HTTP`, `UUID` stay fully uppercase when exported and fully lowercase when unexported (`id`, `url`).

## Language

All identifiers must be in English.
