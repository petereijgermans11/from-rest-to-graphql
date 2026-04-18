#!/bin/bash
docker rm -f dj-console-postgres
docker run --name dj-console-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=djconsole -p 5432:5432 -d postgres:18
