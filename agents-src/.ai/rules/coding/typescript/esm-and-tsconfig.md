---
name: esm-and-tsconfig
Scope: Before configuring modules, writing imports, or setting up TypeScript
description: Always use ES Modules; base TypeScript compiler options shared across all TypeScript projects
---

## ES Modules

Always use ES Modules. Never use CommonJS.

- Use `import`/`export` syntax in all files
- Never use `require()`, `module.exports`, or `exports`

## tsconfig.json

Minimum required compiler options for all TypeScript projects:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

Module resolution (`module`, `moduleResolution`, `target`) and output paths (`rootDir`, `outDir`) are tooling-specific — configure in the rule for your runtime (`coding/nodejs` or `coding/react`).
