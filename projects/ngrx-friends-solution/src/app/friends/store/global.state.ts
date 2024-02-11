import {Quote} from '../domain/quote.model';
import {Character} from '../domain/character.model';
import {Episode} from '../domain/episode.model';

export const QUOTES = 'quotes';
export const ALL_CHARACTERS = 'allCharacters';
export const ALL_EPISODES = 'allEpisodes';

export interface FriendState {
  [QUOTES]: ReadonlyArray<Quote>
  [ALL_CHARACTERS]: ReadonlyArray<Character>
  [ALL_EPISODES]: ReadonlyArray<Episode>
}
