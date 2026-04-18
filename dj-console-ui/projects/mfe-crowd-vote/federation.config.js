const {
  withNativeFederation,
  share,
} = require('@angular-architects/native-federation/config');

const cfg = { singleton: true, strictVersion: true, requiredVersion: 'auto' };

module.exports = withNativeFederation({
  name: 'mfe-crowd-vote',
  exposes: {
    './Component':
      './projects/mfe-crowd-vote/src/app/audience-live-screen/audience-live-screen.ts',
  },
  shared: share({
    '@angular/core': cfg,
    '@angular/common': cfg,
    '@angular/common/http': cfg,
    '@angular/platform-browser': cfg,
    '@angular/router': cfg,
    '@angular/forms': cfg,
    '@angular/compiler': cfg,
    'rxjs': cfg,
    'apollo-angular': cfg,
    '@apollo/client': cfg,
    'graphql': cfg,
  }),
  skip: [
    'crossws',
    'graphql-ws',
    'qrcode',
    '@angular/platform-server',
  ],
});
