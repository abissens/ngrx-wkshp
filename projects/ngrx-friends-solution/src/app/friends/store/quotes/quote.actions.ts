import {createActionGroup, props} from '@ngrx/store';
import {Quote} from '../../domain/quote.model';
import {Character} from '../../domain/character.model';
import {Episode} from '../../domain/episode.model';
import {ALL_CHARACTERS, ALL_EPISODES, QUOTES} from '../global.state';

export const QuoteAPIActions = createActionGroup({
  source: 'Quotes API',
  events: {
    // actions are events. not commands
    'Retrieved quotes': props<{ [QUOTES]: ReadonlyArray<Quote> }>(),
    'Retrieved characters': props<{ [ALL_CHARACTERS]: ReadonlyArray<Character> }>(),
    'Retrieved episodes': props<{ [ALL_EPISODES]: ReadonlyArray<Episode> }>(),
  },
});
