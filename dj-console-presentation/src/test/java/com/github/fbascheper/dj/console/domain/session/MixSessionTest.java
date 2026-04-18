package com.github.fbascheper.dj.console.domain.session;

import com.github.fbascheper.dj.console.domain.event.RequestFromAudienceReceived;
import com.github.fbascheper.dj.test.support.MixSessionTestObjects;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class MixSessionTest {

    @Test
    void applyEvent_requestFromAudienceReceived_radarLove() {
        // Arrange
        var mixSession = MixSessionTestObjects.laurensEmptyMixSession();
        var occurredAt = LocalDateTime.now().minusMinutes(1);
        var event = new RequestFromAudienceReceived("Radar Love", occurredAt);

        // Act
        var updatedMixSession = mixSession.applyEvent(event);

        // Assert
        assertThat(updatedMixSession.tracks()).hasSize(1);
        assertThat(updatedMixSession.tracks().getFirst().song().title()).isEqualTo("Radar Love");
    }

    @Test
    void applyEvent_requestFromAudienceReceived_radarLoveAndWakeMeUp() {
        // Arrange
        var mixSession = MixSessionTestObjects.laurensEmptyMixSession();
        var firstEventTime = LocalDateTime.now().minusMinutes(1);
        var firstEvent = new RequestFromAudienceReceived("Radar Love", firstEventTime);

        // Act - First event
        var afterFirstEvent = mixSession.applyEvent(firstEvent);

        var secondEventTime = firstEventTime.plusSeconds(3);
        var secondEvent = new RequestFromAudienceReceived("Wake Me Up", secondEventTime);
        var afterSecondEvent = afterFirstEvent.applyEvent(secondEvent);

        // Assert
        assertThat(afterSecondEvent.tracks()).hasSize(2);
        assertThat(afterSecondEvent.tracks().get(0).song().title()).isEqualTo("Radar Love");
        assertThat(afterSecondEvent.tracks().get(1).song().title()).isEqualTo("Wake Me Up");
    }

    @Test
    void applyEvent_requestFromAudienceReceived_unknownTrackFallsBackToAverageEnergyLevel() {
        // Arrange
        var mixSession = MixSessionTestObjects.laurensEmptyMixSession();
        var firstEventTime = LocalDateTime.now().minusMinutes(1);
        var firstEvent = new RequestFromAudienceReceived("Radar Love", firstEventTime);

        // Act - First event (LOW energy)
        var afterFirstEvent = mixSession.applyEvent(firstEvent);

        var secondEventTime = firstEventTime.plusSeconds(3);
        var secondEvent = new RequestFromAudienceReceived("Wake Me Up", secondEventTime);
        var afterSecondEvent = afterFirstEvent.applyEvent(secondEvent);

        // Store average energy level before requesting unknown track
        var averageLevelBeforeUnknownRequest = afterSecondEvent.getAverageEnergyLevel();

        var thirdEventTime = secondEventTime.plusSeconds(10);
        var thirdEvent = new RequestFromAudienceReceived("Something like suavemente ?!?", thirdEventTime);
        var afterThirdEvent = afterSecondEvent.applyEvent(thirdEvent);

        // Assert
        assertThat(afterThirdEvent.tracks()).hasSize(3);
        // The third track should be a MEDIUM energy track (matching the average level)
        assertThat(afterThirdEvent.tracks().get(2).energyLevel()).isEqualTo(EnergyLevel.MEDIUM);
        // The average energy level should remain unchanged
        assertThat(afterThirdEvent.getAverageEnergyLevel()).isEqualTo(averageLevelBeforeUnknownRequest);
    }

}