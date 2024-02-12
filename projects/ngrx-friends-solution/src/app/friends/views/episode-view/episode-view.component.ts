import {Component, OnInit, Signal} from '@angular/core';
import {RequestStatus} from '../data/request.data';
import {debounceTime, distinctUntilChanged, Observable} from 'rxjs';
import {Quote} from '../../domain/quote.model';
import {ActivatedRoute} from '@angular/router';
import {FormControl} from '@angular/forms';
import {searchQuoteAction, selectSearchQuote} from '../../store/view/view.store';
import {Store} from '@ngrx/store';
import {QuoteActions} from '../../store/quotes/quote.actions';
import {
  selectFilteredQuotesForEpisodeFactory,
  selectLoadingQuoteStatus,
  selectQuotesForEpisodeFactory
} from '../../store/quotes/quote.selectors';

@Component({
  selector: 'app-episode-view',
  templateUrl: './episode-view.component.html',
  styleUrls: ['./episode-view.component.less']
})
export class EpisodeViewComponent implements OnInit {

  loadingQuotesStatus: Signal<RequestStatus> = this.store.selectSignal(selectLoadingQuoteStatus);

  private searchQuoteSignal = this.store.selectSignal(selectSearchQuote);

  searchQuoteControl = new FormControl(this.searchQuoteSignal());

  public quotes$?: Observable<Quote[]>;

  public filteredQuotes$?: Observable<Quote[]>;

  constructor(private store: Store,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const episodeId = +params['id'];
      this.quotes$ = this.store.select(selectQuotesForEpisodeFactory(episodeId));
      this.filteredQuotes$ = this.store.select(selectFilteredQuotesForEpisodeFactory(episodeId));

      this.loadQuotes();
      this.searchQuoteControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(v => this.store.dispatch(searchQuoteAction({searchValue: v ?? ''})));
    });
  }

  loadQuotes(): void {
    this.store.dispatch(QuoteActions.allQuotesLoading());
  }
}
