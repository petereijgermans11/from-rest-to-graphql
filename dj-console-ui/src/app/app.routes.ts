import { Routes } from '@angular/router';

import { CrowdVotePageComponent } from './crowd-vote/crowd-vote-page';
import { DjConsoleComponent } from './dj-console/dj-console';

export const routes: Routes = [
  { path: '', component: DjConsoleComponent },
  { path: 'vote', component: CrowdVotePageComponent },
  { path: '**', redirectTo: '' },
];
