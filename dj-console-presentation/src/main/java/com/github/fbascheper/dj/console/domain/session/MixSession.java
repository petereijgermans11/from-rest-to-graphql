package com.github.fbascheper.dj.console.domain.session;

import com.github.fbascheper.dj.console.domain.util.ValidatingBuilder;
import com.github.fbascheper.dj.console.domain.event.CrowdCheered;
import com.github.fbascheper.dj.console.domain.event.CrowdEnergyDropped;
import com.github.fbascheper.dj.console.domain.event.CrowdEvent;
import com.github.fbascheper.dj.console.domain.event.DancefloorEmptied;
import com.github.fbascheper.dj.console.domain.event.DancefloorFilledUp;
import com.github.fbascheper.dj.console.domain.event.RequestFromAudienceReceived;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Singular;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * The session in which a DJ mixes tracks.
 * AKA the "DJ Set".
 * <p>
 * This acts as the aggregate root for the domain model.
 */
@Builder(toBuilder = true, buildMethodName = "internalBuild", builderClassName = "Builder")
public record MixSession(

        @NotNull
        MixSessionId id,

        @NotNull
        DiscJockey dj,

        @Singular
        List<SessionTrack> tracks,

        @Singular
        List<CrowdEvent> crowdEvents
) {

    @SuppressWarnings("unused")
    public static class Builder implements ValidatingBuilder<MixSession> {
        // lombok will generate the constructor, setters, build method, etc.

        private MixSessionId id;

        @Override
        public void onSetDefaultValues() {
            if (id == null) {
                id = new MixSessionId(UUID.randomUUID());
            }
        }
    }

    public MixSession.Status getStatus() {
        return MixSession.Status.of(this);
    }

    public MixSession applyEvent(CrowdEvent event) {
        var newEvents = copyWithNewElement(crowdEvents, event);
        var newTracks = copyWithNewElement(tracks, decideNextTrack(event));

        return new MixSession(id, dj, newTracks, newEvents);
    }

    private <T> List<T> copyWithNewElement(List<T> list, T newElement) {
        var newList = new ArrayList<>(list);
        newList.add(newElement);
        return newList;
    }

    private SessionTrack decideNextTrack(CrowdEvent event) {
        var averageLevel = getAverageEnergyLevel();

        return switch (event) {
            case CrowdCheered _ -> dj.findNextNewTrack(averageLevel, tracks);
            case CrowdEnergyDropped _ -> dj.findNextNewTrack(averageLevel.next(), tracks);
            case DancefloorEmptied _ -> dj.findNextNewTrackWithHighestEnergyLevel(tracks);
            case DancefloorFilledUp _ -> dj.findNextNewTrack(averageLevel, tracks);
            case RequestFromAudienceReceived e -> dj.findTrackByTitle(e.trackName())
                    .orElseGet(() -> dj.findNextNewTrack(averageLevel, tracks)
                    );
        };
    }

    EnergyLevel getAverageEnergyLevel() {
        return EnergyLevel.fromLevel(
                Math.round(
                        tracks.stream()
                                .mapToInt(track -> track.energyLevel().getIntensity())
                                .average()
                                .orElse(0)
                )
        );
    }

    public enum Status {
        WARM_UP(5, null),
        PEAK(null, EnergyLevel.HIGH),
        COOL_DOWN(null, EnergyLevel.MEDIUM);

        private final Number tracksPlayed;
        private final EnergyLevel energyLevel;

        Status(Number tracksPlayed, EnergyLevel energyLevel) {
            this.tracksPlayed = tracksPlayed;
            this.energyLevel = energyLevel;
        }

        public static Status of(MixSession mixSession) {
            if (mixSession.tracks().size() < WARM_UP.tracksPlayed.intValue()) {
                return WARM_UP;
            } else if (EnergyLevel.HIGH == mixSession.getAverageEnergyLevel()) {
                return PEAK;
            } else {
                return COOL_DOWN;
            }
        }
    }


    /** Strongly-typed identity for MixSession */
    public record MixSessionId(@NotNull UUID value) {}

}
