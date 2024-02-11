import {Observable} from 'rxjs';
import {Character} from '../../domain/character.model';
import {Episode} from '../../domain/episode.model';

export interface AddQuoteComponentData {
  allCharacters$: Observable<readonly Character[]>
  allEpisodes$: Observable<readonly Episode[]>
}
