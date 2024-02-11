import {createAction, createFeatureSelector, createReducer, on, props} from '@ngrx/store';
import {SEARCH_QUOTES} from '../global.state';

export const searchQuoteAction = createAction(
  '[Search] search changed',
  props<{ searchValue: string }>()
);

export const searchQuoteReducer = createReducer(
  '',
  on(searchQuoteAction, (_state, {searchValue}): string => searchValue)
);

export const selectSearchQuote = createFeatureSelector<string>(SEARCH_QUOTES);
