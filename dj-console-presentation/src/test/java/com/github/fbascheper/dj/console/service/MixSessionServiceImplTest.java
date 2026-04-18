package com.github.fbascheper.dj.console.service;

import com.github.fbascheper.dj.console.domain.session.MixSessionRepository;
import com.github.fbascheper.dj.test.support.MixSessionTestObjects;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Regression test for the NullPointerException thrown by the {@code crowdCheered}
 * GraphQL mutation.
 *
 * <p><b>Root cause:</b> {@code MixSessionSmartLoader} previously deserialised
 * {@code DiscJockey} from the session JSON, leaving {@code trackLibrary = null}.
 * When {@code applyCrowdCheered} called {@code session.applyEvent(new CrowdCheered(...))},
 * the domain method {@code DiscJockey.findNextNewTrack} invoked
 * {@code trackLibrary.stream()} and crashed with a {@code NullPointerException}.
 *
 * <p><b>Fix:</b> {@code DiscJockeySmartLoader} now populates the DJ's
 * {@code trackLibrary} at startup (phase 15), and {@code MixSessionSmartLoader}
 * looks up the fully-built {@code DiscJockey} from {@code DiscJockeyRegistry}
 * at phase 20 — so {@code trackLibrary} is always non-null when the service
 * is invoked.
 */
class MixSessionServiceImplTest {

    private final MixSessionRepository repository = mock(MixSessionRepository.class);
    private final MixSessionService service = new MixSessionServiceImpl(repository);

    @Test
    void applyCrowdCheered_addsNextTrack_whenDjLibraryIsPopulated() {
        // Arrange — a session whose DJ has a fully populated trackLibrary.
        // Before the fix, the DJ loaded from JSON had trackLibrary = null,
        // causing DiscJockey.findNextNewTrack to throw NullPointerException.
        var session = MixSessionTestObjects.laurensEmptyMixSession();
        var sessionId = session.id().value();

        when(repository.findById(sessionId)).thenReturn(Optional.of(session));
        when(repository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        // Act — this call triggered the NPE via session.applyEvent(new CrowdCheered(...))
        var result = service.applyCrowdCheered(sessionId);

        // Assert — the event was applied and the session now has one track
        assertThat(result.tracks())
                .as("crowdCheered must add exactly one track to the session")
                .hasSize(1);
        assertThat(result.tracks().getFirst().song())
                .as("the added track must have a non-null song")
                .isNotNull();
    }

}
