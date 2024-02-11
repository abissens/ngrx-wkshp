import {createReducer, on} from '@ngrx/store';
import {Quote} from '../../domain/quote.model';
import {QuoteAPIActions} from './quote.actions';

export const quotesReducer = createReducer(
  [] as ReadonlyArray<Quote>, // initial state
  on(QuoteAPIActions.retrievedQuotes, (_state, {quotes}): ReadonlyArray<Quote> => quotes)
  // Note : on function should have explicit return type
  // Check ngrx eslint https://ngrx.io/guide/eslint-plugin/rules/on-function-explicit-return-type

);
