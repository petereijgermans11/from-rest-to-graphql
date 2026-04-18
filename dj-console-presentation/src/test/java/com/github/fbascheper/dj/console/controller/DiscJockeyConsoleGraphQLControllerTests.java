package com.github.fbascheper.dj.console.controller;

import com.github.fbascheper.dj.console.domain.library.Track;
import com.github.fbascheper.dj.console.domain.session.DiscJockey;
import com.github.fbascheper.dj.console.domain.session.MixSession;
import com.github.fbascheper.dj.console.domain.session.SessionTrack;
import com.github.fbascheper.dj.console.service.MixSessionService;
import com.github.fbascheper.dj.test.support.DiscJockeyTestObjects;
import com.github.fbascheper.dj.test.support.TrackTestObjects;
import org.junit.jupiter.api.Test;
import org.mockito.BDDMockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.graphql.test.autoconfigure.GraphQlTest;
import org.springframework.graphql.test.tester.GraphQlTester;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

@GraphQlTest(DiscJockeyConsoleGraphQLController.class)
public class DiscJockeyConsoleGraphQLControllerTests {

    @Autowired
    private GraphQlTester graphQlTester;

    @MockitoBean
    private MixSessionService mixSessionService;

    private DiscJockey discJockey = DiscJockeyTestObjects.djLaurens();

    @Test
    void shouldGetCurrentMixSession() {
        var id = UUID.fromString("91af9cac-ce3a-55a9-85bf-a051d84d4a0d");
        var session = sampleSession(id
                , discJockey
                , TrackTestObjects.TRACK_WAKE_ME_UP.getInstance()
        );

        BDDMockito.given(mixSessionService.getCurrentSession()).willReturn(session);

        this.graphQlTester
                .documentName("currentMixSession")
                .execute()
                .path("currentMixSession.id").entity(String.class).isEqualTo(id.toString())
                .path("currentMixSession.status").entity(String.class).isEqualTo("WARM_UP")
                .path("currentMixSession.tracks[0].song.title").entity(String.class).isEqualTo("Wake Me Up");
    }

    @Test
    void shouldGetMixSessionById() {
        var id = UUID.fromString("e53dab05-53b6-5054-98d8-9057ebe2397b");
        var session = sampleSession(id
                , discJockey
                , TrackTestObjects.TRACK_WAKE_ME_UP.getInstance()
        );

        BDDMockito.given(mixSessionService.getSessionById(id)).willReturn(session);

        this.graphQlTester
                .documentName("mixSessionById")
                .variable("id", id.toString())
                .execute()
                .path("mixSession.id").entity(String.class).isEqualTo(id.toString())
                .path("mixSession.status").entity(String.class).isEqualTo("WARM_UP")
                .path("mixSession.tracks[0].song.title").entity(String.class).isEqualTo("Wake Me Up");
    }

    @Test
    void shouldApplyCrowdCheered() {
        UUID id = UUID.fromString("91af9cac-ce3a-55a9-85bf-a051d84d4a0d");

        var before = sampleSession(id
                , discJockey
                , TrackTestObjects.TRACK_WAKE_ME_UP.getInstance()
        );
        var after = sampleSession(id
                , discJockey
                , TrackTestObjects.TRACK_WAKE_ME_UP.getInstance()
                , TrackTestObjects.TRACK_ENGELBEWAARDER.getInstance()
        );
        BDDMockito.given(mixSessionService.getSessionById(id)).willReturn(before);
        BDDMockito.given(mixSessionService.applyCrowdCheered(id)).willReturn(after);

        this.graphQlTester
                .documentName("crowdCheered")
                .variable("id", id.toString())
                .execute()
                .path("crowdCheered.id").entity(String.class).isEqualTo(id.toString())
                .path("crowdCheered.status").entity(String.class).isEqualTo("WARM_UP")
                .path("crowdCheered.tracks[0].id").entity(String.class).matches(s -> !s.isBlank())
                .path("crowdCheered.tracks[0].song.title").entity(String.class).isEqualTo("Engelbewaarder");
    }

    private MixSession sampleSession(UUID id, DiscJockey discJockey, Track... trackSamples) {

        List<SessionTrack> sessionTracks = Stream.of(trackSamples)
                .map(SessionTrack::fromLibrary)
                .toList();

        return MixSession.builder()
                .id(new MixSession.MixSessionId(id))
                .dj(discJockey)
                .tracks(sessionTracks)
                .build();
    }
}