<!-- .slide: data-background-image="diagram-images/DJ-console.png" data-background-size="cover" data-background-opacity="0.25" -->
# Error Handling

Exceptions map to typed GraphQL errors — domain codes travel to the client.

```java
@Component
public class GraphQLExceptionResolver
        extends DataFetcherExceptionResolverAdapter {

    @Override
    protected GraphQLError resolveToSingleError(
            Throwable ex, DataFetchingEnvironment env) {

        var errorType   = ErrorType.BAD_REQUEST;
        var extensions  = new LinkedHashMap<String, Object>();

        if (ex instanceof DJConsoleException consoleEx) {
            extensions.put("errorCode", consoleEx.getErrorCode());

            if (consoleEx instanceof MixSessionNotFoundException nf) {
                extensions.put("sessionId", nf.getSessionId());
                errorType = ErrorType.NOT_FOUND;
            }
        }
        return GraphqlErrorBuilder.newError(env)
                .message(ex.getMessage())
                .errorType(errorType)
                .extensions(extensions)
                .build();
    }
}
```

## Speaker notes
<!-- DELIVERY CUE — point at the class declaration: "One class, one annotation — that's the entire error wiring."

- The extension point
  - Extend `DataFetcherExceptionResolverAdapter`, annotate `@Component` — that's it
  - Default `errorType` is `BAD_REQUEST` — explicitly set, not inferred

- Error structure
  - `errorCode` always in extensions for any `DJConsoleException` — structured, parseable
  - `sessionId` added and `errorType` escalated to `NOT_FOUND` for `MixSessionNotFoundException`
  - `extensions()` metadata: clients don't need to parse the message string

- The REST contrast (pause here)
  - HTTP status is always 200 by default
  - Errors travel inside the response body under the `errors` array alongside partial data

This surprises REST developers — it's worth letting it land before moving on. -->

