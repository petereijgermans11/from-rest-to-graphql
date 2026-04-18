package com.github.fbascheper.dj.console.domain.event;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import java.time.LocalDateTime;

/**
 * Sealed domain event hierarchy representing an observable audience signal during a DJ set.
 *
 * <p>Events are applied to the {@link com.github.fbascheper.dj.console.domain.session.MixSession}
 * aggregate via {@code MixSession.applyEvent(CrowdEvent)}, which uses a Java sealed-type
 * {@code switch} expression to decide the next track.
 *
 * <p>Events are value objects — they carry only the {@code occurredAt} timestamp and any
 * additional context needed by the track-selection algorithm.
 *
 * <p>Permitted subtypes and their track-selection semantics:
 * <ul>
 *   <li>{@link CrowdCheered} — audience approves; continue at current average energy level</li>
 *   <li>{@link CrowdEnergyDropped} — energy dip detected; escalate one energy level via {@code EnergyLevel.next()}</li>
 *   <li>{@link DancefloorEmptied} — floor cleared; immediately select the highest-energy available track</li>
 *   <li>{@link DancefloorFilledUp} — floor full again; match current average energy level</li>
 *   <li>{@link RequestFromAudienceReceived} — audience requests a track by title; falls back
 *       to average-energy selection when the requested title is unknown</li>
 * </ul>
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "@type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = CrowdCheered.class,                name = "CrowdCheered"),
        @JsonSubTypes.Type(value = CrowdEnergyDropped.class,          name = "CrowdEnergyDropped"),
        @JsonSubTypes.Type(value = DancefloorEmptied.class,           name = "DancefloorEmptied"),
        @JsonSubTypes.Type(value = DancefloorFilledUp.class,          name = "DancefloorFilledUp"),
        @JsonSubTypes.Type(value = RequestFromAudienceReceived.class, name = "RequestFromAudienceReceived"),
})
public sealed interface CrowdEvent
        permits CrowdEnergyDropped, DancefloorFilledUp, DancefloorEmptied, CrowdCheered, RequestFromAudienceReceived {

    LocalDateTime occurredAt();
}

