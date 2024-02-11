import {Quote} from '../domain/quote.model';

export const QUOTES = 'quoteS';

export interface FriendState {
  [QUOTES]: ReadonlyArray<Quote>
}
