The project follows a DDD-inspired layered architecture.

The domain layer is pure and framework-free, modeling:
- Mix sessions, music library concepts, and crowd behavior
- Aggregates and domain events expressed in ubiquitous language

The application layer defines transactional use cases.

Infrastructure provides persistence and external integrations.

GraphQL controllers act as a delivery boundary, mapping queries,
mutations, and field resolution onto application services.

Bootstrap code wires and seeds the system explicitly.

