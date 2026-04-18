
# Java Style Rules (dj-console-api)

## Language Level
- Java 25 is required

## Records and Builders
- Domain objects must be Java records
- Use Lombok `@Builder` with a validating builder
- IDs must be auto-generated when not explicitly provided

## Local Variables
- Prefer `var` for local variables inside methods
- Do not use `var` when it reduces readability

## General Guidelines
- Constructor injection only
- No field injection
- No static state in domain or service classes
