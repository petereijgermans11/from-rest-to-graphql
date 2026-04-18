import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { RemoteAppComponent } from './app/app';

bootstrapApplication(RemoteAppComponent, appConfig)
  .catch((err) => console.error(err));
