import { inject } from '@angular/core';
import { ApolloClient, InMemoryCache, split, type ApolloClientOptions } from '@apollo/client';
import { HttpLink } from '@apollo/client/link/http';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

import { NgrokPublicUrlService } from '../services/ngrok-public-url.service';

function sameHostGraphqlWsUrl(): string {
  const loc = window.location;
  const protocol = loc.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${loc.host}/graphql`;
}

/** Turn ngrok `public_url` (https://…) into graphql-ws URL on the API. */
function apiPublicUrlToGraphqlWs(httpsBase: string): string {
  const trimmed = httpsBase.replace(/\/$/, '');
  if (trimmed.startsWith('https://')) {
    return `wss://${trimmed.slice('https://'.length)}/graphql`;
  }
  if (trimmed.startsWith('http://')) {
    return `ws://${trimmed.slice('http://'.length)}/graphql`;
  }
  return `${trimmed}/graphql`;
}

/**
 * Apollo Client factory (injection context). Subscriptions use graphql-ws.
 *
 * - **localhost/127.0.0.1:** `ws://host:8080/graphql` — avoids Vite WebSocket proxy quirks.
 * - **ngrok + second tunnel to 8080:** `wss://<api-tunnel>/graphql` — same tunnel path the
 *   browser already uses for HTTPS CORS; subscriptions skip the broken 4200-only upgrade chain.
 * - Otherwise: same origin `/graphql` (works when the dev proxy upgrades reliably).
 */
export function createApolloOptions(): ApolloClientOptions {
  const ngrok = inject(NgrokPublicUrlService);

  const httpLink = new HttpLink({
    uri: '/graphql',
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      url: async () => {
        if (typeof window !== 'undefined') {
          const { hostname, protocol } = window.location;
          if (hostname === 'localhost' || hostname === '127.0.0.1') {
            const wsProto = protocol === 'https:' ? 'wss:' : 'ws:';
            return `${wsProto}//${hostname}:8080/graphql`;
          }
        }
        await ngrok.whenInitialTunnelPollDone();
        const apiTunnel = ngrok.apiPublicUrl();
        if (apiTunnel) {
          return apiPublicUrlToGraphqlWs(apiTunnel);
        }
        return typeof window !== 'undefined'
          ? sameHostGraphqlWsUrl()
          : 'ws://localhost:8080/graphql';
      },
      lazy: true,
      retryAttempts: Number.POSITIVE_INFINITY,
    }),
  );

  const link = split(
    ({ query }) => {
      const def = getMainDefinition(query);
      return (
        def.kind === 'OperationDefinition' &&
        def.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  );

  return {
    link,
    cache: new InMemoryCache(),
  };
}
