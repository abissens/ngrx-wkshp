import {Component, OnInit, Signal} from '@angular/core';
import {debounceTime, distinctUntilChanged, Observable} from 'rxjs';
import {Quote} from '../../domain/quote.model';
import {RequestStatus} from '../data/request.data';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {AddQuoteComponent} from '../../components/add-quote/add-quote.component';
import {Store} from '@ngrx/store';
import {selectFilteredQuotes, selectLoadingQuoteStatus, selectQuotes} from '../../store/quotes/quote.selectors';
import {QuoteActions} from '../../store/quotes/quote.actions';
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

  public readonly filteredQuotes$: Observable<Quote[]> = this.store.select(selectFilteredQuotes);

  constructor(private dialog: MatDialog,
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
    this.store.dispatch(QuoteActions.allQuotesLoading());
  }

  private loadCharacters() {
    this.store.dispatch(QuoteActions.allCharactersLoading());
  }

  private loadEpisodes() {
    this.store.dispatch(QuoteActions.allEpisodesLoading());
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddQuoteComponent, {width: '500px'});

    dialogRef.afterClosed().subscribe(quoteRequest => {
      if (quoteRequest === undefined) {
        return;
      }
      this.store.dispatch(QuoteActions.quoteAdding({request: quoteRequest}))
    });
  }
}
