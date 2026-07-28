# Distinguishing an Absent JSON Field from an Explicit `null` in Partial Updates

## The Problem

Jackson deserializes a JSON object into a Java DTO by mapping each JSON key to the matching
field. When a JSON key is entirely absent from the payload, Jackson simply leaves the
corresponding field at its default (`null`, for any reference type). When a JSON key is present
but its value is the JSON literal `null`, Jackson also sets the corresponding field to `null`.

These are two different signals from the client, and Jackson collapses them into the exact same
Java value:

```json
{ "name": "Renamed" }
```

```json
{ "name": "Renamed", "description": null }
```

Deserialized into `record EditRequest(String name, String description)`, both payloads produce a
`description` field equal to `null`. There is no way, from the Java object alone, to tell "the
client never mentioned `description`" apart from "the client explicitly asked to clear
`description`".

This is not a Jackson bug — it is a direct consequence of how JSON and Java's type system relate:
JSON has three states for a field (absent, `null`, a value) while a plain Java reference field
only has two (`null`, a value). Any DTO that needs to preserve the JSON-side distinction needs a
field type that itself can represent three states, not two.

## Why This Only Matters for Partial Updates (PATCH), Never for Full Replacement (PUT)

The ambiguity above is only a problem when the API contract assigns a *meaning* to "field
omitted" that is different from "field explicitly cleared". That only happens in one specific
shape of endpoint:

**Partial update (PATCH) semantics** — the request DTO's fields are all optional (no
`@NotBlank`/`@NotNull`), and the documented contract is "a field the client did not mention keeps
its current, already-persisted value; a field the client did mention gets updated to whatever was
sent, including `null` to clear it". Here, "absent" and "explicit `null`" are two contractually
different instructions, and Jackson's collapsing of the two into a single `null` is a real defect
against the contract — the API has no way to receive one of its two documented instructions.

**Full replacement (PUT) semantics** — the request DTO requires every business-mandatory field
(`@NotBlank`/`@NotNull`), and the client is expected to resend the complete representation of the
resource on every call. A field that is optional here (no validation annotation) has only one
meaning either way it's missing: "this resource has no value for this optional field" — there is
no separate "leave it as it was" instruction to preserve, because the whole point of PUT semantics
is that the client always states the resource's complete desired state. Nothing is lost by
collapsing "absent" and "explicit `null`" in this shape, so there is nothing to fix.

The distinguishing signal is not "does this DTO have an optional field" — it's whether the
endpoint's own contract gives "field omitted" a *different meaning* than "field explicitly null".
Only genuine partial-update (PATCH) contracts do.

### Worked examples from this codebase

At the time of writing, exactly one endpoint in this backend has partial-update semantics and is
therefore actually affected by this ambiguity:

- `SystemIdentityEditRequest(String name, String description, Duration tokenDuration)`
  (`br.com.qgmbt.auth.systemidentity.rest`) — no field carries `@NotBlank`/`@NotNull`, and its own
  Javadoc states the contract explicitly: "Every field is optional — a null value means 'leave
  this field unchanged'". `SystemIdentityEntity#edit` implements this by checking `if (x != null)`
  per field before applying it. This is exactly the shape where the ambiguity bites: there is
  today no way for a caller to say "clear `description`" — sending `"description": null` and
  omitting `description` entirely produce identical behavior (both leave it unchanged), even
  though the contract's own wording implies clearing should be possible.

Every other "edit"/"update" endpoint in this backend uses full-replacement (PUT) semantics
instead, and is not affected:

- `FinancialSpaceEditRequest(@NotBlank String name, String photoUrl)`
- `EmailSenderEditRequest(@NotBlank String name, @NotBlank @Email String email)`
- `EmailTemplateEditRequest(@NotBlank String subject, @NotBlank String body, @NotNull UUID senderId)`
- `SmsSenderEditRequest(@NotNull SmsSenderType type, @NotBlank String value)`
- `SmsTemplateEditRequest(@NotBlank String body, @NotNull UUID senderId)`
- `UserProfileUpdateRequest(@NotBlank String name, String photoUrl)`
- `UserAddressUpdateRequest(@NotBlank String nickname, ..., String addressLine2, String dependentLocality, ...)`

In every one of these, the corresponding service method applies every field unconditionally (e.g.
`financialSpace.rename(request.name()); financialSpace.changePhoto(request.photoUrl());`), and the
optional fields among them (`photoUrl`, `addressLine2`, `dependentLocality`) are documented/tested
as "omitted means cleared" — there is no competing "leave unchanged" instruction to distinguish it
from, so nothing here needs the fix described below.

## The Recommended Solution: `JsonNullable<T>`

