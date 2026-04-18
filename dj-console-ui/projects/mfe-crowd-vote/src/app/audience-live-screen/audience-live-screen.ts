import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Apollo, gql } from 'apollo-angular';
import QRCode from 'qrcode';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  from,
  map,
  merge as rxMerge,
  of,
  shareReplay,
  Subscription,
  switchMap,
  take,
  tap,
  timer,
} from 'rxjs';

import type { VoteTally } from '../vote.types';
import { NgrokPublicUrlService } from '../ngrok-public-url.service';

const AUDIENCE_SESSION = gql`
  query AudienceSession {
    currentMixSession {
      id
      status
      tracks(last: 1) {
        song {
          title
          audioFile
          artist { name }
        }
        energyLevel
      }
    }
  }
`;

const AUDIENCE_SESSION_UPDATED = gql`
  subscription AudienceSessionUpdated($id: ID!) {
    mixSessionUpdated(id: $id) {
      id
      status
      tracks(last: 1) {
        song {
          title
          audioFile
          artist { name }
        }
        energyLevel
      }
    }
  }
`;

const AUDIENCE_VOTE_TALLY = gql`
  query AudienceVoteTally($id: ID!) {
    voteTally(id: $id) {
      sessionId
      totalVotes
      choices { slot label votes }
    }
  }
`;

const AUDIENCE_VOTE_TALLY_UPDATED = gql`
  subscription AudienceVoteTallyUpdated($id: ID!) {
    crowdVoteTallyUpdated(id: $id) {
      sessionId
      totalVotes
      choices { slot label votes }
    }
  }
`;

const AUDIENCE_RESET_VOTE = gql`
  mutation AudienceResetVote($id: ID!) {
    resetCrowdVote(id: $id) {
      sessionId
      totalVotes
      choices { slot label votes }
    }
  }
`;

const AUDIENCE_APPLY_WINNER = gql`
  mutation AudienceApplyWinner($id: ID!) {
    applyCrowdVoteWinner(id: $id) {
      id
      status
      tracks(last: 1) {
        song {
          title
          audioFile
          artist { name }
        }
        energyLevel
      }
    }
  }
`;

interface AudienceTrack {
  song: { title: string; audioFile?: string | null; artist: { name: string } };
  energyLevel: number;
}

interface AudienceSession {
  id: string;
  status: string;
  tracks: AudienceTrack[];
}

interface AudienceQrRow {
  slot: number;
  label: string;
  url: string;
  qrDataUrl: string;
}

/**
 * Crowd Vote Live — Native Federation remote.
 *
 * Owns all vote-related GraphQL operations (Q + M + S) independently
 * from the DJ console. Uses a lighter selection set to demonstrate
 * how different clients query only what they need from the same schema.
 */
@Component({
  selector: 'app-audience-live-screen',
  imports: [CommonModule],
  templateUrl: './audience-live-screen.html',
  styleUrl: './audience-live-screen.scss',
})
export class AudienceLiveScreenComponent {
  private readonly apollo = inject(Apollo);
  private readonly destroyRef = inject(DestroyRef);
  readonly ngrokPublic = inject(NgrokPublicUrlService);
  private countdownSub?: Subscription;

  readonly session = signal<AudienceSession | undefined>(undefined);
  readonly voteTally = signal<VoteTally | undefined>(undefined);
  readonly connected = signal(false);
  readonly voteTallyConnected = signal(false);
  readonly showQrCodes = signal(false);
  readonly voteQrRows = signal<AudienceQrRow[]>([]);
  readonly voteCountdown = signal<number | null>(null);
  readonly voteBusy = signal(false);
  readonly error = signal<string | undefined>(undefined);
  /** Absolute URL for winner track — set after applyCrowdVoteWinner; play via button (browser autoplay rules). */
  readonly winnerPlayUrl = signal<string | null>(null);
  readonly winnerTrackTitle = signal<string | null>(null);

  private readonly BAR_PERCENT_PER_VOTE = 10;

  readonly currentTrack = computed(() => {
    const tracks = this.session()?.tracks ?? [];
    return tracks.length ? tracks[tracks.length - 1] : undefined;
  });

  readonly energyPercent = computed(() => {
    const energy = this.currentTrack()?.energyLevel ?? 0;
    return Math.min(100, energy * 10);
  });

  readonly voteBars = computed(() => {
    const tally = this.voteTally();
    if (!tally?.choices?.length) return [];
    return tally.choices.map((c) => ({
      slot: c.slot,
      label: c.label,
      votes: c.votes,
      percent: Math.min(100, c.votes * this.BAR_PERCENT_PER_VOTE),
    }));
  });

