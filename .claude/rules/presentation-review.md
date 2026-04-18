
# Mandatory Presentation Review Rule

This rule applies to the entire repository.

The conference presentation lives in `dj-console-presentation/slides/**/*.md`.
Its slides reference specific code constructs, annotations, schema fields, domain types,
and architectural decisions. These must remain factually accurate as the code evolves.

Whenever Claude generates or modifies:
- GraphQL schema files (`*.graphqls`)
- Domain classes (`domain/**/*.java`)
- Spring GraphQL controllers or resolvers
- Service or infrastructure classes
- Angular components, services, or GraphQL operations
- Any file that changes a publicly visible API, annotation, type name, or domain concept

Claude MUST:
1. Complete the implementation
2. Spawn the `presentation-reviewer` agent, passing the list of changed files and a summary of what changed
3. Present the full review results to the user
4. If any slides are factually incorrect, **propose** the corrected slide content to the user — do NOT edit any file under `dj-console-presentation/` unless the user explicitly asks

Slides that are purely narrative (opinions, trade-off discussion, metaphors) are out of scope —
only check slides that make factual claims about the code.
