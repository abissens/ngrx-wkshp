import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QuotesViewComponent} from './views/quotes-view/quotes-view.component';
import {EpisodeViewComponent} from './views/episode-view/episode-view.component';
import {RouterLink} from '@angular/router';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {AddQuoteComponent} from './components/add-quote/add-quote.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import { QuotesByCharacterComponent } from './components/quotes-by-character/quotes-by-character.component';
import {MatBadgeModule} from '@angular/material/badge';
import {StoreModule} from '@ngrx/store';
import {QUOTES} from './store/global.state';
import {quotesReducer} from './store/quotes/quote.reducers';


@NgModule({
  declarations: [
    QuotesViewComponent,
    EpisodeViewComponent,
    AddQuoteComponent,
    QuotesByCharacterComponent
  ],
  imports: [
    CommonModule,
    RouterLink,
    MatProgressBarModule,
    MatSnackBarModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatBadgeModule,
    StoreModule.forRoot({
      [QUOTES]: quotesReducer,
    }),
  ]
})
export class FriendsModule { }
