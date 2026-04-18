package com.github.fbascheper.dj.console.controller;

import com.github.fbascheper.dj.console.domain.session.MixSession;
import com.github.fbascheper.dj.console.domain.session.SessionTrack;
import com.github.fbascheper.dj.console.domain.library.Song;
import com.github.fbascheper.dj.console.domain.library.Artist;
import com.github.fbascheper.dj.console.service.MixSessionService;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.UUID;

@Controller
public class DiscJockeyConsoleGraphQLController {

    private final MixSessionService mixSessionService;

    public DiscJockeyConsoleGraphQLController(MixSessionService mixSessionService) {
        this.mixSessionService = mixSessionService;
    }

    // ---------------------------------------------------------
    // QUERY: Convenience method for “the active session”
    // ---------------------------------------------------------
    @QueryMapping
    public MixSession currentMixSession() {
        return mixSessionService.getCurrentSession();
    }

    // ---------------------------------------------------------
    // QUERY: Load session by ID
    // ---------------------------------------------------------
    @QueryMapping
    public MixSession mixSession(@Argument UUID id) {
        return mixSessionService.getSessionById(id);
    }

    // ---------------------------------------------------------
    // MUTATION: Apply crowd event to a session by ID
    // ---------------------------------------------------------
    @MutationMapping
    public MixSession crowdCheered(@Argument UUID id) {
        return mixSessionService.applyCrowdCheered(id);
    }

    // ---------------------------------------------------------
    // Nested resolvers
    // ---------------------------------------------------------

    /**
     * Supports GraphQL: tracks(last: 1)
     */
    @SchemaMapping
    public List<SessionTrack> tracks(
            MixSession mixSession,
            @Argument Integer last
    ) {
        List<SessionTrack> all = mixSession.tracks();
        if (last == null || last >= all.size()) {
            return all;
        }
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

    @SchemaMapping
    public String id(Artist artist) {
        return artist.id().value().toString();
    }

    @SchemaMapping
    public int energyLevel(SessionTrack track) {
        return track.energyLevel().getIntensity();
    }

    @SchemaMapping
    public String id(MixSession mixSession) {
        return mixSession.id().value().toString();
    }

    @SchemaMapping
    public String id(SessionTrack track) {
        return track.sourceTrackId().value().toString();
    }
}