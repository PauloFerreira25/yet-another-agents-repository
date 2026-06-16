---
name: atomization
Scope: When decomposing any feature or system unit into a spec
description: The atomic unit is the DDD domain — one spec per domain, layers described within it
---

The atomic unit of a spec is a coherent unit of work — a domain, a feature, a flow, or an integration boundary. Write one spec per unit. When the unit is a DDD domain, follow the DDD spec format. Never write a spec that spans two distinct units unless the human explicitly scopes it that way.

When the interview reveals multiple units, name each one and address them separately. Close the current spec before opening another.

When a unit's responsibility becomes unclear during writing, stop. Name the boundary explicitly before continuing.
