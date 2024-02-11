import {createFeatureSelector, createReducer, on} from '@ngrx/store';
import {QuoteAPIActions} from '../quotes/quote.actions';
import {Character} from '../../domain/character.model';
import {ALL_CHARACTERS} from '../global.state';

export const charactersReducer = createReducer(
  [] as ReadonlyArray<Character>, // initial state
  on(QuoteAPIActions.retrievedCharacters, (_state, {[ALL_CHARACTERS]: c}): ReadonlyArray<Character> => c)
);

export const selectCharacters = createFeatureSelector<ReadonlyArray<Character>>(ALL_CHARACTERS);
