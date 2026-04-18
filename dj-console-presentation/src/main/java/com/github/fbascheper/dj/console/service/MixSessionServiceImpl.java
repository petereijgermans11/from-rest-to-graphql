package com.github.fbascheper.dj.console.service;

import com.github.fbascheper.dj.console.domain.event.CrowdCheered;
import com.github.fbascheper.dj.console.domain.session.MixSession;
import com.github.fbascheper.dj.console.domain.session.MixSessionRepository;
import com.github.fbascheper.dj.console.exception.MixSessionNotActiveException;
import com.github.fbascheper.dj.console.exception.MixSessionNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class MixSessionServiceImpl implements MixSessionService {

    private final MixSessionRepository repository;

    public MixSessionServiceImpl(MixSessionRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public MixSession getCurrentSession() {
        return repository.findCurrent()
                .orElseThrow(() -> new MixSessionNotActiveException("active session"));
    }

    @Override
    @Transactional(readOnly = true)
    public MixSession getSessionById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new MixSessionNotFoundException(id.toString()));
    }

    @Override
    @Transactional
    public MixSession applyCrowdCheered(UUID id) {
        var session = getSessionById(id);
        var updated = session.applyEvent(new CrowdCheered(LocalDateTime.now()));
        return repository.save(updated);
    }

}