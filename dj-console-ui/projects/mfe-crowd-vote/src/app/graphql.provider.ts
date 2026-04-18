import { inject } from '@angular/core';
import { ApolloClient, InMemoryCache, split, type ApolloClientOptions } from '@apollo/client';
import { HttpLink } from '@apollo/client/link/http';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

import { NgrokPublicUrlService } from './ngrok-public-url.service';

function sameHostGraphqlWsUrl(): string {
  const loc = window.location;
  const protocol = loc.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${loc.host}/graphql`;
}

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
