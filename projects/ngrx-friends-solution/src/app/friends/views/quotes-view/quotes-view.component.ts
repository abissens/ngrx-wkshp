import {Component, OnInit, Signal} from '@angular/core';
import {debounceTime, distinctUntilChanged, filter, mergeMap, Observable, OperatorFunction} from 'rxjs';
import {Quote, QuoteAddRequest} from '../../domain/quote.model';
import {QuoteService} from '../../services/quote.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RequestStatus} from '../data/request.data';
import {FormControl} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AddQuoteComponent} from '../../components/add-quote/add-quote.component';
import {AddQuoteComponentData} from '../../components/add-quote/AddQuoteComponentData';
import {Store} from '@ngrx/store';
import {selectFilteredQuotes, selectLoadingQuoteStatus, selectQuotes} from '../../store/quotes/quote.selectors';
import {QuoteAPIActions} from '../../store/quotes/quote.actions';
import {selectCharacters} from '../../store/characters/characters.store';
import {selectEpisodes} from '../../store/episodes/episodes.store';
import {searchQuoteAction, selectSearchQuote} from '../../store/view/view.store';

@Component({
  selector: 'app-quotes-view',
  templateUrl: './quotes-view.component.html',
  styleUrls: ['./quotes-view.component.less']
})
export class QuotesViewComponent implements OnInit {

  loadingQuotesStatus: Signal<RequestStatus> = this.store.selectSignal(selectLoadingQuoteStatus);

  private searchQuoteSignal = this.store.selectSignal(selectSearchQuote);

  searchQuoteControl = new FormControl(this.searchQuoteSignal());

  public readonly quotes$: Observable<readonly Quote[]> = this.store.select(selectQuotes);

  private readonly allCharacters$ = this.store.select(selectCharacters);

  private readonly allEpisodes$ = this.store.select(selectEpisodes);

  public readonly filteredQuotes$: Observable<Quote[]> = this.store.select(selectFilteredQuotes);

  constructor(private quoteService: QuoteService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private store: Store) {
  }

  ngOnInit(): void {
    this.loadQuotes();
    this.loadCharacters();
    this.loadEpisodes();
    this.searchQuoteControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(v => this.store.dispatch(searchQuoteAction({searchValue: v ?? ''})));
  }

  loadQuotes(): void {
    this.store.dispatch(QuoteAPIActions.loadingQuotes());
    this.quoteService.getQuotes().subscribe({
      next: quotes => {
        this.store.dispatch(QuoteAPIActions.loadedQuotes());
        this.store.dispatch(QuoteAPIActions.retrievedQuotes({quotes: [...quotes]}))
      },
      error: err => {
        this.store.dispatch(QuoteAPIActions.errorLoadingQuotes());
        this.snackBar.open(err.message, undefined, {
          duration: 3000
        });
      },
    });
  }

  private loadCharacters() {
    this.quoteService.getCharacters().subscribe({
      next: characters => this.store.dispatch(QuoteAPIActions.retrievedCharacters({allCharacters: [...characters]})),
      error: err => {
        this.snackBar.open(err.message, undefined, {
          duration: 3000
        });
      }
    });
  }

  private loadEpisodes() {
    this.quoteService.getEpisodes().subscribe({
      next: episodes => this.store.dispatch(QuoteAPIActions.retrievedEpisodes({allEpisodes: [...episodes]})),
      error: err => {
        this.snackBar.open(err.message, undefined, {
          duration: 3000
        });
      }
    });
  }

  openDialog(): void {
    const dialogRef: MatDialogRef<AddQuoteComponent, QuoteAddRequest> = this.dialog.open<AddQuoteComponent, AddQuoteComponentData>(AddQuoteComponent, {
      width: '500px',
      data: {
        allCharacters$: this.allCharacters$,
        allEpisodes$: this.allEpisodes$
      }
    });

    dialogRef.afterClosed()
      .pipe(
        filter(quote => quote !== undefined) as OperatorFunction<QuoteAddRequest | undefined, QuoteAddRequest>,
        mergeMap(quote => this.quoteService.addQuote(quote)))
      .subscribe(() => {
        this.loadQuotes();
      });
  }
}
