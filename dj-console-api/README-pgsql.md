# PostgreSQL (Docker) setup for development


Run Postgres in Docker (matches `application.yaml`: `localhost:5432`, database `djconsole`, user/password `postgres`).

## Start the database

```bash
docker rm -f dj-console-postgres

docker run --name dj-console-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=djconsole \
  -p 5432:5432 \
  -d postgres:18

```

## Schema and seed data

The API uses `spring.jpa.hibernate.ddl-auto: create` (see `src/main/resources/application.yaml`). On each application start, Hibernate recreates the schema and the `SmartLifecycle` loaders repopulate the music library and mix sessions from `src/main/resources/seed/`.

**After changing domain JSON or seed files**, restart the API (`cd dj-console-api && mvn spring-boot:run`) so tables are recreated and seeds run again.

## Crowd cheer / DJ `trackLibrary`

Mix sessions are stored as JSONB. The app fills `DiscJockey.trackLibrary` from the music catalog when loading sessions (see `MixSessionSmartLoader` and `MixSessionRepositoryImpl`). If you ever see errors about a null track library when calling `crowdCheered`, restart the API with the configuration above; with `ddl-auto: create`, a normal restart is enough for a clean schema.

If you use a **persistent** Postgres where Hibernate does not recreate the schema (for example you switched `ddl-auto` to `update` or `validate`), remove old data or reset the container — see below.

## Reset Postgres (optional)

From the repository root:

```bash
./scripts/reset-djconsole-postgres.sh
```

Then start the container again with the `docker run` command above, and start the API.

Manual equivalent:

```bash
docker stop dj-console-postgres 2>/dev/null || true
docker rm dj-console-postgres 2>/dev/null || true
# then docker run ... as in "Start the database"
```

## Connect with psql (optional)

```bash
docker exec -it dj-console-postgres psql -U postgres -d djconsole
```
