import { Component } from '@angular/core';
import { GraphqlClientSpotlightComponent } from './graphql-client-spotlight/graphql-client-spotlight';

@Component({
  selector: 'app-mfe-spotlight',
  imports: [GraphqlClientSpotlightComponent],
  template: '<app-graphql-client-spotlight />',
})
export class RemoteAppComponent {}
