# `domain.event` - Crowd Event Model

## Purpose

This package contains the event types that drive behavior inside the `MixSession` aggregate.

## Event Hierarchy

`CrowdEvent` variants include:

- `CrowdCheered`
- `CrowdEnergyDropped`
- `DancefloorEmptied`
- `DancefloorFilledUp`
- `RequestFromAudienceReceived`

## DDD Role

- Events are part of the `MixSession` behavioral flow.
- They are interpreted by `MixSession.applyEvent(...)`.
- They are not aggregate roots on their own in this model.

## Semantics

- Events represent observed audience signals.
- The aggregate translates those signals into next-track decisions while preserving session invariants.

## JSON Serialization

`CrowdEvent` is stored as part of the `MixSession` JSONB document. Because it is a
sealed interface with multiple concrete subtypes, Jackson cannot reconstruct the
correct type on deserialization without a type discriminator.

`CrowdEvent` is therefore annotated with `@JsonTypeInfo(use = Id.NAME, property = "@type")`
and `@JsonSubTypes` listing all five permitted subtypes. Jackson writes a `"@type"` field
alongside every event in the JSONB column, for example:

```json
{ "@type": "CrowdCheered", "occurredAt": "2026-03-19T20:00:00" }
```

Without this annotation the second `crowdCheered` mutation fails with
`InvalidDefinitionException: Cannot construct instance of CrowdEvent`
(see [#3](https://github.com/fbascheper/spring-io-2026-from-rest-to-graphql/issues/3)).

