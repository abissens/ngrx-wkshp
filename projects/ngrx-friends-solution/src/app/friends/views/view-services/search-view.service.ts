import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SearchViewService {
  private searchQuerySubject = new BehaviorSubject<string>('');
  public readonly searchQuery$ = this.searchQuerySubject.asObservable();

  get searchQuery(): string {
    return this.searchQuerySubject.value;
  }

  set searchQuery(query: string) {
    this.searchQuerySubject.next(query);
  }
}
