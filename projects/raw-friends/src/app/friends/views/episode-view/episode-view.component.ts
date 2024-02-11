import {Component, OnInit} from '@angular/core';
import {RequestStatus} from '../data/request.data';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {Quote} from '../../domain/quote.model';
import {QuoteService} from '../../services/quote.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-episode-view',
  templateUrl: './episode-view.component.html',
  styleUrls: ['./episode-view.component.less']
})
export class EpisodeViewComponent implements OnInit {
  loadingQuotesStatus: RequestStatus = RequestStatus.LOADED;

  private quotesSubject = new BehaviorSubject<Quote[]>([]);
  public readonly quotes$: Observable<Quote[]> = this.quotesSubject.asObservable();

  constructor(private quoteService: QuoteService,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const episodeId = +params['id'];
      this.loadQuotesForEpisode(episodeId);
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
}
