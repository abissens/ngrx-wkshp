import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Quote} from '../../domain/quote.model';
import {QuoteService} from '../../services/quote.service';

@Component({
  selector: 'app-quotes-view',
  templateUrl: './quotes-view.component.html',
  styleUrls: ['./quotes-view.component.less']
})
export class QuotesViewComponent implements OnInit {

  loadingQuotes = false;

  private quotesSubject = new BehaviorSubject<Quote[]>([]);
  public readonly quotes$: Observable<Quote[]> = this.quotesSubject.asObservable();

  constructor(private quoteService: QuoteService) { }

  ngOnInit(): void {
    this.loadQuotes();
  }

  loadQuotes(): void {
    this.loadingQuotes = true;
    this.quoteService.getQuotes().subscribe({
      next: quotes => this.quotesSubject.next(quotes),
      error: err => console.error('Error loading quotes:', err),
      complete: () => this.loadingQuotes = false
    });
  }

}
