import {createFeatureSelector} from '@ngrx/store';
import {Quote} from '../../domain/quote.model';
import {QUOTES} from '../global.state';

export const selectQuotes = createFeatureSelector<ReadonlyArray<Quote>>(QUOTES);
