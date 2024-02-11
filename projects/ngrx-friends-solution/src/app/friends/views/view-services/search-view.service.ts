import {Injectable} from "@angular/core";
import {Store} from '@ngrx/store';
import {searchQuoteAction, selectSearchQuote} from '../../store/view/view.store';

@Injectable({
  providedIn: 'root'
})
export class SearchViewService {
  private searchQuerySignal = this.store.selectSignal(selectSearchQuote);

  constructor(private store: Store) {
  }

  get searchQuery(): string {
    return this.searchQuerySignal();
  }

  set searchQuery(searchValue: string) {
    this.store.dispatch(searchQuoteAction({searchValue}));
  }
}
