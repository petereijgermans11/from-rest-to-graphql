package com.github.fbascheper.dj.test.support;

import com.github.fbascheper.dj.console.domain.library.Song;
import lombok.Getter;

import static com.github.fbascheper.dj.test.support.ArtistTestObjects.*;

@Getter
public enum SongTestObjects {

    // Marco Schuitmaker songs
    ENGELBEWAARDER(MARCO_SCHUITMAKER, "Engelbewaarder"),
    VAN_GOES_TOT_PURMEREND(MARCO_SCHUITMAKER, "Van Goes Tot Purmerend"),
    ZOMERNACHT_IN_GRIEKENLAND(MARCO_SCHUITMAKER, "Zomernacht in Griekenland"),

    // Madonna songs
    LIKE_A_VIRGIN(MADONNA, "Like a Virgin"),
    MATERIAL_GIRL(MADONNA, "Material Girl"),
    PAPA_DONT_PREACH(MADONNA, "Papa Don’t Preach"),
    LIKE_A_PRAYER(MADONNA, "Like a Prayer"),
    VOGUE(MADONNA, "Vogue"),
    EXPRESS_YOURSELF(MADONNA, "Express Yourself"),
    HOLIDAY(MADONNA, "Holiday"),
    BORDERLINE(MADONNA, "Borderline"),
    INTO_THE_GROOVE(MADONNA, "Into the Groove"),
    LA_ISLA_BONITA(MADONNA, "La Isla Bonita"),

    // Avicii songs
 	WAKE_ME_UP(AVICII, "Wake Me Up"),
    HEY_BROTHER(AVICII, "Hey Brother"),
    LEVELS(AVICII, "Levels"),
    WAITING_FOR_LOVE(AVICII, "Waiting for Love"),
    YOU_MAKE_ME(AVICII, "You Make Me"),
    ADDICTED_TO_YOU(AVICII, "Addicted to You"),
    I_COULD_BE_THE_ONE(AVICII, "I Could Be the One"),
    THE_DAYS(AVICII, "The Days"),
    THE_NIGHTS(AVICII, "The Nights"),
    WITHOUT_YOU(AVICII, "Without You"),

    // Martin Garrix songs
    IN_THE_NAME_OF_LOVE(MARTIN_GARRIX, "In the Name of Love"),
    SCARED_TO_BE_LONELY(MARTIN_GARRIX, "Scared to Be Lonely"),
    ANIMALS(MARTIN_GARRIX, "Animals"),
    HIGH_ON_LIFE(MARTIN_GARRIX, "High On Life"),
    SUMMER_DAYS(MARTIN_GARRIX, "Summer Days"),
    VIRUS(MARTIN_GARRIX, "Virus"),
    FORBIDDEN_VOICES(MARTIN_GARRIX, "Forbidden Voices"),
    THE_ONLY_WAY_IS_UP(MARTIN_GARRIX, "The Only Way Is Up"),

    // Golden Earring songs
    RADAR_LOVE(GOLDEN_EARRING, "Radar Love"),
    TWILIGHT_ZONE(GOLDEN_EARRING, "Twilight Zone"),
    WHEN_THE_LADY_SMILES(GOLDEN_EARRING, "When the Lady Smiles"),
    SHE_FLIES_ON_STRANGE_WINGS(GOLDEN_EARRING, "She Flies on Strange Wings"),
    BACK_HOME(GOLDEN_EARRING, "Back Home"),
    GOING_TO_THE_RUN(GOLDEN_EARRING, "Going to the Run"),
    LONG_BLOND_ANIMAL(GOLDEN_EARRING, "Long Blond Animal"),
    JUST_A_LITTLE_BIT_OF_PEACE_IN_MY_HEART(GOLDEN_EARRING, "Just a Little Bit of Peace in My Heart"),
    ANOTHER_45_MILES(GOLDEN_EARRING, "Another 45 Miles"),
    SLEEPWALKIN(GOLDEN_EARRING, "Sleepwalkin’");

    private Song instance;

    SongTestObjects(ArtistTestObjects artists, String title) {
        this.instance = Song.builder()
                .artist(artists.getInstance())
                .title(title)
                .build();
    }

}
