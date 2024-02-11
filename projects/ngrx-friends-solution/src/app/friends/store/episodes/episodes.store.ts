import {createFeatureSelector, createReducer, on} from '@ngrx/store';
import {QuoteAPIActions} from '../quotes/quote.actions';
import {ALL_EPISODES} from '../global.state';
import {Episode} from '../../domain/episode.model';

export const episodesReducer = createReducer(
  [] as ReadonlyArray<Episode>, // initial state
  on(QuoteAPIActions.retrievedEpisodes, (_state, {[ALL_EPISODES]: e}): ReadonlyArray<Episode> => e)
);

export const selectEpisodes = createFeatureSelector<ReadonlyArray<Episode>>(ALL_EPISODES);
