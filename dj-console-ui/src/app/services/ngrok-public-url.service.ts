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

/**
 * Reads forwarding URLs from the ngrok agent API (default http://127.0.0.1:4040).
 * The dev server proxies {@code GET /ngrok-api/tunnels} → {@code /api/tunnels}.
 *
 * **QR / HTTP:** use the tunnel aimed at the Angular dev server (port **4200**).
 * **GraphQL WebSocket:** when a second tunnel targets the API (**8080**), its public URL
 * is exposed so subscriptions can bypass the flaky Vite WS upgrade through a single 4200 tunnel.
 */
@Injectable({ providedIn: 'root' })
export class NgrokPublicUrlService {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  private singleTunnelNgrokWsHintLogged = false;
  private readonly initialTunnelPollDone: Promise<void>;
  private settleInitialTunnelPoll!: () => void;
  private initialTunnelPollSettled = false;

  /** HTTPS URL for the UI (port 4200), e.g. https://abc.ngrok-free.app */
  readonly baseUrl = signal<string | null>(null);

  /**
   * HTTPS URL for the Spring API (port 8080) when a dedicated tunnel exists, e.g.
   * https://xyz.ngrok-free.app — used to build `wss://…/graphql`. Null when only one tunnel (4200).
   */
  readonly apiPublicUrl = signal<string | null>(null);

  constructor() {
    this.initialTunnelPollDone = new Promise<void>((resolve) => {
      this.settleInitialTunnelPoll = resolve;
    });

    this.scheduleTunnelPoll(0);
  }

  /**
   * When ngrok is down, polling every 2.5s spams Vite with proxy errors (connection to :4040
   * refused). Poll slowly until we see a tunnel URL, then switch to 2.5s for QR refresh.
   */
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

  /** First ngrok agent response (or error → null), so GraphQL WS can pick the :8080 tunnel URL. */
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
      '[DJ Console] Live vote bars need GraphQL WebSocket. With one ngrok tunnel to :4200, WS upgrades often fail. Add a second tunnel to :8080 (see dj-console-ui README "ngrok & WebSocket").',
    );
  }
}

function normalizePublicUrl(raw: string | undefined): string | null {
  return raw ? raw.replace(/\/$/, '') : null;
}

/** Parses trailing port from ngrok config.addr, e.g. http://localhost:4200 → 4200 */
function tunnelAddrPort(t: NgrokTunnel): number | null {
  const addr = t.config?.addr ?? '';
  const matches = [...addr.matchAll(/:(\d+)/g)];
  if (!matches.length) {
    return null;
  }
  return Number(matches[matches.length - 1][1]);
}
