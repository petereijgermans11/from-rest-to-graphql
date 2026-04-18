package com.github.fbascheper.dj.console.infrastructure;

import com.github.fbascheper.dj.console.domain.session.MixSession;
import com.github.fbascheper.dj.console.domain.session.MixSessionRepository;
import com.github.fbascheper.dj.console.infrastructure.persistence.MixSessionEntity;
import com.github.fbascheper.dj.console.infrastructure.persistence.SpringDataMixSessionJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public class MixSessionRepositoryImpl implements MixSessionRepository {

    private final SpringDataMixSessionJpaRepository jpa;

    public MixSessionRepositoryImpl(SpringDataMixSessionJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public Optional<MixSession> findCurrent() {
        // FIXME: Example policy: "current" is the most recently updated/created session.
        // TODO: Implement a real policy that matches your domain (e.g., a flag on the entity).
        return jpa.findAll()
                .stream()
                // naive: last in list; replace with real criteria
                .reduce((a, b) -> b)
                .map(MixSessionEntity::getSession);
    }

    @Override
    public Optional<MixSession> findById(UUID id) {
        return jpa.findById(id).map(MixSessionEntity::getSession);
    }

    @Override
    public MixSession save(MixSession session) {
        jpa.save(new MixSessionEntity(session.id().value(), session));
        return session;
    }
}