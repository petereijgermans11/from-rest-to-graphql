package com.github.fbascheper.dj.console.domain.session;

import com.github.fbascheper.dj.test.support.DiscJockeyTestObjects;
import com.github.fbascheper.dj.test.support.TrackTestObjects;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class DiscJockeyTest {

    @Test
    void findNextNewTrackWithHighestEnergyLevel_excludesRadarLoveAndWakeMeUp() {
        // Arrange
        var djLaurens = DiscJockeyTestObjects.djLaurens();
        var alreadyPlayed = List.of(
                SessionTrack.fromLibrary(TrackTestObjects.TRACK_RADAR_LOVE.getInstance()),
                SessionTrack.fromLibrary(TrackTestObjects.TRACK_WAKE_ME_UP.getInstance())
        );

        // Act
        var nextTrack = djLaurens.findNextNewTrackWithHighestEnergyLevel(alreadyPlayed);

        // Assert
        assertThat(nextTrack).isNotIn(alreadyPlayed);
        assertThat(nextTrack.energyLevel()).isEqualTo(EnergyLevel.HIGH);
    }

    @Test
    void findNextNewTrack_fallbackWhenDesiredEnergyLevelNotAvailable() {
        // Arrange
        var djLaurens = DiscJockeyTestObjects.djLaurens();
        // Exclude all MEDIUM energy tracks
        var alreadyPlayed = List.of(
                SessionTrack.fromLibrary(TrackTestObjects.TRACK_RADAR_LOVE.getInstance()),
                SessionTrack.fromLibrary(TrackTestObjects.TRACK_WAKE_ME_UP.getInstance())
        );

        // Act
        // Request a MEDIUM track when all MEDIUM tracks are already played
        // This should trigger the orElseGet fallback to findNextNewTrackWithHighestEnergyLevel(trackLibrary)
        // Note: The fallback passes trackLibrary as the exclusion list, which filters out ALL tracks,
        // so the method returns the first track in the library via orElseGet(trackLibrary::getFirst)
        var nextTrack = djLaurens.findNextNewTrack(EnergyLevel.MEDIUM, alreadyPlayed);

        // Assert
        // Should return a track (tests that the lambda in orElseGet is invoked)
        assertThat(nextTrack).isNotNull();
        // The fallback returns the first track since all are excluded
        assertThat(nextTrack.song().title()).isEqualTo(TrackTestObjects.TRACK_VAN_GOES_TOT_PURMEREND.getInstance().song().title());
    }

}

