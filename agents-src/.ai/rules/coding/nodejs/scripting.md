---
name: scripting
Scope: Before writing any script or running any automation in a Node.js project
description: Enforce Node.js as the only runtime for scripts in a Node.js project
---

Always write scripts in Node.js or TypeScript (using `tsx` or `ts-node`) when working in a Node.js project. Never write scripts in Python, shell one-liners that require non-standard tools, or any language that requires installing a runtime not already present in the project.

Never ask the user to install Python, pip, or any dependency outside the Node.js ecosystem to run a script.

When a script is needed:
- Prefer a plain `node` script if no TypeScript compilation is required
- Use `tsx` or `ts-node` for TypeScript scripts if already present in the project
- Add the script as an npm script in `package.json` when it is meant to be reused
- Use only packages already listed in `package.json` — do not introduce new dependencies for scripting convenience
