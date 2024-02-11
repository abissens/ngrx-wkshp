import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotesViewComponent } from './views/quotes-view/quotes-view.component';
import { EpisodeViewComponent } from './views/episode-view/episode-view.component';



@NgModule({
  declarations: [
    QuotesViewComponent,
    EpisodeViewComponent
  ],
  imports: [
    CommonModule
  ]
})
export class FriendsModule { }
