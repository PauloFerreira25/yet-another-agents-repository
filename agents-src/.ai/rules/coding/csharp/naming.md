---
name: csharp-naming
Scope: Before naming, writing or reviewing any C#
description: Naming conventions for C# code, based on Microsoft .NET naming guidelines
---

The Microsoft .NET naming guidelines (https://learn.microsoft.com/en-us/dotnet/standard/design-guidelines/naming-guidelines) are the baseline. Roslyn analyzers enforce naming conventions for code elements — directory naming is not enforced by tooling.

## Code identifiers

| Identifier type | Style |
|---|---|
| Namespaces, classes, interfaces, structs, enums, methods, properties, events | `PascalCase` |
| Local variables, parameters | `camelCase` |
| Private fields | `_camelCase` (underscore prefix) |
| Constants | `PascalCase` (not `UPPER_SNAKE_CASE`) |
| Interfaces | `IPascalCase` (prefix with `I`) |

```csharp
namespace OrderService.Domain;       // PascalCase

public interface IOrderRepository { ... }   // IPascalCase
public class OrderService { ... }           // PascalCase

private readonly IOrderRepository _repository;  // _camelCase

public Order FindById(string id) { ... }    // PascalCase method

const int MaxRetries = 3;                   // PascalCase constant
```

## Directories

Directory names are not enforced by Roslyn or the C# compiler. By convention, directories match namespace segments and follow `PascalCase` to stay consistent with the codebase structure.

## Abbreviations and acronyms

Treat acronyms of two letters as all-uppercase; treat longer acronyms as words.

```csharp
// two-letter acronym — all uppercase
public class IOStream { ... }
public void GetID() { ... }

// longer acronym — treated as a word
public class XmlParser { ... }
public class HttpClient { ... }
```

## Language

All identifiers must be in English.
