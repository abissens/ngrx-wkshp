import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {QuoteActions, QuoteAPIActions} from './quote.actions';
import {catchError, concat, EMPTY, map, mergeMap, of, tap} from 'rxjs';
import {QuoteService} from '../../services/quote.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable()
export class QuoteEffects {

  addQuote$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(QuoteActions.quoteAdding),
        mergeMap(data =>
          this.quoteService.addQuote(data.request).pipe(
            map(newQuote => QuoteActions.quoteAdded({quote: newQuote})),
            catchError(() => EMPTY)
          )))
    }
  );

  loadAllQuotes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuoteActions.allQuotesLoading),
      mergeMap(() =>
        concat(
          of(QuoteAPIActions.loadingQuotes()),
          this.quoteService.getQuotes().pipe(
            map(quotes => QuoteAPIActions.retrievedQuotes({quotes})),
            catchError((err: Error) => of(QuoteAPIActions.errorLoadingQuotes({err})))
          )
        ))
    )
  });

  retrievedQuotes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuoteAPIActions.retrievedQuotes),
      map(() => QuoteAPIActions.loadedQuotes())
    )
  });

  errorLoadingQuotes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuoteAPIActions.errorLoadingQuotes),
      tap(e => this.snackBar.open(e.err.message, undefined, {duration: 3000})) // this is bad pattern, instead dispatch or use original action + selection
    )
  }, {dispatch: false});

  loadAllCharacters$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(QuoteActions.allCharactersLoading),
        mergeMap(() =>
          this.quoteService.getCharacters().pipe(
            map(allCharacters => QuoteAPIActions.retrievedCharacters({allCharacters})),
            catchError(() => EMPTY)
          )))
    }
  );

  loadAllEpisodes$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(QuoteActions.allEpisodesLoading),
        mergeMap(() =>
          this.quoteService.getEpisodes().pipe(
            map(allEpisodes => QuoteAPIActions.retrievedEpisodes({allEpisodes})),
            catchError(() => EMPTY)
          )));
    }
  );

  constructor(
    private actions$: Actions,
    private quoteService: QuoteService,
    private snackBar: MatSnackBar // should not be here
  ) {
  }
}
