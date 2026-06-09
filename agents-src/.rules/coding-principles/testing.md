---
name: testing
Scope: Before writing or reviewing tests
description: Testability, test writing discipline, and coverage rules
---

# Testing

## Testability

Write testable code from the start. Avoid hidden dependencies — inject them as parameters so they can be replaced in tests (see [[dependencies]]).

Keep side effects explicit. Separate pure logic from side-effectful code so each can be tested independently.

## Writing Tests

Test behavior, not implementation. Tests should describe what the code does, not how it does it internally.

Keep tests simple and focused — one behavior per test.

Write tests before implementation when the expected behavior is clear (TDD).

Maintain test quality equal to production code: naming, readability, and structure apply equally.

## Test Coverage

Never ship code where tests cannot be run. Keep tests passing throughout refactoring.

Run tests after each change. If a test breaks, fix the code — never disable the test to unblock progress.
