## Devoxx  - Pitest demos

---
### Demo 1: Requests from audience received

````java
package com.github.fbascheper.dj.model;

import com.github.fbascheper.dj.console.domain.event.RequestFromAudienceReceived;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static com.github.fbascheper.dj.test.support.MixSessionTestObjects.laurensEmptyMixSession;
import static org.assertj.core.api.Assertions.assertThat;

class MixSessionTest {

    @Test
    void applyEvent_withKnownAudienceRequest_addsRequestedTrackToTrackList() {
        var mixSession = laurensEmptyMixSession();
        var occurredAt = LocalDateTime.now().minusMinutes(1);
        var event = new RequestFromAudienceReceived("Radar Love", occurredAt);

        var updatedMixSession = mixSession.applyEvent(event);

        assertThat(mixSession.tracks()).isEmpty();
        assertThat(updatedMixSession.tracks()).hasSize(1);
        assertThat(updatedMixSession.tracks().getLast().song().title()).isEqualTo("Radar Love");
    }
}
````

### Demo 1-b: Second request from audience received

````java

    @Test
    void applyEvent_withSecondKnownAudienceRequest_addsSecondRequestedTrackToTrackList() {
        var mixSession = laurensEmptyMixSession();
        var firstOccurredAt = LocalDateTime.now().minusMinutes(1);

        var firstEvent = new RequestFromAudienceReceived("Radar Love", firstOccurredAt);
        var afterFirstEvent = mixSession.applyEvent(firstEvent);

        var secondEvent = new RequestFromAudienceReceived("Wake Me Up", firstOccurredAt.plusSeconds(3));
        var afterSecondEvent = afterFirstEvent.applyEvent(secondEvent);

        assertThat(afterFirstEvent.tracks()).hasSize(1);
        assertThat(afterSecondEvent.tracks()).hasSize(2);
        assertThat(afterSecondEvent.tracks().getLast().song().title()).isEqualTo("Wake Me Up");
    }

````

### Demo 1-c: Third request from audience received
````java

    @Test
    void applyEvent_withUnknownThirdAudienceRequest_addsFallbackTrackMatchingCurrentAverageEnergy() {
        var mixSession = laurensEmptyMixSession();
        var firstOccurredAt = LocalDateTime.now().minusMinutes(1);

        var firstEvent = new RequestFromAudienceReceived("Radar Love", firstOccurredAt);
        var afterFirstEvent = mixSession.applyEvent(firstEvent);

        var secondOccurredAt = firstOccurredAt.plusSeconds(3);
        var secondEvent = new RequestFromAudienceReceived("Wake Me Up", secondOccurredAt);
        var afterSecondEvent = afterFirstEvent.applyEvent(secondEvent);

        var averageEnergyBeforeThirdEvent = afterSecondEvent.getAverageEnergyLevel();
        var thirdEvent = new RequestFromAudienceReceived("Something like suavemente ?!?", secondOccurredAt.plusSeconds(10));

        var afterThirdEvent = afterSecondEvent.applyEvent(thirdEvent);

        assertThat(afterSecondEvent.tracks()).hasSize(2);
        assertThat(averageEnergyBeforeThirdEvent).isEqualTo(EnergyLevel.MEDIUM);
        assertThat(afterThirdEvent.tracks()).hasSize(3);
        assertThat(afterThirdEvent.tracks().getLast().song().title()).isNotEqualTo("Something like suavemente ?!?");
        assertThat(afterThirdEvent.tracks().getLast().energyLevel()).isEqualTo(averageEnergyBeforeThirdEvent);
        assertThat(afterThirdEvent.getAverageEnergyLevel()).isEqualTo(averageEnergyBeforeThirdEvent);
    }

````

---
### Demo 2-a: DJ made a mistake & wants to recover

````java
package com.github.fbascheper.dj.model;

import com.github.fbascheper.dj.console.domain.session.EnergyLevel;
import org.junit.jupiter.api.Test;

import java.util.List;

import static com.github.fbascheper.dj.test.support.DiscJockeyTestObjects.djLaurens;
import static com.github.fbascheper.dj.test.support.TrackTestObjects.TRACK_RADAR_LOVE;
import static com.github.fbascheper.dj.test.support.TrackTestObjects.TRACK_WAKE_ME_UP;
import static org.assertj.core.api.Assertions.assertThat;

class DiscJockeyTest {

    @Test
    void findNextNewTrackWithHighestEnergyLevel_withRadarLoveAndWakeMeUpAlreadyPlayed_returnsDifferentHighEnergyTrack() {
        var djLaurens = djLaurens();
        var alreadyPlayed = List.of(TRACK_RADAR_LOVE.getInstance(), TRACK_WAKE_ME_UP.getInstance());

        var nextTrack = djLaurens.findNextNewTrackWithHighestEnergyLevel(alreadyPlayed);

        assertThat(nextTrack).isNotIn(alreadyPlayed);
        assertThat(nextTrack.energyLevel()).isEqualTo(EnergyLevel.HIGH);
    }

}
````


### Demo 2-b: Add mutation test for surviving test / RunError
````java

    @Test
    void applyEvent_withUnknownThirdAudienceRequest_addsFallbackTrackMatchingCurrentAverageEnergy() {
        var mixSession = laurensEmptyMixSession();
        var firstOccurredAt = LocalDateTime.now().minusMinutes(1);

        var firstEvent = new RequestFromAudienceReceived("Radar Love", firstOccurredAt);
        var afterFirstEvent = mixSession.applyEvent(firstEvent);

        var secondOccurredAt = firstOccurredAt.plusSeconds(3);
        var secondEvent = new RequestFromAudienceReceived("Wake Me Up", secondOccurredAt);
        var afterSecondEvent = afterFirstEvent.applyEvent(secondEvent);

        var averageEnergyBeforeThirdEvent = afterSecondEvent.getAverageEnergyLevel();
        var thirdEvent = new RequestFromAudienceReceived("Something like suavemente ?!?", secondOccurredAt.plusSeconds(10));

        var afterThirdEvent = afterSecondEvent.applyEvent(thirdEvent);

        assertThat(afterSecondEvent.tracks()).hasSize(2);
        assertThat(averageEnergyBeforeThirdEvent).isEqualTo(EnergyLevel.MEDIUM);
        assertThat(afterThirdEvent.tracks()).hasSize(3);
        assertThat(afterThirdEvent.tracks().getLast().song().title()).isNotEqualTo("Something like suavemente ?!?");
        assertThat(afterThirdEvent.tracks().getLast().energyLevel()).isEqualTo(averageEnergyBeforeThirdEvent);
        assertThat(afterThirdEvent.getAverageEnergyLevel()).isEqualTo(averageEnergyBeforeThirdEvent);
    }

