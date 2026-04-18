import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { take } from 'rxjs';

/**
 * Static + live comparison: REST "fat GET" vs GraphQL clients (DJ Console & Crowd Vote).
 * Native Federation remote — supports the "From REST to GraphQL" narrative.
 */
@Component({
  selector: 'app-graphql-client-spotlight',
  imports: [CommonModule],
  templateUrl: './graphql-client-spotlight.html',
  styleUrl: './graphql-client-spotlight.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphqlClientSpotlightComponent {
  private readonly http = inject(HttpClient);

  readonly currentMixSessionQuery = `query CurrentMixSession {
  currentMixSession {
    id
    status
    tracks {          # all tracks (full setlist)
      id              # track id (selection / audio playback)
      energyLevel
      song {
        title
        audioFile     # local mp3 path
        artist { name }
      }
    }
  }
}`;

  readonly audienceSessionQuery = `query AudienceSession {
  currentMixSession {
    id
    status
    tracks(last: 1) {  # only the last track
      song {
        title
        artist { name }
      }
      energyLevel
    }                   # no track id, no audioFile
  }
}`;

  readonly restLoading = signal(false);
  readonly restError = signal<string | undefined>(undefined);
  readonly restBytes = signal<number | null>(null);
  readonly restPreview = signal<string | undefined>(undefined);

  constructor() {
    this.fetchRestSample();
  }

  fetchRestSample(): void {
    this.restLoading.set(true);
    this.restError.set(undefined);
    this.http
      .get('/api/sessions/current', { responseType: 'text' })
      .pipe(take(1))
      .subscribe({
        next: (body) => {
          const encoder = new TextEncoder();
          this.restBytes.set(encoder.encode(body).length);
          this.restPreview.set(body.length > 900 ? `${body.slice(0, 900)}…` : body);
          this.restLoading.set(false);
        },
        error: (e: unknown) => {
          this.restLoading.set(false);
          this.restBytes.set(null);
          this.restPreview.set(undefined);
          this.restError.set(
            e instanceof Error ? e.message : 'Failed to load REST sample (is the API running?)',
          );
        },
      });
  }
}
