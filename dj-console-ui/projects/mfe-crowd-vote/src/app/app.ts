import { Component } from '@angular/core';
import { AudienceLiveScreenComponent } from './audience-live-screen/audience-live-screen';

@Component({
  selector: 'app-mfe-crowd-vote',
  imports: [AudienceLiveScreenComponent],
  template: '<app-audience-live-screen />',
})
export class RemoteAppComponent {}
