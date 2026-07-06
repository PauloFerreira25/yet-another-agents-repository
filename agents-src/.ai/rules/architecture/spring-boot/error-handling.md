---
name: spring-boot-error-handling
Scope: Before writing error handling, exception mapping, or HTTP error responses in a Spring Boot project
description: Centralize exception-to-HTTP mapping in a @ControllerAdvice — never use try/catch in controllers for that purpose.
---

Handle exceptions at the boundary with a single `@ControllerAdvice` class. Map domain exceptions to HTTP responses there — not inside individual controllers.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(EntityNotFoundException ex) {
        log.warn("handleNotFound message={}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpected(Exception ex) {
        log.error("handleUnexpected", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponse("Internal server error"));
    }
}
```

Never use try/catch in a `@Controller` or `@RestController` to produce error responses. Controllers are responsible only for delegating to the service layer and returning the result.

Services and repositories throw domain exceptions. They do not produce HTTP status codes or error response bodies.

Return only the information necessary for the caller in error responses. Log detailed diagnostics server-side (see [[coding-principles/error-handling]]).
