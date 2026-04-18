<!-- .slide: data-background-image="diagram-images/DJ-console.png" data-background-size="cover" data-background-opacity="0.25" -->
# Nested Field Resolvers

Each field in the graph can have its own resolver — resolved only when asked.

```java
@SchemaMapping
public List<SessionTrack> tracks(
        MixSession mixSession, @Argument Integer last) {
    List<SessionTrack> all = mixSession.tracks();
    if (last == null || last >= all.size()) return all;
    return all.subList(all.size() - last, all.size());
}

@SchemaMapping
public Song song(SessionTrack track) {
    return track.song();
}

@SchemaMapping
public Artist artist(Song song) {
    return song.artist();
}
```

## Speaker notes
<!-- DELIVERY CUE — point at the first parameter of `tracks`: "This is the parent object — not an ID, not a service call."

- @SchemaMapping inference (both axes)
  - Type name: from the source parameter's class name (`MixSession`)
  - Field name: from the method name (`tracks`, `song`, `artist`)
  - `tracks(MixSession mixSession, ...)` → binds to `MixSession.tracks` automatically

- The graph traversal
  - `tracks` → `song` → `artist` — each resolver called only when the client asks for that field
  - Lazy by default — no unnecessary work

- The argument
  - `last: Int` on `tracks` — no new endpoint, just a typed parameter
    - Filters the list server-side before returning

- N+1 risk
  - Each `@SchemaMapping` is called once per parent object in a list — classic N+1 opportunity
  - DataLoader batches and deduplicates those calls; a production concern beyond this demo's scope

BRIDGE — resolvers load data lazily; next, see what happens when they throw. -->

