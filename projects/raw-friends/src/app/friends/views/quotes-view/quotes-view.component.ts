import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Quote} from '../../domain/quote.model';
import {QuoteService} from '../../services/quote.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RequestStatus} from '../data/request.data';

@Component({
  selector: 'app-quotes-view',
  templateUrl: './quotes-view.component.html',
  styleUrls: ['./quotes-view.component.less']
})
export class QuotesViewComponent implements OnInit {

  loadingQuotesStatus: RequestStatus = RequestStatus.LOADED;

  private quotesSubject = new BehaviorSubject<Quote[]>([]);
  public readonly quotes$: Observable<Quote[]> = this.quotesSubject.asObservable();

  constructor(private quoteService: QuoteService,
              private snackBar: MatSnackBar) { }

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
        this.snackBar.open(err.message , undefined, {
          duration: 3000
        });
      },
    });
  }

}