  constructor() {
    const sessionId$ = this.apollo
      .query<{ currentMixSession: AudienceSession }>({
        query: AUDIENCE_SESSION,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        take(1),
        map((r) => r.data?.currentMixSession),
        filter((s): s is AudienceSession => !!s),
        tap((s) => this.session.set(s)),
        map((s) => s.id),
        shareReplay(1),
      );

    sessionId$
      .pipe(
        switchMap((id) =>
          this.apollo
            .subscribe<{ mixSessionUpdated: AudienceSession }>({
              query: AUDIENCE_SESSION_UPDATED,
              variables: { id },
            })
            .pipe(
              tap(() => this.connected.set(true)),
              finalize(() => this.connected.set(false)),
              map((r) => r.data?.mixSessionUpdated),
              filter((s): s is AudienceSession => !!s),
            ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((s) => this.session.set(s));

    sessionId$
      .pipe(
        switchMap((id) =>
          rxMerge(
            this.apollo
              .query<{ voteTally: VoteTally }>({
                query: AUDIENCE_VOTE_TALLY,
                variables: { id },
                fetchPolicy: 'no-cache',
              })
              .pipe(
                take(1),
                map((r) => r.data?.voteTally),
                filter((t): t is VoteTally => !!t),
              ),
            this.apollo
              .subscribe<{ crowdVoteTallyUpdated: VoteTally }>({
                query: AUDIENCE_VOTE_TALLY_UPDATED,
                variables: { id },
              })
              .pipe(
                tap(() => this.voteTallyConnected.set(true)),
                finalize(() => this.voteTallyConnected.set(false)),
                map((r) => r.data?.crowdVoteTallyUpdated),
                filter((t): t is VoteTally => !!t),
              ),
          ),
        ),
        distinctUntilChanged(
          (a, b) =>
            a.totalVotes === b.totalVotes &&
            a.choices.length === b.choices.length &&
            a.choices.every(
              (c, i) => c.slot === b.choices[i]?.slot && c.votes === b.choices[i]?.votes,
            ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((t) => this.voteTally.set(t));

    const choiceStructure$ = toObservable(this.voteTally).pipe(
      filter((t): t is VoteTally => !!t),
      map((t) => t.choices.map((c) => ({ slot: c.slot, label: c.label }))),
      distinctUntilChanged(
        (a, b) =>
          a.length === b.length &&
          a.every((c, i) => c.slot === b[i].slot && c.label === b[i].label),
      ),
    );

    combineLatest([
      toObservable(this.ngrokPublic.baseUrl),
      choiceStructure$,
      toObservable(this.showQrCodes),
    ])
      .pipe(
        filter(([base, , show]) => !!base && show),
        debounceTime(40),
        switchMap(([base, choices]) => {
          if (!base || !choices.length) return of<AudienceQrRow[]>([]);
          return from(
            Promise.all(
              choices.map(async (c) => {
                const voteUrl = `${base}/vote?slot=${c.slot}`;
                const qrDataUrl = await QRCode.toDataURL(voteUrl, {
                  width: 220,
                  margin: 1,
                  color: { dark: '#0a0a0f', light: '#f4efe6' },
                });
                return { slot: c.slot, label: c.label, url: voteUrl, qrDataUrl } satisfies AudienceQrRow;
              }),
            ),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((rows) => this.voteQrRows.set(rows));
  }

  resetCrowdVotes(): void {
    const id = this.session()?.id;
    if (!id) return;
    this.winnerPlayUrl.set(null);
    this.winnerTrackTitle.set(null);
    this.voteBusy.set(true);
    this.apollo
      .mutate<{ resetCrowdVote: VoteTally }>({
        mutation: AUDIENCE_RESET_VOTE,
        variables: { id },
      })
      .pipe(take(1))
      .subscribe({
        next: (r) => {
          const tally = r.data?.resetCrowdVote;
          if (tally) {
            this.voteTally.set(tally);
          }
        },
        error: (e: unknown) => {
          console.error('[CrowdVote] reset error:', e);
          this.error.set(e instanceof Error ? e.message : 'resetCrowdVote failed.');
        },
      });
  }

  startPlayWinnerCountdown(): void {
    this.cancelWinnerCountdown();
    this.winnerPlayUrl.set(null);
    this.winnerTrackTitle.set(null);
    this.voteCountdown.set(10);
    this.countdownSub = timer(0, 1000)
      .pipe(take(11), map((i) => 10 - i))
      .subscribe((v) => {
        this.voteCountdown.set(v);
        if (v === 0) {
          this.countdownSub?.unsubscribe();
          this.countdownSub = undefined;
          this.finalizeCrowdVoteWinner();
        }
      });
  }

  cancelWinnerCountdown(): void {
    this.countdownSub?.unsubscribe();
    this.countdownSub = undefined;
    this.voteCountdown.set(null);
  }

  private finalizeCrowdVoteWinner(): void {
    const id = this.session()?.id;
    if (!id) return;
    this.voteBusy.set(true);
    this.apollo
      .mutate<{ applyCrowdVoteWinner: AudienceSession }>({
        mutation: AUDIENCE_APPLY_WINNER,
        variables: { id },
      })
      .pipe(take(1))
      .subscribe({
        next: (r) => {
          const next = r.data?.applyCrowdVoteWinner;
          if (next) {
            this.session.set(next);
            const track = next.tracks?.[next.tracks.length - 1] ?? next.tracks?.[0];
            const file = track?.song?.audioFile?.trim();
            const title = track?.song?.title ?? null;
            if (file) {
              const href = new URL(encodeURI(file), window.location.href).href;
              this.winnerPlayUrl.set(href);
              this.winnerTrackTitle.set(title);
            } else {
              this.winnerPlayUrl.set(null);
              this.winnerTrackTitle.set(null);
            }
          }
          this.voteBusy.set(false);
          this.voteCountdown.set(null);
        },
        error: (e: unknown) => {
          this.voteBusy.set(false);
          this.voteCountdown.set(null);
          this.winnerPlayUrl.set(null);
          this.winnerTrackTitle.set(null);
          this.error.set(e instanceof Error ? e.message : 'applyCrowdVoteWinner failed.');
        },
      });
  }

  /** Must stay synchronous in the click handler so the browser allows playback. */
  playWinningTrack(): void {
    const url = this.winnerPlayUrl();
    if (!url) return;
    const audio = new Audio(url);
    audio.play().catch((err) => {
      console.warn('[CrowdVote] playWinningTrack failed:', err);
    });
  }
}
