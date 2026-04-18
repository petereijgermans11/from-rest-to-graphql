# PostgreSQL (Docker) Setup for Development

This document describes how to run PostgreSQL locally using Docker for development.
It explains how to:

- Start with an **empty database**
- Inspect database contents with SQL commands
- Completely **reset/clean** the database
- Use shell scripts for convenience

This setup replaces H2 and works cleanly with:

- Spring Boot 4
- Hibernate ORM 7
- JSON (`jsonb`) columns
- Jackson 3 FormatMapper

---

## 🚀 1. Start PostgreSQL using Docker

Run once:

```bash
docker run --name dj-console-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=djconsole \
  -p 5432:5432 \
  -d postgres:18
```

Connection details:

| Key | Value |
|-----|--------|
| Host | localhost |
| Port | 5432 |
| User | postgres |
| Password | postgres |
| Database | djconsole |

---

## 🔧 2. Spring Boot Configuration

Add to `application.yaml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/djconsole
    username: postgres
    password: postgres
  jpa:
    hibernate:
      ddl-auto: create
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
```

JSON column mapping:

```java
@JdbcTypeCode(SqlTypes.JSON)
@Column(columnDefinition = "jsonb", nullable = false)
private MusicLibrary library;
```

---

## 🐘 3. Connecting via psql

Open SQL shell:

```bash
docker exec -it dj-console-postgres psql -U postgres -d djconsole
```

---

## 🔍 4. Useful SQL Commands

```sql
\dt;                          -- list tables
\d music_library;             -- describe table
SELECT * FROM music_library;  -- view rows
SELECT jsonb_pretty(library) FROM music_library;
```

---

## 🧹 5. Cleaning / Resetting DB

### Option A — Drop and recreate schema

```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

### Option B — Fresh DB (container rebuild)

```bash
docker rm -f dj-console-postgres
```

Restart clean:

```bash
docker run --name dj-console-postgres   -e POSTGRES_PASSWORD=postgres   -e POSTGRES_USER=postgres   -e POSTGRES_DB=djconsole   -p 5432:5432   -d postgres:16
```

---

## 🔁 6. Container Management

```bash
docker stop dj-console-postgres
docker start dj-console-postgres
docker logs dj-console-postgres
```

---

## 🧪 7. Verify JSON working

```sql
SELECT jsonb_pretty(library) FROM music_library LIMIT 1;
```

Expected: raw JSON, no double encoding.

---

## 📜 Shell Scripts Included

### `start-db.sh`
```bash
#!/bin/bash
docker run --name dj-console-postgres   -e POSTGRES_PASSWORD=postgres   -e POSTGRES_USER=postgres   -e POSTGRES_DB=djconsole   -p 5432:5432   -d postgres:16
```

### `stop-db.sh`
```bash
#!/bin/bash
docker stop dj-console-postgres
```

### `reset-db.sh`
```bash
#!/bin/bash
docker rm -f dj-console-postgres

docker run --name dj-console-postgres   -e POSTGRES_PASSWORD=postgres   -e POSTGRES_USER=postgres   -e POSTGRES_DB=djconsole   -p 5432:5432   -d postgres:16
```

### `psql.sh`
```bash
#!/bin/bash
docker exec -it dj-console-postgres psql -U postgres -d djconsole
```

---

Enjoy clean JSON mapping and an easy PostgreSQL dev workflow! 💿🐘