The idiomatic fix in the Java/Spring Boot ecosystem is to stop representing an optional,
patchable field as a plain `T` and instead wrap it in a container type that can itself represent
three states. The most widely adopted implementation of this idea is
[`JsonNullable<T>`](https://github.com/OpenAPITools/jackson-databind-nullable), published as
`org.openapitools:jackson-databind-nullable` — the same wrapper type the OpenAPI Generator project
emits by default for PATCH operations in its Spring server templates.

`JsonNullable<T>` has exactly three possible states after deserialization:

| JSON payload | Resulting `JsonNullable<T>` | Meaning |
|---|---|---|
| Key absent | `JsonNullable.undefined()` | Leave the field unchanged |
| Key present, value `null` | `JsonNullable.of(null)` | Clear the field |
| Key present, value `x` | `JsonNullable.of(x)` | Set the field to `x` |

`.isPresent()` returns `true` for the last two rows and `false` for the first — that single check
is what a partial-update method needs to decide whether to touch the field at all; `.get()` (only
called when `.isPresent()` is `true`) then yields the actual value to apply, which may itself be
`null`.

### Applying it

1. **Change the field's type in the Request DTO**, from `T` to `JsonNullable<T>`, for every field
   that needs the three-state distinction:

   ```java
   public record SystemIdentityEditRequest(
       JsonNullable<String> name, JsonNullable<String> description, JsonNullable<Duration> tokenDuration) {
   }
   ```

2. **Register the Jackson module** so the wrapper type is actually (de)serialized correctly. The
   library ships a Jackson module (`JsonNullableModule`) that must be on the classpath and
   registered with the application's `ObjectMapper`. Depending on how this project's `ObjectMapper`
   is configured, this is either automatic (Jackson auto-discovers modules registered via its
   `ServiceLoader`/SPI mechanism, and recent versions of this library ship the necessary SPI
   registration file for this) or requires an explicit `@Bean` — confirm which applies before
   relying on it silently working.

3. **Replace `!= null` checks with `.isPresent()` in the partial-update logic**, applying `.get()`
   (which itself may be `null`, meaning "clear it") only when present:

   ```java
   void edit(JsonNullable<String> name, JsonNullable<String> description, JsonNullable<Duration> tokenDuration) {
       if (name.isPresent()) {
           this.name = name.get();
       }
       if (description.isPresent()) {
           this.description = description.get();
       }
       if (tokenDuration.isPresent()) {
           this.tokenDuration = tokenDuration.get();
       }
   }
   ```

No other layer needs to change: structural validation (`@NotBlank`/`@NotNull` on the fields that
remain always-required, if any) still applies the same way on top of the wrapper type; the
controller and service signatures otherwise stay the same shape.

## Caveat: Jackson 3 Support Is Recent

This backend runs on Jackson 3 (`tools.jackson.*`), not the legacy Jackson 2 (`com.fasterxml.jackson.*`)
line. `org.openapitools:jackson-databind-nullable` added Jackson 3 support only recently: version
`0.2.11` (the latest published release at the time of writing) ships both a Jackson 2 code path
(`JsonNullableJackson2*` classes) and a Jackson 3 code path (`JsonNullableJackson3*` classes,
including a `JsonNullableJackson3Module` and the corresponding
`META-INF/services/tools.jackson.databind.JacksonModule` SPI registration) in the same artifact,
selecting the right one based on which Jackson major version is actually present on the classpath.

This is genuine, published, working Jackson 3 support — but it is new enough that it should not be
trusted blindly. Before depending on it in production code, write a small, dedicated test (a
`JsonNullable<T>` field round-tripped through the project's actual `ObjectMapper` — absent, `null`,
and a real value, each asserted independently) to confirm the module is actually being picked up
and behaves as documented in this specific Jackson 3 / Spring Boot 4 setup, rather than assuming
parity with the far more battle-tested Jackson 2 path.

## Decision Criterion: When to Apply This Pattern

Apply `JsonNullable<T>` to a Request DTO field when **both** of the following are true:

1. The endpoint is a genuine partial update (PATCH): the field is optional (no
   `@NotBlank`/`@NotNull`), and the documented contract says a field the client does not mention
   keeps its current persisted value — i.e. "omitted" and "explicit `null`" are two different,
   intentional instructions the API needs to support.
2. The underlying entity's mutator needs to tell those two instructions apart to behave
   correctly — in particular, "clear this field" is a real, reachable state for the field (it is
   nullable in the domain model), not just an artifact of the DTO.

Do **not** apply it when the endpoint uses full-replacement (PUT) semantics — every
business-mandatory field is validated as required, and the client is expected to resend the
complete resource on every call. In that shape, an optional field's absence and its explicit
`null` mean the same thing ("no value for this field"), so the plain `T` type is correct and
`JsonNullable<T>` would only add ceremony without fixing anything.
