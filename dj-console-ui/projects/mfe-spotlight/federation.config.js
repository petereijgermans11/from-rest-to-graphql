const {
  withNativeFederation,
  share,
} = require('@angular-architects/native-federation/config');

const cfg = { singleton: true, strictVersion: true, requiredVersion: 'auto' };

module.exports = withNativeFederation({
  name: 'mfe-spotlight',
  exposes: {
    './Component':
      './projects/mfe-spotlight/src/app/graphql-client-spotlight/graphql-client-spotlight.ts',
  },
  shared: share({
    '@angular/core': cfg,
    '@angular/common': cfg,
    '@angular/common/http': cfg,
    '@angular/platform-browser': cfg,
    '@angular/compiler': cfg,
    'rxjs': cfg,
  }),
  skip: [
    'crossws',
    'graphql-ws',
    '@angular/platform-server',
  ],
});
