
# Testing Rules (dj-console-api)

This project strictly follows **Test-Driven Development (TDD)**.

## Workflow
1. Write a failing test
2. Verify it fails for the correct reason
3. Implement code to make the test pass
4. Refactor while keeping tests green

## Mandatory Rules
- No production code without a test
- New code must have at least **75% line coverage**

## Tooling
- Controller tests use `@GraphQlTest` with `GraphQlTester`
- Service layer dependencies are mocked using `@MockitoBean`
- GraphQL test queries are stored under `src/test/resources/graphql`
- Test fixtures (pre-built domain objects) are in `src/test/java/com/github/fbascheper/dj/test/support/`
- Use AssertJ with static imports
- Use EqualsVerifier for equals/hashCode tests

## GraphQL Test Patterns

**Queries and mutations:**
```java
tester.documentName("currentMixSession")   // loads src/test/resources/graphql-test/*.graphql
      .execute()
      .path("currentMixSession.id").entity(String.class).isEqualTo(expected);
```

**Subscriptions:**
```java
tester.document("subscription { mixSessionUpdated(id: $id) { ... } }")
      .executeSubscription()
      .toFlux("mixSessionUpdated", MixSession.class);
// Verify with reactor StepVerifier
StepVerifier.create(flux).expectNextMatches(...).verifyComplete();
```

**Error assertions:**
```java
tester.execute()
      .errors()
      .satisfy(errors -> assertThat(errors).anyMatch(e ->
          e.getErrorType() == ErrorType.NOT_FOUND));
// Custom error codes live in e.getExtensions() map
```

## Mutation Testing
PIT mutation testing is available via:
```shell
cd dj-console-api && mvn -P pitest verify
```
