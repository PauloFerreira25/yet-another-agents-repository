---
name: vue-devtools
Scope: Before inspecting a running Vue application in the browser
description: Vue DevTools in Chrome is the instrument for diagnosing a running Vue application; inspect before theorizing, and never drive a browser session uninvited.
---

Vue DevTools is the correct instrument for any question about a running Vue application. It understands components, reactivity and the router, which the browser's generic developer tools do not.

Enable it in development through the framework's own DevTools integration rather than relying on the extension alone, so the inspector is available with full information about the running application. Never enable it in a production build.

## Inspect before theorizing

When behavior is wrong at runtime, look before forming a hypothesis. Vue DevTools answers directly what is otherwise guessed at:

- **A component does not update.** Inspect the component's props and state to see whether the value actually changed. This distinguishes a broken reactive source from a rendering problem, which no amount of reading the code does reliably.
- **A value is wrong.** Inspect the component tree and read the value at each level to find where it diverges, rather than adding log statements down the chain.
- **A store looks stale.** Inspect the store's state and its recorded mutations to see what last wrote to it.
- **A query misbehaves.** Inspect the cache entries and their keys. A query that refetches constantly, or never, is almost always a key that is rebuilt on every render or one that never changes when it should — see [[coding/vue/query-patterns]].
- **A route resolves unexpectedly.** Inspect the matched route and its parameters rather than reasoning about the file structure.

Never conclude that a framework or a library is at fault while the inspector has not been opened. A working comparable case in the same application is the cheapest evidence available, and the inspector is how it is compared — see [[common/how-to-think]].

## Boundaries

Never open, drive or automate a browser session on your own initiative. Inspection is requested by the human, or performed by the human who then reports what they saw.

When you need something from the inspector and cannot obtain it yourself, say precisely what to open and what to read back. A vague request to "check DevTools" returns nothing usable.

Never use the inspector to modify state in a running application in order to make something appear to work. It is an instrument for observation; the fix goes in the code.
