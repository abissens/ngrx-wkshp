import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {QuotesViewComponent} from './friends/views/quotes-view/quotes-view.component';
import {EpisodeViewComponent} from './friends/views/episode-view/episode-view.component';

const routes: Routes = [
  { path: 'quotes', component: QuotesViewComponent },
  { path: 'episodes/:id', component: EpisodeViewComponent },
  { path: '', redirectTo: '/quotes', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
