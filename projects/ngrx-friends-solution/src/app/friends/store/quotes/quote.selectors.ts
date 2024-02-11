import {createFeatureSelector, createSelector} from '@ngrx/store';
import {Quote} from '../../domain/quote.model';
import {LOADING_QUOTES_STATUS, QUOTES} from '../global.state';
import {RequestStatus} from '../../views/data/request.data';
import {selectSearchQuote} from '../view/view.store';

export const selectQuotes = createFeatureSelector<ReadonlyArray<Quote>>(QUOTES);
export const selectLoadingQuoteStatus = createFeatureSelector<RequestStatus>(LOADING_QUOTES_STATUS);

export const selectQuotesForEpisodeFactory = (episodeId: number) => createSelector(
  selectQuotes,
  quotes => quotes.filter(quote => quote.episode.id === episodeId)
);

export const selectFilteredQuotes = createSelector(
  selectQuotes,
  selectSearchQuote,
  (quotes, searchValue) => quotes.filter(q => searchFilter(q, searchValue))
)

export const selectFilteredQuotesForEpisodeFactory = (episodeId: number) =>createSelector(
  selectQuotesForEpisodeFactory(episodeId),
  selectSearchQuote,
  (quotes, searchValue) => quotes.filter(q => searchFilter(q, searchValue))
)


function searchFilter(q: Quote, searchValue: string) {
  return q.character?.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    q.text.toLowerCase().includes(searchValue.toLowerCase())
}
