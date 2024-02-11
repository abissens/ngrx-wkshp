import {Component, OnInit} from '@angular/core';
import {RequestStatus} from '../data/request.data';
import {BehaviorSubject, debounceTime, distinctUntilChanged, map, mergeMap, Observable} from 'rxjs';
import {Quote} from '../../domain/quote.model';
import {QuoteService} from '../../services/quote.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';
import {FormControl} from '@angular/forms';
import {SearchViewService} from '../view-services/search-view.service';

@Component({
  selector: 'app-episode-view',
  templateUrl: './episode-view.component.html',
  styleUrls: ['./episode-view.component.less']
})
export class EpisodeViewComponent implements OnInit {
  loadingQuotesStatus: RequestStatus = RequestStatus.LOADED;

  searchQuoteControl = new FormControl(this.searchService.searchQuery);

  private quotesSubject = new BehaviorSubject<Quote[]>([]);
  private readonly quotes$: Observable<Quote[]> = this.quotesSubject.asObservable();

  public readonly filteredQuotes$: Observable<Quote[]> =
    this.searchService.searchQuery$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      mergeMap(searchValue => this.quotes$.pipe(map(quotes => quotes.filter(quote => this.searchFilter(quote, searchValue ?? '')))))
    );
  constructor(private quoteService: QuoteService,
              private searchService: SearchViewService,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const episodeId = +params['id'];
      this.loadQuotesForEpisode(episodeId);
      this.searchQuoteControl.valueChanges.subscribe(v => this.searchService.searchQuery = v??'');
    });
  }

  loadQuotesForEpisode(episodeId: number): void {
    this.loadingQuotesStatus = RequestStatus.LOADING;
    this.quoteService.getQuotes()
      .pipe(map(quotes => quotes.filter(q => q.episode.id === episodeId)))
      .subscribe({
        next: quotes => {
          this.loadingQuotesStatus = RequestStatus.LOADED;
          this.quotesSubject.next(quotes);
        },
        error: err => {
          this.loadingQuotesStatus = RequestStatus.ERRORED;
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
