
# Mandatory Spring GraphQL Review Rule

This rule applies only to backend code under `dj-console-api/`.

Whenever Claude generates or modifies:
- GraphQL schema files (`*.graphqls`)
- Spring GraphQL controllers or resolvers
- GraphQL subscriptions or configuration
- Subscription publishers (`graphql/*Publisher.java`)
- GraphQL DTOs (`graphql/dto/*.java`)

Claude MUST:
1. Complete the implementation
2. Spawn the `spring-graphql-reviewer` agent
3. Present the full review results
4. Apply all required fixes before finalizing output

Frontend (`dj-console-ui`) changes are explicitly excluded.
