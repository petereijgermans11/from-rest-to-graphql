import { HttpClient } from '@angular/common/http';
import { DestroyRef, Injectable, inject, isDevMode, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, take, timer } from 'rxjs';

interface NgrokTunnel {
  name?: string;
  proto: string;
  public_url: string;
  config?: { addr?: string };
}

interface NgrokTunnelsResponse {
  tunnels: NgrokTunnel[];
}

@Injectable({ providedIn: 'root' })
export class NgrokPublicUrlService {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  private singleTunnelNgrokWsHintLogged = false;
  private readonly initialTunnelPollDone: Promise<void>;
  private settleInitialTunnelPoll!: () => void;
  private initialTunnelPollSettled = false;

  readonly baseUrl = signal<string | null>(null);
  readonly apiPublicUrl = signal<string | null>(null);

  constructor() {
    this.initialTunnelPollDone = new Promise<void>((resolve) => {
      this.settleInitialTunnelPoll = resolve;
    });

    this.scheduleTunnelPoll(0);
  }

  private scheduleTunnelPoll(delayMs: number): void {
    timer(delayMs)
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.runTunnelPoll());
  }

  private runTunnelPoll(): void {
    this.http
      .get<NgrokTunnelsResponse>('/ngrok-api/tunnels', {
        headers: { Accept: 'application/json' },
      })
      .pipe(
        catchError(() => of(null)),
        take(1),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((res) => {
        this.applyResponse(res);
        if (!this.initialTunnelPollSettled) {
          this.initialTunnelPollSettled = true;
          this.settleInitialTunnelPoll();
        }
        const nextMs = this.baseUrl() ? 2500 : 30_000;
        this.scheduleTunnelPoll(nextMs);
      });
  }

  whenInitialTunnelPollDone(): Promise<void> {
    return this.initialTunnelPollDone;
  }

  private applyResponse(res: NgrokTunnelsResponse | null): void {
    if (!res?.tunnels?.length) {
      this.baseUrl.set(null);
      this.apiPublicUrl.set(null);
      return;
    }

    const httpsTunnels = res.tunnels.filter((t) => t.proto === 'https');
    const uiTunnel =
      httpsTunnels.find((t) => tunnelAddrPort(t) === 4200) ??
      (httpsTunnels.length === 1 ? httpsTunnels[0] : undefined) ??
      httpsTunnels[0];
    const apiTunnel = httpsTunnels.find((t) => tunnelAddrPort(t) === 8080);

    this.baseUrl.set(normalizePublicUrl(uiTunnel?.public_url));
    this.apiPublicUrl.set(normalizePublicUrl(apiTunnel?.public_url));

    this.maybeLogSingleTunnelNgrokWsHint(httpsTunnels, apiTunnel);
  }

  private maybeLogSingleTunnelNgrokWsHint(
    httpsTunnels: NgrokTunnel[],
    apiTunnel: NgrokTunnel | undefined,
  ): void {
    if (
      !isDevMode() ||
      this.singleTunnelNgrokWsHintLogged ||
      typeof window === 'undefined'
    ) {
      return;
    }
    const h = window.location.hostname;
    if (!h.includes('ngrok')) {
      return;
    }
    if (apiTunnel || httpsTunnels.length !== 1) {
      return;
    }
    this.singleTunnelNgrokWsHintLogged = true;
    console.warn(
      '[MFE Crowd Vote] Live vote bars need GraphQL WebSocket. With one ngrok tunnel to :4200, WS upgrades often fail. Add a second tunnel to :8080.',
    );
  }
}

function normalizePublicUrl(raw: string | undefined): string | null {
  return raw ? raw.replace(/\/$/, '') : null;
}

function tunnelAddrPort(t: NgrokTunnel): number | null {
  const addr = t.config?.addr ?? '';
  const matches = [...addr.matchAll(/:(\d+)/g)];
  if (!matches.length) {
    return null;
  }
  return Number(matches[matches.length - 1][1]);
}
