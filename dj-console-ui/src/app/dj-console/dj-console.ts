import { CommonModule, NgComponentOutlet } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  Type,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { Apollo } from 'apollo-angular';
import {
  filter,
  finalize,
  map,
  merge,
  switchMap,
  take,
  tap,
} from 'rxjs';
import {
  APPLY_RECOVERY,
  CROWD_ENERGY_DROPPED,
  CROWD_CHEERED,
  CURRENT_MIX_SESSION,
  DANCEFLOOR_EMPTIED,
  DANCEFLOOR_FILLED_UP,
  MIX_SESSION_UPDATED,
  REQUEST_FROM_AUDIENCE,
} from '../graphql/operations';

export interface SessionTrack {
  id: string;
  energyLevel: number;
  song: {
    title: string;
    audioFile?: string | null;
    artist: { name: string };
  };
}

export interface MixSession {
  id: string;
  status: string;
  tracks: SessionTrack[];
}

/** Which crowd-event control last fired — drives single-button highlight in the deck UI. */
export type CrowdActionKey =
  | 'crowdCheered'
  | 'crowdEnergyDropped'
  | 'dancefloorEmptied'
  | 'dancefloorFilledUp'
  | 'requestFromAudience'
  | 'recovery';

const ACTION_ENERGY_LEVEL: Record<CrowdActionKey, number> = {
  crowdCheered: 10,
  crowdEnergyDropped: 5,
  dancefloorEmptied: 5,
  dancefloorFilledUp: 10,
  requestFromAudience: 5,
  recovery: 10,
};

@Component({
  selector: 'app-dj-console',
  imports: [
    CommonModule,
    FormsModule,
    NgComponentOutlet,
  ],
  templateUrl: './dj-console.html',
  styleUrl: './dj-console.scss',
})
export class DjConsoleComponent {
  private readonly apollo = inject(Apollo);
  private readonly destroyRef = inject(DestroyRef);
  private readonly audioEl = viewChild<ElementRef<HTMLAudioElement>>('audioEl');

  readonly session = signal<MixSession | undefined>(undefined);
  readonly loading = signal(true);
  /** Last-pressed crowd mutation control (exclusive highlight). */
  readonly highlightedCrowdAction = signal<CrowdActionKey | null>(null);
  readonly cheering = signal(false);
  readonly error = signal<string | undefined>(undefined);
  /** Intentionally goofy default for live audience-request demo moments. */
  readonly requestedTrackName = signal('Captain Karaoke - Uninvited Polka Remix');

  readonly currentTrack = computed(() => {
    const selectedId = this.selectedTrackId();
    const tracks = this.session()?.tracks ?? [];
    if (selectedId) {
      const selected = tracks.find((t) => t.id === selectedId);
      if (selected) {
        return selected;
      }
    }
    if (!tracks.length) {
      return undefined;
    }
    return tracks[tracks.length - 1];
  });

  readonly trackCount = computed(() => this.session()?.tracks?.length ?? 0);
  /** Demo override: audience-request action should visibly drop session mood to LOW. */
  readonly displaySessionStatus = computed(() =>
    this.highlightedCrowdAction() === 'requestFromAudience' ? 'LOW' : (this.session()?.status ?? '—'),
  );
  /** Demo energy mapping per crowd action for consistent on-stage storytelling. */
  readonly displayEnergyLevel = computed(() => {
    const action = this.highlightedCrowdAction();
    if (action) {
      return ACTION_ENERGY_LEVEL[action];
    }
    return this.currentTrack()?.energyLevel;
  });

  readonly setlistRows = computed(() => {
    const tracks = this.session()?.tracks ?? [];
    return tracks.map((t, i) => ({ key: `sl-${i}`, t }));
  });
  readonly selectedTrackId = signal<string | null>(null);

  readonly streamConnected = signal(false);

  /** Dynamically loaded Native Federation remote: Crowd Vote. */
  readonly audienceScreenComp = signal<Type<unknown> | null>(null);
  readonly audienceLoading = signal(false);

  /** Dynamically loaded Native Federation remote: Client Spotlight. */
  readonly spotlightComp = signal<Type<unknown> | null>(null);
  readonly spotlightLoading = signal(false);

