---
name: python-naming
Scope: Before naming, writing or reviewing any Python
description: Naming conventions for Python code, based on PEP 8
---

PEP 8 (https://peps.python.org/pep-0008/) is the baseline. Project-specific rules take precedence where they differ.

## Code identifiers

| Identifier type | Style |
|---|---|
| Packages (directories) | `lowercase` |
| Modules (files) | `snake_case` |
| Classes | `PascalCase` |
| Functions, methods, variables, parameters | `snake_case` |
| Constants | `UPPER_SNAKE_CASE` |
| Private (internal use) | `_snake_case` (single leading underscore) |
| Name-mangled (class-private) | `__snake_case` (double leading underscore) |

```python
class OrderService:              # PascalCase
    def find_by_id(self, id):   # snake_case
        ...

MAX_RETRIES = 3                  # UPPER_SNAKE_CASE
_internal_cache = {}             # _snake_case
```

## Packages and modules

Packages (directories) use `lowercase` with no separators — PEP 8 discourages underscores in package names.

Modules (files) use `snake_case` — underscores are allowed when they improve readability.

```
mypackage/              # lowercase, no separator
  order_service.py      # snake_case
  user_repository.py    # snake_case
```

Never use `kebab-case` for packages or modules — hyphens are not valid Python identifiers and break imports.

## Abbreviations and acronyms

PEP 8 does not define a rule for acronyms in class names. Use `PascalCase` treating the acronym as a word: `HttpClient`, `XmlParser`, `UuidGenerator`. Be consistent within the project.

## Language

All identifiers must be in English.
