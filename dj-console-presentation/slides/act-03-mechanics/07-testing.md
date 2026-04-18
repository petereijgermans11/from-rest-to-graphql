<!-- .slide: data-background-image="diagram-images/DJ-console.png" data-background-size="cover" data-background-opacity="0.25" -->
# Testing the Slice

Two test types, one discipline: `@GraphQlTest` verifies wiring; ArchUnit verifies the architecture.

```java
// GraphQL slice test — schema, controller, resolvers, exception handlers
@GraphQlTest(DiscJockeyConsoleGraphQLController.class)
class DiscJockeyConsoleGraphQLControllerTests {

    @Autowired GraphQlTester graphQlTester;
    @MockitoBean MixSessionService mixSessionService;

    @Test
    void shouldGetCurrentMixSession() {
        given(mixSessionService.getCurrentSession()).willReturn(sampleSession());
        graphQlTester.documentName("currentMixSession").execute()
            .path("currentMixSession.status").entity(String.class).isEqualTo("WARM_UP");
    }
}

// Architecture rule — machine-checked hexagonal invariants
@Test
void serviceMustNotDependOnControllerOrInfrastructureLayers() {
    noClasses().that().resideInAPackage("..service..")
        .should().dependOnClassesThat()
            .resideInAnyPackage("..controller..", "..graphql..", "..infrastructure..")
        .check(productionClasses);  // → enforces output-port pattern
}
```

## Speaker notes
<!-- Show the annotation first — @GraphQlTest is the GraphQL equivalent of @WebMvcTest.

- @GraphQlTest slice
  - Controller, schema, exception resolvers — nothing else
  - Fast: no full application context startup, no database
  - `documentName("currentMixSession")` loads from `src/test/resources/graphql-test/`
    - Same `.graphql` files the real client sends — not hardcoded strings
  - `@MockitoBean` stubs the service — full pipeline still runs (Spring Boot 4)

- ArchUnit rules (10 enforced)
  - Domain must not depend on outer layers
  - Service must not depend on controller/graphql/infrastructure → enforces output ports
  - No field injection via `@Autowired`
  - All exceptions must extend `DJConsoleException`
  - Domain types must be records; `@Service` must reside in service package
  - No package cycles

- Why both matter together
  - `@GraphQlTest` tests what the schema exposes
  - ArchUnit tests that the architecture cannot silently degrade

The output-port pattern (`MixSessionUpdatePort`, `CrowdVoteTallyPort`) was machine-discovered by ArchUnit, then fixed. -->

