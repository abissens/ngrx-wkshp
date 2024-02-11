import {Component, Input, OnInit} from '@angular/core';
import {map, Observable} from 'rxjs';
import {Quote} from '../../domain/quote.model';

@Component({
  selector: 'app-quotes-by-character',
  templateUrl: './quotes-by-character.component.html',
  styleUrls: ['./quotes-by-character.component.less']
})
export class QuotesByCharacterComponent implements OnInit {


  @Input()
  quotes$?: Observable<Quote[]>

  byCharacter$?: Observable<QuotesByCharacter[]>;

  ngOnInit(): void {
    if (this.quotes$ === undefined) {
      throw new Error("quotes input is mandatory");
    }
    this.byCharacter$ = this.quotes$.pipe(
      map(quotes => {
        const reducedMap = quotes.reduce((acc: Map<string, number>, curr: Quote) => {
          acc.set(curr.character.name, (acc.get(curr.character.name) ?? 0) + 1);
          return acc;
        }, new Map<string, number>());

        return Array.from(reducedMap).map(([character, size]) => ({character, size}));
      })
    );
  }
}

export interface QuotesByCharacter {
  character: string
  size: number
}
