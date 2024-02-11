import {Character} from './character.model';
import {Episode} from './episode.model';

export interface Quote {
  character: Character
  episode: Episode
  text: string
}

export interface QuoteAddRequest {
  character: string
  season: number
  episodeTitle: string
  text: string
}
