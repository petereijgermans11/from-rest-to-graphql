import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { exhaustMap, filter, map, take } from 'rxjs';

import type { MixSession } from '../dj-console/dj-console';
import { CAST_CROWD_VOTE, CURRENT_MIX_SESSION } from '../graphql/operations';

@Component({
  selector: 'app-crowd-vote-page',
  imports: [CommonModule],
  templateUrl: './crowd-vote-page.html',
  styleUrl: './crowd-vote-page.scss',
})
export class CrowdVotePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly apollo = inject(Apollo);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(true);
  readonly done = signal(false);
  readonly error = signal<string | undefined>(undefined);

  readonly requestedSlot = computed(() => {
    const raw = this.route.snapshot.queryParamMap.get('slot');
    if (raw === null || raw === '') {
      return undefined;
    }
    const n = Number.parseInt(raw, 10);
    if (Number.isNaN(n) || n < 0 || n > 2) {
      return undefined;
    }
    return n;
  });

  constructor() {
    const slot = this.requestedSlot();
    if (slot === undefined) {
      this.loading.set(false);
      this.error.set('Missing or invalid slot. Use ?slot=0, ?slot=1, or ?slot=2.');
      return;
    }

    this.apollo
      .query<{ currentMixSession: MixSession }>({
        query: CURRENT_MIX_SESSION,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        take(1),
        map((r) => r.data?.currentMixSession),
        filter((s): s is MixSession => !!s),
        exhaustMap((session) =>
          this.apollo.mutate({
            mutation: CAST_CROWD_VOTE,
            variables: { id: session.id, slot },
          }),
        ),
        take(1),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.done.set(true);
          this.error.set(undefined);
        },
        error: (e: unknown) => {
          this.loading.set(false);
          this.done.set(false);
          this.error.set(
            e instanceof Error ? e.message : 'Vote failed — check network and API.',
          );
        },
      });
  }
}