  constructor() {
    const query$ = this.apollo
      .watchQuery<{ currentMixSession: MixSession }>({
        query: CURRENT_MIX_SESSION,
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(
        map((r) => r.data?.currentMixSession),
        tap(() => this.loading.set(false)),
        tap((s) => {
          if (!s) {
            this.error.set('No session data from GraphQL query.');
          }
        }),
      );

    const live$ = query$.pipe(
      filter((s): s is MixSession => !!s),
      map((s) => s.id),
      switchMap((id) =>
        this.apollo
          .subscribe<{ mixSessionUpdated: MixSession }>({
            query: MIX_SESSION_UPDATED,
            variables: { id },
          })
          .pipe(
            tap(() => this.streamConnected.set(true)),
            finalize(() => this.streamConnected.set(false)),
            map((r) => r.data?.mixSessionUpdated),
          ),
      ),
    );

    merge(query$, live$)
      .pipe(
        filter((s): s is MixSession => !!s),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (s) => {
          this.session.set(s);
          this.error.set(undefined);
        },
        error: (e: unknown) => {
          this.loading.set(false);
          this.error.set(
            e instanceof Error ? e.message : 'GraphQL error — check API & proxy.',
          );
        },
      });
  }

  async loadAudienceScreen(): Promise<void> {
    if (this.audienceScreenComp()) return;
    this.audienceLoading.set(true);
    try {
      const m = await loadRemoteModule('mfe-crowd-vote', './Component');
      this.audienceScreenComp.set(m.AudienceLiveScreenComponent);
    } catch (err) {
      console.error('Failed to load mfe-crowd-vote remote', err);
      this.error.set('Failed to load Crowd Vote remote — is it running on port 4201?');
    } finally {
      this.audienceLoading.set(false);
    }
  }

  async loadSpotlight(): Promise<void> {
    if (this.spotlightComp()) return;
    this.spotlightLoading.set(true);
    try {
      const m = await loadRemoteModule('mfe-spotlight', './Component');
      this.spotlightComp.set(m.GraphqlClientSpotlightComponent);
    } catch (err) {
      console.error('Failed to load mfe-spotlight remote', err);
      this.error.set('Failed to load Spotlight remote — is it running on port 4202?');
    } finally {
      this.spotlightLoading.set(false);
    }
  }

  cheer(): void {
    this.applyMutation(CROWD_CHEERED, {}, 'music/Last phase 1.mp3', 'crowdCheered');
  }

  crowdEnergyDropped(): void {
    this.applyMutation(CROWD_ENERGY_DROPPED, {}, 'music/Second phase 1.mp3', 'crowdEnergyDropped');
  }

  dancefloorEmptied(): void {
    this.applyMutation(DANCEFLOOR_EMPTIED, {}, 'music/Second phase 1.mp3', 'dancefloorEmptied');
  }

  dancefloorFilledUp(): void {
    this.applyMutation(DANCEFLOOR_FILLED_UP, {}, 'music/Third phase 1.mp3', 'dancefloorFilledUp');
  }

  requestFromAudience(): void {
    const trackName = this.requestedTrackName().trim();
    if (!trackName) {
      this.error.set('Please provide a track name for audience request.');
      return;
    }
    this.applyMutation(
      REQUEST_FROM_AUDIENCE,
      { trackName },
      'music/mistake.mp3',
      'requestFromAudience',
    );
  }

  recover(): void {
    this.applyMutation(
      APPLY_RECOVERY,
      {},
      'music/Last phase 1.mp3',
      'recovery',
    );
  }

  /** All deck sound uses the single native audio control bar. */
  private playUrlOnDeck(href: string): void {
    const el = this.audioEl()?.nativeElement;
    if (!el) return;
    el.pause();
    el.src = href;
    el.play().catch((err) => {
      console.warn('[DJ] Autoplay blocked — use play on the bar.', err);
    });
  }

  private playCurrentTrackOnDeck(): void {
    const file = this.currentTrack()?.song.audioFile?.trim();
    if (!file) return;
    const href = new URL(encodeURI(file), window.location.href).href;
    this.playUrlOnDeck(href);
  }

  /**
   * New src replaces the previous stream; native controls show play/pause.
   */
  selectTrack(trackId: string): void {
    this.selectedTrackId.set(trackId);
    const t = this.session()?.tracks?.find((x) => x.id === trackId);
    const file = t?.song?.audioFile?.trim();
    if (!file) return;
    const href = new URL(encodeURI(file), window.location.href).href;
    this.playUrlOnDeck(href);
  }

  private playAudio(): void {
    this.playCurrentTrackOnDeck();
  }

  private applyMutation(
    mutation: unknown,
    variables: Record<string, unknown> = {},
    fixedAudioFile?: string,
    highlightKey?: CrowdActionKey,
  ): void {
    const id = this.session()?.id;
    if (!id) {
      return;
    }
    if (highlightKey) {
      this.highlightedCrowdAction.set(highlightKey);
    }
    this.cheering.set(true);
    this.apollo
      .mutate<Record<string, MixSession>>({
        mutation: mutation as never,
        variables: { id, ...variables },
      })
      .pipe(take(1))
      .subscribe({
        next: (r) => {
          const first = r.data ? Object.values(r.data)[0] : undefined;
          if (first) {
            this.session.set(first);
            if (fixedAudioFile?.trim()) {
              const href = new URL(encodeURI(fixedAudioFile), window.location.href).href;
              this.playUrlOnDeck(href);
            } else {
              this.playAudio();
            }
          }
          this.cheering.set(false);
        },
        error: (e: unknown) => {
          this.cheering.set(false);
          this.error.set(
            e instanceof Error ? e.message : 'Mutation failed — is the API up?',
          );
        },
      });
  }
}
