package com.github.fbascheper.dj.test.support;

import com.github.fbascheper.dj.console.domain.session.MixSession;

public final class MixSessionTestObjects {

    private MixSessionTestObjects() {
        // prevent instantiation
    }

    public static MixSession laurensEmptyMixSession() {
        var djLaurens = DiscJockeyTestObjects.djLaurens();

        return MixSession.builder()
                .dj(djLaurens)
                .build();
    }

}
