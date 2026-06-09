---
name: security
Scope: Before handling secrets, user input, authentication, or access control
description: Secrets, input validation, cryptography, and access control rules
---

# Security

## Secrets

Never store credentials, tokens, or secrets in code. Use environment variables or a dedicated secret manager.

Never commit secrets to version control.

## Input and Output

Validate all external input at system entry points — check expected format, type, and length.

Use parameterized queries (prepared statements) for all database access. Never build queries through string interpolation.

Encode output for its rendering context: HTML, SQL, shell, URL. Never assume output is safe without context-appropriate encoding.

Return only the information necessary for the caller in error responses. Log detailed diagnostics server-side.

## Cryptography

Use established cryptographic libraries provided by the language or framework. Never implement custom cryptographic algorithms.

Generate security-critical values — tokens, IDs, nonces — with cryptographically secure random generators.

Encrypt sensitive data at rest and in transit using standard protocols.

## Access Control

Apply authentication to all entry points that handle user data or trigger state changes.

Verify authorization for each resource access — not only at the entry point.

Grant only the permissions required for the operation: files, database connections, API scopes.

## High-Priority Review Targets

Treat authentication and authorization as high-priority targets in every code review. AI-generated code shows elevated rates of access control gaps.
