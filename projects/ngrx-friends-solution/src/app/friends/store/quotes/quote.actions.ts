import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {Quote, QuoteAddRequest} from '../../domain/quote.model';
import {Character} from '../../domain/character.model';
import {Episode} from '../../domain/episode.model';

export const QuoteAPIActions = createActionGroup({
  source: 'Quotes API',
  events: {
    // actions are events. not commands
    'Retrieved quotes': props<{ quotes: ReadonlyArray<Quote> }>(),
    'Retrieved characters': props<{ allCharacters: ReadonlyArray<Character> }>(),
    'Retrieved episodes': props<{ allEpisodes: ReadonlyArray<Episode> }>(),
    'Loading quotes': emptyProps(),
    'Loaded quotes': emptyProps(),
    'Error loading quotes': props<{ err: Error }>(),
  },
});

export const QuoteActions = createActionGroup({
  source: 'Quotes',
  events: {
    'Quote adding': props<{ request: QuoteAddRequest }>(),
    'Quote added': props<{ quote: Quote }>(),
    'All quotes loading': emptyProps(),
    'All characters loading': emptyProps(),
    'All episodes loading': emptyProps(),
  },
});

