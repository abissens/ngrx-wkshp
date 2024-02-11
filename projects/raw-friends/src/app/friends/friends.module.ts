import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QuotesViewComponent} from './views/quotes-view/quotes-view.component';
import {EpisodeViewComponent} from './views/episode-view/episode-view.component';
import {RouterLink} from '@angular/router';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSnackBarModule} from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    QuotesViewComponent,
    EpisodeViewComponent
  ],
  imports: [
    CommonModule,
    RouterLink,
    MatProgressBarModule,
    MatSnackBarModule
  ]
})
export class FriendsModule { }
