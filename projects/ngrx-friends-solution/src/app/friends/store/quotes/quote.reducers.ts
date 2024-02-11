import {createReducer, on} from '@ngrx/store';
import {Quote} from '../../domain/quote.model';
import {QuoteActions, QuoteAPIActions} from './quote.actions';
import {RequestStatus} from '../../views/data/request.data';

export const quotesReducer = createReducer(
  [] as ReadonlyArray<Quote>, // initial state
  on(QuoteAPIActions.retrievedQuotes, (_state, {quotes}): ReadonlyArray<Quote> => quotes),
  // Note : on function should have explicit return type
  // Check ngrx eslint https://ngrx.io/guide/eslint-plugin/rules/on-function-explicit-return-type
  on(QuoteActions.quoteAdded, (state, {quote}): ReadonlyArray<Quote> => [...state, quote])
);

export const loadingQuoteStatusReducer = createReducer(
  RequestStatus.LOADING,
  on(QuoteAPIActions.loadingQuotes, (): RequestStatus => RequestStatus.LOADING),
  on(QuoteAPIActions.loadedQuotes, (): RequestStatus => RequestStatus.LOADED),
  on(QuoteAPIActions.errorLoadingQuotes, (): RequestStatus => RequestStatus.ERRORED),
);




