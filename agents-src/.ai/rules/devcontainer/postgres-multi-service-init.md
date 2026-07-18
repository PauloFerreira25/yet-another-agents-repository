---
name: postgres-multi-service-init
Scope: When adding Postgres to a devcontainer with multiple backend services
description: One role and database per backend service, with credentials scoped to only the services that need them.
---

When more than one backend service shares a single `postgres` container, give each service its
own role and database — never a shared superuser role across services.

Create them with a script in `container/postgres/`, mounted at `/docker-entrypoint-initdb.d/` —
the official Postgres image runs every script there automatically, but only the first time it
initializes an empty data directory:

```yaml
services:
  postgres:
    image: postgres:16
    volumes:
      - ../.data-volumes/postgres:/var/lib/postgresql/data
      - ./container/postgres:/docker-entrypoint-initdb.d:ro
```

```bash
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE ROLE "${AUTH_DB_USERNAME}" WITH LOGIN PASSWORD '${AUTH_DB_PASSWORD}';
    CREATE DATABASE "db-auth" OWNER "${AUTH_DB_USERNAME}";
EOSQL
```

Declare credentials once as YAML anchors at the top of `docker-compose.yml`, then merge only the
anchor(s) each service actually needs into its own `environment` — a service must never receive
credentials for a database it has no business touching:

```yaml
x-db-auth-credentials: &db-auth-credentials
  AUTH_DB_USERNAME: app-auth-user
  AUTH_DB_PASSWORD: app-auth-password

services:
  backend-auth:
    environment:
      <<: *db-auth-credentials
  postgres:
    environment:
      <<: [*db-auth-credentials, *db-ledger-credentials, *db-user-credentials]
```

`postgres` itself needs every credential group merged in (its init script creates all of them),
while each backend service only merges the group(s) it actually connects to.
