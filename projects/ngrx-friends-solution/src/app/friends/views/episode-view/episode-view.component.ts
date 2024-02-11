import {Component, OnInit, Signal} from '@angular/core';
import {RequestStatus} from '../data/request.data';
import {debounceTime, distinctUntilChanged, map, mergeMap, Observable} from 'rxjs';
import {Quote} from '../../domain/quote.model';
import {QuoteService} from '../../services/quote.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';
import {FormControl} from '@angular/forms';
import {searchQuoteAction, selectSearchQuote} from '../../store/view/view.store';
import {Store} from '@ngrx/store';
import {QuoteAPIActions} from '../../store/quotes/quote.actions';
import {selectLoadingQuoteStatus, selectQuotesForEpisodeFactory} from '../../store/quotes/quote.selectors';

@Component({
  selector: 'app-episode-view',
  templateUrl: './episode-view.component.html',
  styleUrls: ['./episode-view.component.less']
})
export class EpisodeViewComponent implements OnInit {

  loadingQuotesStatus: Signal<RequestStatus> = this.store.selectSignal(selectLoadingQuoteStatus);

  private searchQuoteSignal = this.store.selectSignal(selectSearchQuote);
  private readonly searchQuote$ = this.store.select(selectSearchQuote);

  searchQuoteControl = new FormControl(this.searchQuoteSignal());

  public quotes$?: Observable<Quote[]>;

  public readonly filteredQuotes$: Observable<Quote[]> =
    this.searchQuote$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      mergeMap(searchValue => this.quotes$!.pipe(map(quotes => quotes.filter(quote => this.searchFilter(quote, searchValue ?? '')))))
    );

  constructor(private quoteService: QuoteService,
              private store: Store,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const episodeId = +params['id'];
      this.quotes$ = this.store.select(selectQuotesForEpisodeFactory(episodeId));
      this.loadQuotes();
      this.searchQuoteControl.valueChanges.subscribe(v => this.store.dispatch(searchQuoteAction({searchValue: v ?? ''})));
    });
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

  private searchFilter(quote: Quote, searchQuery: string) {
    return quote.character?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.text.toLowerCase().includes(searchQuery.toLowerCase())
  }
}
