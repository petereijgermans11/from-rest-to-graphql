package com.github.fbascheper.dj.test.support;

import com.github.fbascheper.dj.console.domain.library.Artist;

public enum ArtistTestObjects {

    MARCO_SCHUITMAKER("Marco Schuitmaker"),
    GOLDEN_EARRING("Golden Earring"),
    TINA_TURNER("Tina Turner"),
    THE_BEATLES("The Beatles"),
    MADONNA("Madonna"),
    MiCHAEL_JACKSON("Michael Jackson"),
    ROLLING_STONES("Rolling Stones"),
    QUEEN("Queen"),
    U2("U2"),
    COLDPLAY("Coldplay"),
    ADELE("Adele"),
    ED_SHEERAN("Ed Sheeran"),
    BRUNO_MARS("Bruno Mars"),
    BEYONCE("Beyoncé"),
    RIHANNA("Rihanna"),
    TAYLOR_SWIFT("Taylor Swift"),
    KATY_PERRY("Katy Perry"),
    JUSTIN_BIEBER("Justin Bieber"),
    ARIANA_GRANDE("Ariana Grande"),
    AVICII("Avicii"),
    TIESTO("Tiësto"),
    MARTIN_GARRIX("Martin Garrix"),
    CALVIN_HARRIS("Calvin Harris"),
    DAVID_GUETTA("David Guetta"),
    SKRILLEX("Skrillex");

    private final Artist instance;

    ArtistTestObjects(String name) {
        this.instance = Artist.builder()
                .name(name)
                .build();
    }

    public Artist getInstance() {
        return instance;
    }
}
