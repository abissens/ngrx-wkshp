import {Component, OnInit} from '@angular/core';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  Observable,
  OperatorFunction
} from 'rxjs';
import {Quote, QuoteAddRequest} from '../../domain/quote.model';
import {QuoteService} from '../../services/quote.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RequestStatus} from '../data/request.data';
import {FormControl} from '@angular/forms';
import {SearchViewService} from '../view-services/search-view.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AddQuoteComponent} from '../../components/add-quote/add-quote.component';
import {AddQuoteComponentData} from '../../components/add-quote/AddQuoteComponentData';
import {Character} from '../../domain/character.model';
import {Episode} from '../../domain/episode.model';
import {Store} from '@ngrx/store';
import {selectQuotes} from '../../store/quotes/quote.selectors';
import {QuoteAPIActions} from '../../store/quotes/quote.actions';

@Component({
  selector: 'app-quotes-view',
  templateUrl: './quotes-view.component.html',
  styleUrls: ['./quotes-view.component.less']
})
export class QuotesViewComponent implements OnInit {

  loadingQuotesStatus: RequestStatus = RequestStatus.LOADED;

  searchQuoteControl = new FormControl(this.searchService.searchQuery);

  public readonly quotes$: Observable<readonly Quote[]> = this.store.select(selectQuotes);

  private charactersSubject = new BehaviorSubject<Character[]>([]);
  private readonly allCharacters$ = this.charactersSubject.asObservable();

  private episodesSubject = new BehaviorSubject<Episode[]>([]);
  private readonly allEpisodes$ = this.episodesSubject.asObservable();

  public readonly filteredQuotes$: Observable<Quote[]> =
    this.searchService.searchQuery$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      mergeMap(searchValue => this.quotes$.pipe(map(quotes => quotes.filter(quote => this.searchFilter(quote, searchValue ?? '')))))
    );

  constructor(private quoteService: QuoteService,
              private searchService: SearchViewService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private store: Store) {
  }

  ngOnInit(): void {
    this.loadQuotes();
    this.loadCharacters();
    this.loadEpisodes();
    this.searchQuoteControl.valueChanges.subscribe(v => this.searchService.searchQuery = v ?? '');
  }

  loadQuotes(): void {
    this.loadingQuotesStatus = RequestStatus.LOADING;
    this.quoteService.getQuotes().subscribe({
      next: quotes => {
        this.loadingQuotesStatus = RequestStatus.LOADED;
        this.store.dispatch(QuoteAPIActions.retrievedQuotes({quotes: [...quotes]}))
      },
      error: err => {
        this.loadingQuotesStatus = RequestStatus.ERRORED;
        this.snackBar.open(err.message, undefined, {
          duration: 3000
        });
      },
    });
  }

  private loadCharacters() {
    this.quoteService.getCharacters().subscribe({
      next: characters => this.charactersSubject.next(characters),
      error: err => {
        this.snackBar.open(err.message, undefined, {
          duration: 3000
        });
      }
    });
  }

  private loadEpisodes() {
    this.quoteService.getEpisodes().subscribe({
      next: episodes => this.episodesSubject.next(episodes),
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

  private searchFilter(quote: Quote, searchQuery: string) {
    return quote.character?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.text.toLowerCase().includes(searchQuery.toLowerCase())
  }
}
