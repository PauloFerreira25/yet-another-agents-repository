---
name: vue-testing
Scope: When writing tests for Vue components, composables, or services
description: Test behavior through the interface the user sees, never internal state.
---

Tests run on Vitest. Component tests query the rendered output the way a user perceives it — by role, by label, by visible text.

**Never assert on internal state.** Reaching into a component instance to check a ref couples the test to the implementation, so it breaks on every refactor and passes while the interface is broken.

**Never select by CSS class or by component structure.** A class is a styling decision; a test that depends on it fails when styling changes and tells you nothing when behavior does.

Test what the component does, not how. Given this input and this interaction, the user sees this.

## What to mock

Mock at the service layer, which is the application's own boundary — see [[architecture/frontend/vue/service-layer]]. Never mock the HTTP client, and never mock a store or a composable that belongs to the code under test.

A test that mocks the thing it is testing asserts that the mock works.

## Composables

Test a composable by exercising it inside a component, or within an effect scope. Never call one outside a scope and assert on the returned refs, which skips the lifecycle the composable depends on.

## Async

Always await the framework's settling helpers rather than a fixed timeout. A test that waits a hard-coded interval is slow when it passes and flaky when the machine is loaded.

Assert the loading state and the error state, not only the resolved one. Those are the states users complain about and the ones that go untested.

## Scope

Test behavior with rules attached to it: what the service maps, what the schema rejects, what the component does on failure.

Never write a test that asserts a component renders without checking anything about what it rendered. It passes forever and catches nothing.

See [[coding-principles/testing]] for the general principles.
