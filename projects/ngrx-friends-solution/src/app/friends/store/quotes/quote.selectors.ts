import {createFeatureSelector} from '@ngrx/store';
import {Quote} from '../../domain/quote.model';
import {LOADING_QUOTES_STATUS, QUOTES} from '../global.state';
import {RequestStatus} from '../../views/data/request.data';

export const selectQuotes = createFeatureSelector<ReadonlyArray<Quote>>(QUOTES);
export const selectLoadingQuoteStatus = createFeatureSelector<RequestStatus>(LOADING_QUOTES_STATUS);
