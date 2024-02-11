import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, debounceTime, distinctUntilChanged, map, mergeMap, Observable, startWith} from 'rxjs';
import {Quote} from '../../domain/quote.model';
import {QuoteService} from '../../services/quote.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RequestStatus} from '../data/request.data';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-quotes-view',
  templateUrl: './quotes-view.component.html',
  styleUrls: ['./quotes-view.component.less']
})
export class QuotesViewComponent implements OnInit {

  loadingQuotesStatus: RequestStatus = RequestStatus.LOADED;

  searchQuoteControl = new FormControl('');

  private quotesSubject = new BehaviorSubject<Quote[]>([]);
  private readonly quotes$: Observable<Quote[]> = this.quotesSubject.asObservable();

  public readonly  filteredQuotes$: Observable<Quote[]> =
    this.searchQuoteControl.valueChanges.pipe(
      startWith(this.searchQuoteControl.value), // make it emit first value
      debounceTime(300),
      distinctUntilChanged(),
      mergeMap(searchValue => this.quotes$.pipe(map(quotes => quotes.filter(quote => this.searchFilter(quote, searchValue ?? '')))))
    );

  constructor(private quoteService: QuoteService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.loadQuotes();
  }

  loadQuotes(): void {
    this.loadingQuotesStatus = RequestStatus.LOADING;
    this.quoteService.getQuotes().subscribe({
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
