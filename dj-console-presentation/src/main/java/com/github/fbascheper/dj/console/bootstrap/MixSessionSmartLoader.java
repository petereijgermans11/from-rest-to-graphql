package com.github.fbascheper.dj.console.bootstrap;

import com.github.fbascheper.dj.console.bootstrap.dto.MixSessionSeed;
import com.github.fbascheper.dj.console.domain.session.DiscJockey;
import com.github.fbascheper.dj.console.domain.session.MixSession;
import com.github.fbascheper.dj.console.domain.session.SessionTrack;
import com.github.fbascheper.dj.console.infrastructure.persistence.MixSessionEntity;
import com.github.fbascheper.dj.console.infrastructure.persistence.SpringDataMixSessionJpaRepository;
import org.springframework.context.SmartLifecycle;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

@Component
public class MixSessionSmartLoader implements SmartLifecycle {

    private final SpringDataMixSessionJpaRepository repo;
    private final DiscJockeyRegistry djRegistry;
    private final ObjectMapper mapper;
    private volatile boolean running = false;

    public MixSessionSmartLoader(SpringDataMixSessionJpaRepository repo,
                                 DiscJockeyRegistry djRegistry,
                                 ObjectMapper mapper) {
        this.repo = repo;
        this.djRegistry = djRegistry;
        this.mapper = mapper;
    }

    @Override
    public void start() {
        try {
            var resolver = new PathMatchingResourcePatternResolver();
            var files = resolver.getResources("classpath:seed/sessions/*.json");
            if (files.length == 0) {
                running = true; // no sessions to load but startup is OK
                return;
            }

            for (var resource : files) {
                try (var in = resource.getInputStream()) {
                    var seed = mapper.readValue(in, MixSessionSeed.class);

                    var dj = djRegistry.findByName(seed.dj().name())
                            .orElseThrow(() -> new IllegalStateException(
                                    "No DJ registered for name: '" + seed.dj().name() + "'"));

                    var session = MixSession.builder()
                            .id(seed.id())
                            .dj(dj)
                            .tracks(resolveSessionTracks(seed, dj))
                            .crowdEvents(seed.crowdEvents())
                            .build();

                    repo.save(new MixSessionEntity(session.id().value(), session));
                }
            }

            running = true;
        } catch (Exception ex) {
            throw new IllegalStateException("Failed loading MixSessions", ex);
        }
    }

    @Override
    public void stop() {
        running = false;
    }

    @Override
    public void stop(Runnable callback) {
        running = false;
        callback.run();
    }

    @Override
    public boolean isRunning() {
        return running;
    }

    /** Resolves session track IDs from the DJ's personal library, enforcing the subset invariant. */
    private List<SessionTrack> resolveSessionTracks(MixSessionSeed seed, DiscJockey dj) {
        List<SessionTrack> resolved = new ArrayList<>();
        for (var tid : seed.trackIds()) {
            var track = dj.trackLibrary().stream()
                    .filter(t -> t.sourceTrackId().equals(tid))
                    .findFirst()
                    .orElseThrow(() -> new IllegalStateException(
                            "TrackId " + tid.value() + " is not in DJ '" + dj.name() + "' library"));
            resolved.add(track);
        }
        return resolved;
    }

    /** Runs after {@link DiscJockeySmartLoader} (phase 15). */
    @Override
    public int getPhase() {
        return 20;
    }

    @Override
    public boolean isAutoStartup() {
        return true;
    }
}