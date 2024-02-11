import {createActionGroup, props} from '@ngrx/store';
import {Quote} from '../../domain/quote.model';

export const QuoteAPIActions = createActionGroup({
  source: 'Quotes API',
  events: {
    // actions are events. not commands
    'Retrieved quotes': props<{ quotes: ReadonlyArray<Quote> }>(),
  },
});
