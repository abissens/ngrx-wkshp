import {Injectable} from '@angular/core';
import {Character} from '../domain/character.model';
import {Episode} from '../domain/episode.model';
import {Quote, QuoteAddRequest} from '../domain/quote.model';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  constructor() {
  }

  getQuotes(): Observable<Quote[]> {
    return of(this.quotes);
  }

  getCharacters(): Observable<Character[]> {
    return of(this.characters);
  }

  getEpisodes(): Observable<Episode[]> {
    return of(this.episodes);
  }

  addQuote(newQuote: QuoteAddRequest): Observable<Quote> {
    const character = this.addOrGetCharacter(newQuote.character);
    const episode = this.addOrGetEpisode(newQuote.season, newQuote.episodeTitle);
    const toAdd = {
      character,
      episode,
      text: newQuote.text
    };
    this.quotes.push(toAdd);
    return of(toAdd);
  }

  deleteQuote(index: number): Observable<void> {
    this.quotes.splice(index, 1);
    return of();
  }

  private addOrGetCharacter(character: string): Character {
    const existing = this.characters.find(c => c.name === character);
    if (existing) {
      return existing;
    }
    const nextId = Math.max(...this.characters.map(c => c.id)) + 1;
    const newCharacter = {
      id: nextId,
      name: character
    }
    this.characters.push(newCharacter);
    return newCharacter;
  }

  private addOrGetEpisode(season: number, title: string): Episode {
    const existing = this.episodes.find(e => e.season === season && e.title === title);
    if (existing) {
      return existing;
    }
    const nextId = Math.max(...this.episodes.map(e => e.id)) + 1;
    const newEpisode: Episode = {
      id: nextId,
      title,
      season
    }
    this.episodes.push(newEpisode);
    return newEpisode;
  }

  private characters: Character[] = [
    {id: 1, name: 'Chandler Bing'},
    {id: 2, name: 'Joey Tribbiani'},
    {id: 3, name: 'Rachel Green'},
    {id: 4, name: 'Ross Geller'},
    {id: 5, name: 'Monica Geller'},
    {id: 6, name: 'Phoebe Buffay'},
  ];
  private episodes: Episode[] = [
    {id: 1, title: 'The One Where No One s Ready', season: 3},
    {id: 2, title: 'The One with the East German Laundry Detergent', season: 1},
    {id: 3, title: 'The Last One', season: 10}
  ];

  private quotes: Quote[] = [
    {character: this.characters[0], text: 'Could I be wearing any more clothes?', episode: this.episodes[0]},
    {character: this.characters[1], text: 'How you doin ?', episode: this.episodes[1]},
    {
      character: this.characters[2],
      text: 'It\'s like all my life everyone\'s always leaving.',
      episode: this.episodes[2]
    },
    {character: this.characters[3], text: 'Pivot!', episode: this.episodes[1]},
    {character: this.characters[4], text: 'I know!', episode: this.episodes[2]},
    {character: this.characters[5], text: 'Smelly cat, smelly cat...', episode: this.episodes[0]},
    {character: this.characters[0], text: 'Could I be any more sarcastic?', episode: this.episodes[2]},
    {character: this.characters[1], text: 'Joey doesn\'t share food!', episode: this.episodes[2]},
    {character: this.characters[2], text: 'We were on a break!', episode: this.episodes[1]},
    {character: this.characters[3], text: 'Unagi', episode: this.episodes[0]},
    {
      character: this.characters[4],
      text: 'Welcome to the real world. It sucks! You\'re gonna love it!',
      episode: this.episodes[1]
    },
    {character: this.characters[5], text: 'Oh. My. God.', episode: this.episodes[2]},
    {character: this.characters[0], text: 'Could I BE any more excited?', episode: this.episodes[0]},
    {character: this.characters[1], text: 'How you doin\'?', episode: this.episodes[2]},
    {
      character: this.characters[2],
      text: 'It\'s not that common, it doesn\'t happen to every guy, and it IS a big deal!',
      episode: this.episodes[1]
    },
    {character: this.characters[3], text: 'We\'ve got history.', episode: this.episodes[0]},
    {character: this.characters[4], text: 'Seven! Seven! Seven!', episode: this.episodes[2]},
    {
      character: this.characters[5],
      text: 'Oh, you like that? You should hear my phone number.',
      episode: this.episodes[0]
    },
    {character: this.characters[0], text: 'Could I BE more like Chandler?', episode: this.episodes[2]},
  ];
}
